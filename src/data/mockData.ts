import type { User, MenuItem, Table, Order, InventoryItem, Reservation, UserRole } from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@restaurant.com', role: 'admin', isActive: true, createdAt: new Date('2024-01-01'), phone: '+1 555-0101' },
  { id: '2', name: 'John Manager', email: 'manager@restaurant.com', role: 'manager', isActive: true, createdAt: new Date('2024-01-15'), phone: '+1 555-0102' },
  { id: '3', name: 'Chef Mario', email: 'chef@restaurant.com', role: 'chef', isActive: true, createdAt: new Date('2024-02-01'), phone: '+1 555-0103' },
  { id: '4', name: 'Sarah Waiter', email: 'waiter@restaurant.com', role: 'waiter', isActive: true, createdAt: new Date('2024-02-15'), phone: '+1 555-0104' },
  { id: '5', name: 'Mike Cashier', email: 'cashier@restaurant.com', role: 'cashier', isActive: true, createdAt: new Date('2024-03-01'), phone: '+1 555-0105' },
  { id: '6', name: 'Lisa Waiter', email: 'lisa@restaurant.com', role: 'waiter', isActive: true, createdAt: new Date('2024-03-15'), phone: '+1 555-0106' },
];

export const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Caesar Salad', description: 'Fresh romaine lettuce with parmesan, croutons, and Caesar dressing', price: 12.99, category: 'salad', isAvailable: true, preparationTime: 10, ingredients: ['romaine', 'parmesan', 'croutons', 'caesar dressing'], calories: 350 },
  { id: '2', name: 'Bruschetta', description: 'Grilled bread topped with tomatoes, garlic, and fresh basil', price: 9.99, category: 'appetizer', isAvailable: true, preparationTime: 8, ingredients: ['bread', 'tomatoes', 'garlic', 'basil', 'olive oil'], calories: 280 },
  { id: '3', name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables', price: 28.99, category: 'main_course', isAvailable: true, preparationTime: 20, ingredients: ['salmon', 'butter', 'lemon', 'vegetables'], calories: 520 },
  { id: '4', name: 'Ribeye Steak', description: '12oz prime ribeye with mashed potatoes and asparagus', price: 42.99, category: 'main_course', isAvailable: true, preparationTime: 25, ingredients: ['ribeye', 'potatoes', 'asparagus', 'butter'], calories: 850 },
  { id: '5', name: 'Chicken Alfredo', description: 'Fettuccine pasta with creamy Alfredo sauce and grilled chicken', price: 22.99, category: 'main_course', isAvailable: true, preparationTime: 18, ingredients: ['pasta', 'chicken', 'cream', 'parmesan', 'butter'], calories: 720 },
  { id: '6', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center and vanilla ice cream', price: 10.99, category: 'dessert', isAvailable: true, preparationTime: 12, ingredients: ['chocolate', 'flour', 'eggs', 'butter', 'ice cream'], calories: 450 },
  { id: '7', name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers', price: 9.99, category: 'dessert', isAvailable: true, preparationTime: 5, ingredients: ['mascarpone', 'espresso', 'ladyfingers', 'cocoa'], calories: 380 },
  { id: '8', name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 6.99, category: 'beverage', isAvailable: true, preparationTime: 3, ingredients: ['oranges'], calories: 120 },
  { id: '9', name: 'House Red Wine', description: 'Premium Cabernet Sauvignon', price: 12.99, category: 'beverage', isAvailable: true, preparationTime: 1, ingredients: ['wine'], calories: 125 },
  { id: '10', name: 'Tomato Soup', description: 'Creamy tomato soup with fresh basil', price: 8.99, category: 'soup', isAvailable: true, preparationTime: 10, ingredients: ['tomatoes', 'cream', 'basil', 'onions'], calories: 220 },
  { id: '11', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 6.99, category: 'appetizer', isAvailable: true, preparationTime: 7, ingredients: ['bread', 'garlic', 'butter', 'herbs'], calories: 320 },
  { id: '12', name: 'Greek Salad', description: 'Fresh cucumbers, tomatoes, olives, and feta cheese', price: 13.99, category: 'salad', isAvailable: true, preparationTime: 8, ingredients: ['cucumbers', 'tomatoes', 'olives', 'feta', 'onions'], calories: 290 },
];

export const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 2, status: 'available', location: 'Main Floor' },
  { id: '2', number: 2, capacity: 2, status: 'occupied', currentOrderId: '101', location: 'Main Floor' },
  { id: '3', number: 3, capacity: 4, status: 'available', location: 'Main Floor' },
  { id: '4', number: 4, capacity: 4, status: 'occupied', currentOrderId: '102', location: 'Main Floor' },
  { id: '5', number: 5, capacity: 6, status: 'reserved', location: 'Main Floor' },
  { id: '6', number: 6, capacity: 6, status: 'available', location: 'Patio' },
  { id: '7', number: 7, capacity: 4, status: 'cleaning', location: 'Patio' },
  { id: '8', number: 8, capacity: 8, status: 'available', location: 'Private Room' },
  { id: '9', number: 9, capacity: 2, status: 'occupied', currentOrderId: '103', location: 'Bar Area' },
  { id: '10', number: 10, capacity: 4, status: 'available', location: 'Bar Area' },
  { id: '11', number: 11, capacity: 4, status: 'available', location: 'Main Floor' },
  { id: '12', number: 12, capacity: 2, status: 'reserved', location: 'Patio' },
];

