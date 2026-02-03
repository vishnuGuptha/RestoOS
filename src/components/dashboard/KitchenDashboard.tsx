import type { Order } from '@/types';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChefHat, 
  Clock, 
  Flame, 
  CheckCircle, 
  AlertCircle,
  Utensils
} from 'lucide-react';
import { toast } from 'sonner';

export function KitchenDashboard() {
  const { orders, updateOrder, updateOrderItemStatus, addNotification } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'confirmed');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  const handleStartPreparing = (orderId: string) => {
    updateOrder(orderId, { status: 'preparing' });
    addNotification({
      title: 'Order Started',
      message: `Order #${orderId} is now being prepared`,
      type: 'info',
      read: false,
    });
    toast.success('Order preparation started');
  };

  const handleItemReady = (orderId: string, itemId: string) => {
    updateOrderItemStatus(orderId, itemId, 'ready');
    
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const allReady = order.items.every(i => i.status === 'ready');
      if (allReady) {
        updateOrder(orderId, { status: 'ready' });
        addNotification({
          title: 'Order Ready',
          message: `Order #${orderId} is ready for pickup`,
          type: 'success',
          read: false,
        });
        toast.success('Order marked as ready');
      }
    }
  };

  const handleMarkServed = (orderId: string) => {
    updateOrder(orderId, { status: 'served' });
    toast.success('Order marked as served');
  };

  const getTimeElapsed = (date: Date) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m ago`;
  };

  const getUrgencyColor = (order: Order) => {
    const minutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    const totalPrepTime = order.items.reduce((sum, item) => sum + item.menuItem.preparationTime, 0);
    
    if (minutes > totalPrepTime + 10) return 'border-red-500 bg-red-50';
    if (minutes > totalPrepTime) return 'border-orange-500 bg-orange-50';
    return 'border-gray-200';
  };

  const OrderCard = ({ order, showActions }: { order: Order; showActions: boolean }) => (
    <Card className={`border-2 ${getUrgencyColor(order)} shadow-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">Table {order.table.number}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Order #{order.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTimeElapsed(order.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                item.status === 'ready' ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-700 shadow-sm">
                  {item.quantity}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                  {item.specialInstructions && (
                    <p className="text-xs text-red-500 font-medium">⚠️ {item.specialInstructions}</p>
                  )}
                  <p className="text-xs text-gray-400">{item.menuItem.preparationTime} min prep time</p>
                </div>
              </div>
              {showActions && order.status === 'preparing' && item.status !== 'ready' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleItemReady(order.id, item.id)}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Ready
                </Button>
              )}
              {item.status === 'ready' && (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              )}
            </div>
          ))}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            {order.status === 'confirmed' && (
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => handleStartPreparing(order.id)}
              >
                <Flame className="w-4 h-4 mr-2" />
                Start Cooking
              </Button>
            )}
            {order.status === 'ready' && (
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => handleMarkServed(order.id)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Served
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kitchen Display</h1>
                <p className="text-sm text-gray-500">Order Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-mono font-bold text-gray-900">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-white border w-full justify-start h-14 p-2">
            <TabsTrigger value="pending" className="flex-1 h-10 data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="preparing" className="flex-1 h-10 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800">
              <Flame className="w-4 h-4 mr-2" />
              Preparing ({preparingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="ready" className="flex-1 h-10 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              Ready ({readyOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} showActions={true} />
              ))}
              {pendingOrders.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <ChefHat className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xl font-medium text-gray-500">No pending orders</p>
                  <p className="text-gray-400">New orders will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preparing" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preparingOrders.map((order) => (
                <OrderCard key={order.id} order={order} showActions={true} />
              ))}
              {preparingOrders.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Flame className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xl font-medium text-gray-500">No orders being prepared</p>
                  <p className="text-gray-400">Start cooking from pending orders</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ready" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readyOrders.map((order) => (
                <OrderCard key={order.id} order={order} showActions={true} />
              ))}
              {readyOrders.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xl font-medium text-gray-500">No orders ready</p>
                  <p className="text-gray-400">Ready orders will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
