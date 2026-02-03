// User Roles
export type UserRole = 'admin' | 'manager' | 'chef' | 'waiter' | 'cashier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}

// Menu Items
export type Category = 'appetizer' | 'main_course' | 'dessert' | 'beverage' | 'salad' | 'soup';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  ingredients: string[];
  calories?: number;
}

// Tables
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  location: string;
}

// Orders
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'digital_wallet';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready';
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  table: Table;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  tip?: number;
  createdAt: Date;
  updatedAt: Date;
  servedBy: string; // waiter id
  notes?: string;
}

// Inventory
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplier?: string;
  lastRestocked?: Date;
  expiryDate?: Date;
}

// Reservations
export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tableId?: string;
  partySize: number;
  date: Date;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  specialRequests?: string;
  createdAt: Date;
}

// Analytics
export interface DailySales {
  date: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface CategorySales {
  category: Category;
  totalSales: number;
  itemCount: number;
}

// Notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
  userId?: string;
}
