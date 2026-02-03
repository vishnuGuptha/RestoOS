import type { MenuItem, Table } from '@/types';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/shared/Sidebar';
import { OrderCard } from '@/components/shared/OrderCard';
import { TableCard } from '@/components/shared/TableCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Table2, 
  PlusCircle, 
  ShoppingCart,
  Search,
  Minus,
  Plus,
  Trash2,
  Send,
  ChefHat,
  Clock,
  CheckCircle,
  Utensils
} from 'lucide-react';
import { toast } from 'sonner';

interface WaiterDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'tables', label: 'Tables', icon: <Table2 className="w-5 h-5" /> },
  { id: 'orders', label: 'My Orders', icon: <ShoppingCart className="w-5 h-5" /> },
];

export function WaiterDashboard({ activeTab, setActiveTab }: WaiterDashboardProps) {
  const { tables, menuItems: menu, orders, addOrder, currentUser } = useStore();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<{ item: MenuItem; quantity: number; notes: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const myOrders = orders.filter(o => o.servedBy === currentUser?.id);
  const activeOrders = myOrders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status));

  const categories = ['all', ...Array.from(new Set(menu.map(item => item.category)))];

  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.isAvailable;
  });

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    if (table.status === 'available') {
      setIsOrderDialogOpen(true);
      setOrderItems([]);
    } else if (table.currentOrderId) {
      setActiveTab('orders');
    }
  };

  const addToOrder = (item: MenuItem) => {
    const existing = orderItems.find(oi => oi.item.id === item.id);
    if (existing) {
      setOrderItems(orderItems.map(oi => 
        oi.item.id === item.id 
          ? { ...oi, quantity: oi.quantity + 1 }
          : oi
      ));
    } else {
      setOrderItems([...orderItems, { item, quantity: 1, notes: '' }]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setOrderItems(orderItems.map(oi => {
      if (oi.item.id === itemId) {
        const newQuantity = Math.max(0, oi.quantity + delta);
        return { ...oi, quantity: newQuantity };
      }
      return oi;
    }).filter(oi => oi.quantity > 0));
  };

  const updateNotes = (itemId: string, notes: string) => {
    setOrderItems(orderItems.map(oi => 
      oi.item.id === itemId ? { ...oi, notes } : oi
    ));
  };

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter(oi => oi.item.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, oi) => sum + (oi.item.price * oi.quantity), 0);
  };

  const submitOrder = () => {
    if (!selectedTable || orderItems.length === 0) return;

    const subtotal = calculateTotal();
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    addOrder({
      tableId: selectedTable.id,
      table: selectedTable,
      items: orderItems.map(oi => ({
        id: Date.now().toString() + oi.item.id,
        menuItemId: oi.item.id,
        menuItem: oi.item,
        quantity: oi.quantity,
        specialInstructions: oi.notes,
        status: 'pending',
        price: oi.item.price,
      })),
      status: 'pending',
      paymentStatus: 'pending',
      subtotal,
      tax,
      discount: 0,
      total,
      servedBy: currentUser?.id || '',
    });

    toast.success('Order submitted successfully!');
    setIsOrderDialogOpen(false);
    setOrderItems([]);
    setSelectedTable(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">My Active Orders</p>
                      <h3 className="text-3xl font-bold text-blue-900">{activeOrders.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Available Tables</p>
                      <h3 className="text-3xl font-bold text-green-900">
                        {tables.filter(t => t.status === 'available').length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Table2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Today's Sales</p>
                      <h3 className="text-3xl font-bold text-orange-900">
                        ${myOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0).toFixed(0)}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveTab('tables')}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <PlusCircle className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900">New Order</p>
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <Clock className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900">View Orders</p>
              </button>
              <button className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <ChefHat className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Kitchen Status</p>
              </button>
              <button className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <Utensils className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Menu</p>
              </button>
            </div>

            {/* Recent Orders */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myOrders.slice(0, 5).map(order => (
                    <OrderCard key={order.id} order={order} compact />
                  ))}
                  {myOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No orders yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'tables':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tables</h2>
              <p className="text-gray-500">Select a table to place an order</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <TableCard 
                  key={table.id} 
                  table={table} 
                  onClick={() => handleTableClick(table)}
                  selected={selectedTable?.id === table.id}
                />
              ))}
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
              <p className="text-gray-500">Track and manage your orders</p>
            </div>
            <Tabs defaultValue="active">
              <TabsList className="bg-white border">
                <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
                <TabsTrigger value="all">All ({myOrders.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {activeOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8 col-span-2">No active orders</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {myOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {myOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8 col-span-2">No orders yet</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>New Order - Table {selectedTable?.number}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-1 overflow-hidden gap-4 mt-4">
            {/* Menu Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-2 gap-3 pr-4">
                  {filteredMenu.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addToOrder(item)}
                      className="p-3 bg-gray-50 rounded-lg text-left hover:bg-orange-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                        </div>
                        <p className="font-semibold text-orange-600">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{item.preparationTime} min</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Order Summary */}
            <div className="w-80 flex flex-col border-l pl-4">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <ScrollArea className="flex-1">
                <div className="space-y-3 pr-4">
                  {orderItems.map((oi) => (
                    <div key={oi.item.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{oi.item.name}</p>
                          <p className="text-xs text-gray-500">${oi.item.price.toFixed(2)} each</p>
                        </div>
                        <p className="font-semibold text-sm">
                          ${(oi.item.price * oi.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(oi.item.id, -1)}
                          className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{oi.quantity}</span>
                        <button
                          onClick={() => updateQuantity(oi.item.id, 1)}
                          className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(oi.item.id)}
                          className="ml-auto text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Special instructions..."
                        value={oi.notes}
                        onChange={(e) => updateNotes(oi.item.id, e.target.value)}
                        className="w-full mt-2 text-xs border rounded px-2 py-1"
                      />
                    </div>
                  ))}
                  {orderItems.length === 0 && (
                    <p className="text-center text-gray-400 py-8">Tap items to add to order</p>
                  )}
                </div>
              </ScrollArea>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Tax (8%)</span>
                  <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total</span>
                  <span>${(calculateTotal() * 1.08).toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={orderItems.length === 0}
                  onClick={submitOrder}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Order
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
