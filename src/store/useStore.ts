import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, MenuItem, Table, Order, InventoryItem, Reservation, Notification } from '@/types';
import { mockUsers, mockMenuItems, mockTables, mockOrders, mockInventory, mockReservations } from '@/data/mockData';

interface StoreState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => boolean;
  logout: () => void;
  
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Tables
  tables: Table[];
  updateTable: (id: string, updates: Partial<Table>) => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: 'pending' | 'preparing' | 'ready') => void;
  deleteOrder: (id: string) => void;
  
  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Analytics
  getTodaySales: () => number;
  getTodayOrders: () => number;
  getActiveOrders: () => Order[];
  getPendingOrders: () => Order[];
  getReadyOrders: () => Order[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      login: (email: string, _password: string) => {
        // Simple mock authentication - in production, this would validate against a backend
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null, isAuthenticated: false }),
      
      // Users
      users: mockUsers,
      addUser: (user) => {
        const newUser = { ...user, id: Date.now().toString(), createdAt: new Date() };
        set(state => ({ users: [...state.users, newUser] }));
      },
      updateUser: (id, updates) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
        }));
      },
      deleteUser: (id) => {
        set(state => ({ users: state.users.filter(u => u.id !== id) }));
      },
      
      // Menu
      menuItems: mockMenuItems,
      addMenuItem: (item) => {
        const newItem = { ...item, id: Date.now().toString() };
        set(state => ({ menuItems: [...state.menuItems, newItem] }));
      },
      updateMenuItem: (id, updates) => {
        set(state => ({
          menuItems: state.menuItems.map(i => i.id === id ? { ...i, ...updates } : i)
        }));
      },
      deleteMenuItem: (id) => {
        set(state => ({ menuItems: state.menuItems.filter(i => i.id !== id) }));
      },
      
      // Tables
      tables: mockTables,
      updateTable: (id, updates) => {
        set(state => ({
          tables: state.tables.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
      },
      
      // Orders
      orders: mockOrders,
      addOrder: (order) => {
        const now = new Date();
        const newOrder = { 
          ...order, 
          id: Date.now().toString(), 
          createdAt: now, 
          updatedAt: now 
        };
        set(state => ({ orders: [...state.orders, newOrder] }));
        
        // Update table status
        if (order.tableId) {
          get().updateTable(order.tableId, { 
            status: 'occupied', 
            currentOrderId: newOrder.id 
          });
        }
      },
      updateOrder: (id, updates) => {
        set(state => ({
          orders: state.orders.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date() } : o)
        }));
      },
      updateOrderItemStatus: (orderId, itemId, status) => {
        set(state => ({
          orders: state.orders.map(o => {
            if (o.id === orderId) {
              const updatedItems = o.items.map(i => 
                i.id === itemId ? { ...i, status } : i
              );
              return { ...o, items: updatedItems, updatedAt: new Date() };
            }
            return o;
          })
        }));
      },
      deleteOrder: (id) => {
        const order = get().orders.find(o => o.id === id);
        if (order?.tableId) {
          get().updateTable(order.tableId, { status: 'available', currentOrderId: undefined });
        }
        set(state => ({ orders: state.orders.filter(o => o.id !== id) }));
      },
      
      // Inventory
      inventory: mockInventory,
      addInventoryItem: (item) => {
        const newItem = { ...item, id: Date.now().toString() };
        set(state => ({ inventory: [...state.inventory, newItem] }));
      },
      updateInventoryItem: (id, updates) => {
        set(state => ({
          inventory: state.inventory.map(i => i.id === id ? { ...i, ...updates } : i)
        }));
      },
      deleteInventoryItem: (id) => {
        set(state => ({ inventory: state.inventory.filter(i => i.id !== id) }));
      },
      
      // Reservations
      reservations: mockReservations,
      addReservation: (reservation) => {
        const newReservation = { ...reservation, id: Date.now().toString(), createdAt: new Date() };
        set(state => ({ reservations: [...state.reservations, newReservation] }));
      },
      updateReservation: (id, updates) => {
        set(state => ({
          reservations: state.reservations.map(r => r.id === id ? { ...r, ...updates } : r)
        }));
      },
      deleteReservation: (id) => {
        set(state => ({ reservations: state.reservations.filter(r => r.id !== id) }));
      },
      
      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const newNotification = { 
          ...notification, 
          id: Date.now().toString(), 
          createdAt: new Date() 
        };
        set(state => ({ 
          notifications: [newNotification, ...state.notifications].slice(0, 50) 
        }));
      },
      markNotificationAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },
      clearNotifications: () => set({ notifications: [] }),
      
      // Analytics helpers
      getTodaySales: () => {
        const today = new Date().toDateString();
        return get().orders
          .filter(o => o.createdAt.toDateString() === today && o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + o.total, 0);
      },
      getTodayOrders: () => {
        const today = new Date().toDateString();
        return get().orders.filter(o => o.createdAt.toDateString() === today).length;
      },
      getActiveOrders: () => {
        return get().orders.filter(o => 
          ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
        );
      },
      getPendingOrders: () => {
        return get().orders.filter(o => o.status === 'pending');
      },
      getReadyOrders: () => {
        return get().orders.filter(o => o.status === 'ready');
      },
    }),
    {
      name: 'restaurant-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
        menuItems: state.menuItems,
        tables: state.tables,
        orders: state.orders,
        inventory: state.inventory,
        reservations: state.reservations,
        notifications: state.notifications,
      }),
    }
  )
);