export const mockOrders: Order[] = [
  {
    id: '101',
    tableId: '2',
    table: mockTables[1],
    items: [
      { id: 'oi1', menuItemId: '2', menuItem: mockMenuItems[1], quantity: 1, status: 'ready', price: 9.99 },
      { id: 'oi2', menuItemId: '3', menuItem: mockMenuItems[2], quantity: 2, status: 'preparing', price: 28.99 },
    ],
    status: 'preparing',
    paymentStatus: 'pending',
    subtotal: 67.97,
    tax: 5.44,
    discount: 0,
    total: 73.41,
    createdAt: new Date(Date.now() - 30 * 60000),
    updatedAt: new Date(Date.now() - 15 * 60000),
    servedBy: '4',
  },
  {
    id: '102',
    tableId: '4',
    table: mockTables[3],
    items: [
      { id: 'oi3', menuItemId: '1', menuItem: mockMenuItems[0], quantity: 1, status: 'ready', price: 12.99 },
      { id: 'oi4', menuItemId: '4', menuItem: mockMenuItems[3], quantity: 1, status: 'preparing', price: 42.99 },
      { id: 'oi5', menuItemId: '6', menuItem: mockMenuItems[5], quantity: 2, status: 'pending', price: 10.99 },
    ],
    status: 'preparing',
    paymentStatus: 'pending',
    subtotal: 77.96,
    tax: 6.24,
    discount: 5,
    total: 79.20,
    createdAt: new Date(Date.now() - 45 * 60000),
    updatedAt: new Date(Date.now() - 20 * 60000),
    servedBy: '6',
  },
  {
    id: '103',
    tableId: '9',
    table: mockTables[8],
    items: [
      { id: 'oi6', menuItemId: '11', menuItem: mockMenuItems[10], quantity: 1, status: 'ready', price: 6.99 },
      { id: 'oi7', menuItemId: '5', menuItem: mockMenuItems[4], quantity: 1, status: 'ready', price: 22.99 },
      { id: 'oi8', menuItemId: '8', menuItem: mockMenuItems[7], quantity: 2, status: 'ready', price: 6.99 },
    ],
    status: 'ready',
    paymentStatus: 'pending',
    subtotal: 43.96,
    tax: 3.52,
    discount: 0,
    total: 47.48,
    createdAt: new Date(Date.now() - 25 * 60000),
    updatedAt: new Date(Date.now() - 5 * 60000),
    servedBy: '4',
  },
  {
    id: '104',
    tableId: '1',
    table: mockTables[0],
    items: [
      { id: 'oi9', menuItemId: '10', menuItem: mockMenuItems[9], quantity: 2, status: 'ready', price: 8.99 },
      { id: 'oi10', menuItemId: '7', menuItem: mockMenuItems[6], quantity: 1, status: 'ready', price: 9.99 },
    ],
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 27.97,
    tax: 2.24,
    discount: 0,
    total: 30.21,
    tip: 5,
    createdAt: new Date(Date.now() - 120 * 60000),
    updatedAt: new Date(Date.now() - 90 * 60000),
    servedBy: '6',
  },
  {
    id: '105',
    tableId: '3',
    table: mockTables[2],
    items: [
      { id: 'oi11', menuItemId: '12', menuItem: mockMenuItems[11], quantity: 1, status: 'pending', price: 13.99 },
      { id: 'oi12', menuItemId: '9', menuItem: mockMenuItems[8], quantity: 1, status: 'pending', price: 12.99 },
    ],
    status: 'pending',
    paymentStatus: 'pending',
    subtotal: 26.98,
    tax: 2.16,
    discount: 0,
    total: 29.14,
    createdAt: new Date(Date.now() - 5 * 60000),
    updatedAt: new Date(Date.now() - 5 * 60000),
    servedBy: '4',
  },
];

