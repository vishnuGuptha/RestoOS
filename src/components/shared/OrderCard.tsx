import type { Order } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Table2, ChefHat, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  compact?: boolean;
}

export function OrderCard({ order, showActions = true, compact = false }: OrderCardProps) {
  const { updateOrder, updateOrderItemStatus, updateTable } = useStore();

  const getTimeElapsed = (date: Date) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleStatusUpdate = (newStatus: Order['status']) => {
    updateOrder(order.id, { status: newStatus });
    
    if (newStatus === 'completed') {
      updateTable(order.tableId, { status: 'cleaning', currentOrderId: undefined });
    }
  };

  const handleItemStatusUpdate = (itemId: string, status: 'pending' | 'preparing' | 'ready') => {
    updateOrderItemStatus(order.id, itemId, status);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    preparing: 'bg-orange-100 text-orange-800 border-orange-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    served: 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  if (compact) {
    return (
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Table2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Table {order.table.number}</p>
                <p className="text-xs text-gray-500">{order.items.length} items</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className={statusColors[order.status]}>
                {order.status}
              </Badge>
              <p className="text-xs text-gray-400 mt-1">{getTimeElapsed(order.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Table2 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Table {order.table.number}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTimeElapsed(order.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[order.status]}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {item.quantity}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.menuItem.name}</p>
                  {item.specialInstructions && (
                    <p className="text-xs text-gray-400">{item.specialInstructions}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                {showActions && order.status === 'preparing' && (
                  <select
                    value={item.status}
                    onChange={(e) => handleItemStatusUpdate(item.id, e.target.value as 'pending' | 'preparing' | 'ready')}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {order.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('confirmed')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Confirm
                </Button>
              )}
              {order.status === 'confirmed' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('preparing')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <ChefHat className="w-4 h-4 mr-1" />
                  Start Cooking
                </Button>
              )}
              {order.status === 'preparing' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('ready')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Ready
                </Button>
              )}
              {order.status === 'ready' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('served')}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Mark Served
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