export const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Chicken Breast', category: 'Meat', quantity: 25, unit: 'kg', minStock: 10, maxStock: 50, costPerUnit: 8.50, supplier: 'Premium Meats Co.', lastRestocked: new Date('2024-01-15') },
  { id: '2', name: 'Salmon Fillet', category: 'Seafood', quantity: 12, unit: 'kg', minStock: 8, maxStock: 30, costPerUnit: 18.99, supplier: 'Ocean Fresh', lastRestocked: new Date('2024-01-14') },
  { id: '3', name: 'Ribeye Steak', category: 'Meat', quantity: 18, unit: 'kg', minStock: 10, maxStock: 40, costPerUnit: 24.50, supplier: 'Premium Meats Co.', lastRestocked: new Date('2024-01-15') },
  { id: '4', name: 'Romaine Lettuce', category: 'Vegetables', quantity: 15, unit: 'heads', minStock: 10, maxStock: 50, costPerUnit: 2.50, supplier: 'Green Farms', lastRestocked: new Date('2024-01-16') },
  { id: '5', name: 'Tomatoes', category: 'Vegetables', quantity: 8, unit: 'kg', minStock: 10, maxStock: 40, costPerUnit: 3.99, supplier: 'Green Farms', lastRestocked: new Date('2024-01-14') },
  { id: '6', name: 'Heavy Cream', category: 'Dairy', quantity: 20, unit: 'L', minStock: 10, maxStock: 50, costPerUnit: 4.50, supplier: 'Dairy Best', lastRestocked: new Date('2024-01-15'), expiryDate: new Date('2024-02-15') },
  { id: '7', name: 'Parmesan Cheese', category: 'Dairy', quantity: 5, unit: 'kg', minStock: 3, maxStock: 20, costPerUnit: 22.99, supplier: 'Dairy Best', lastRestocked: new Date('2024-01-10'), expiryDate: new Date('2024-03-10') },
  { id: '8', name: 'Pasta', category: 'Dry Goods', quantity: 30, unit: 'kg', minStock: 15, maxStock: 60, costPerUnit: 2.99, supplier: 'Italian Imports', lastRestocked: new Date('2024-01-12') },
  { id: '9', name: 'Olive Oil', category: 'Oils', quantity: 12, unit: 'L', minStock: 10, maxStock: 40, costPerUnit: 12.50, supplier: 'Mediterranean Goods', lastRestocked: new Date('2024-01-08') },
  { id: '10', name: 'Chocolate', category: 'Baking', quantity: 6, unit: 'kg', minStock: 5, maxStock: 25, costPerUnit: 15.99, supplier: 'Sweet Supplies', lastRestocked: new Date('2024-01-13'), expiryDate: new Date('2024-06-13') },
];

export const mockReservations: Reservation[] = [
  { id: '1', customerName: 'Robert Johnson', customerPhone: '+1 555-0201', partySize: 4, date: new Date(), time: '19:00', status: 'confirmed', specialRequests: 'Window table preferred', createdAt: new Date() },
  { id: '2', customerName: 'Emily Davis', customerPhone: '+1 555-0202', partySize: 2, date: new Date(), time: '20:00', status: 'confirmed', createdAt: new Date() },
  { id: '3', customerName: 'Michael Brown', customerPhone: '+1 555-0203', partySize: 6, date: new Date(Date.now() + 86400000), time: '18:30', status: 'confirmed', specialRequests: 'Birthday celebration', createdAt: new Date() },
  { id: '4', customerName: 'Sarah Wilson', customerPhone: '+1 555-0204', partySize: 8, date: new Date(Date.now() + 86400000), time: '19:30', status: 'confirmed', tableId: '8', createdAt: new Date() },
  { id: '5', customerName: 'David Lee', customerPhone: '+1 555-0205', partySize: 3, date: new Date(Date.now() - 86400000), time: '19:00', status: 'completed', createdAt: new Date() },
];

// Helper function to get role-based dashboard route
export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'admin': return '/admin';
    case 'manager': return '/manager';
    case 'chef': return '/kitchen';
    case 'waiter': return '/waiter';
    case 'cashier': return '/cashier';
    default: return '/';
  }
};

// Helper function to get role color
export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'admin': return 'bg-purple-500';
    case 'manager': return 'bg-blue-500';
    case 'chef': return 'bg-orange-500';
    case 'waiter': return 'bg-green-500';
    case 'cashier': return 'bg-pink-500';
    default: return 'bg-gray-500';
  }
};

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
    case 'confirmed':
    case 'ready':
    case 'completed':
    case 'paid':
      return 'bg-green-500';
    case 'occupied':
    case 'preparing':
    case 'pending':
      return 'bg-yellow-500';
    case 'reserved':
      return 'bg-blue-500';
    case 'cleaning':
    case 'cancelled':
    case 'no_show':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
