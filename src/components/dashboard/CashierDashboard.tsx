import type { Order, PaymentMethod } from '@/types';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/shared/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  CreditCard, 
  DollarSign, 
  Receipt,
  Search,
  CheckCircle,
  Calculator,
  Banknote,
  Smartphone,
  TrendingUp,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface CashierDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'history', label: 'History', icon: <Receipt className="w-5 h-5" /> },
];

export function CashierDashboard({ activeTab, setActiveTab }: CashierDashboardProps) {
  const { orders, updateOrder, getTodaySales } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [tipAmount, setTipAmount] = useState('');

  const pendingPayments = orders.filter(o => 
    o.status === 'served' && o.paymentStatus === 'pending'
  );
  
  const completedPayments = orders.filter(o => o.paymentStatus === 'paid');
  const todayPayments = completedPayments.filter(o => 
    o.createdAt.toDateString() === new Date().toDateString()
  );

  const filteredOrders = pendingPayments.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.table.number.toString().includes(searchTerm)
  );

  const handlePayment = () => {
    if (!selectedOrder) return;

    const received = parseFloat(amountReceived) || 0;
    const tip = parseFloat(tipAmount) || 0;
    const total = selectedOrder.total + tip;

    if (received < total && paymentMethod === 'cash') {
      toast.error('Insufficient amount received');
      return;
    }

    updateOrder(selectedOrder.id, {
      paymentStatus: 'paid',
      paymentMethod,
      tip,
    });

    toast.success('Payment processed successfully!');
    setIsPaymentDialogOpen(false);
    setSelectedOrder(null);
    setAmountReceived('');
    setTipAmount('');
  };

  const calculateChange = () => {
    const received = parseFloat(amountReceived) || 0;
    const tip = parseFloat(tipAmount) || 0;
    const total = (selectedOrder?.total || 0) + tip;
    return Math.max(0, received - total);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Today's Revenue</p>
                      <h3 className="text-3xl font-bold text-green-900">${getTodaySales().toFixed(2)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Pending Payments</p>
                      <h3 className="text-3xl font-bold text-blue-900">{pendingPayments.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Transactions Today</p>
                      <h3 className="text-3xl font-bold text-purple-900">{todayPayments.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveTab('payments')}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <CreditCard className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Process Payment</p>
              </button>
              <button className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <Receipt className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Print Receipt</p>
              </button>
              <button className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <Calculator className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Calculator</p>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <TrendingUp className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900">View History</p>
              </button>
            </div>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayPayments.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">Table {order.table.number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                  {todayPayments.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No transactions today</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Process Payments</h2>
              <p className="text-gray-500">Select an order to process payment</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by order ID or table number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">Table {order.table.number}</p>
                          <p className="text-xs text-gray-400">
                            {order.items.length} items • Served by staff
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                        <Button
                          className="mt-2 bg-green-500 hover:bg-green-600"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsPaymentDialogOpen(true);
                          }}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Pay
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.quantity}x {item.menuItem.name}
                          </span>
                          <span className="text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-sm mt-4 pt-4 border-t border-gray-100">
                      <span className="text-gray-500">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount</span>
                        <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredOrders.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-500">No pending payments</p>
                  <p className="text-gray-400">All orders have been paid</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
              <p className="text-gray-500">View all completed transactions</p>
            </div>
            
            <Tabs defaultValue="today">
              <TabsList className="bg-white border">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="mt-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {todayPayments.map((order) => (
                        <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">
                                Table {order.table.number} • {order.createdAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 capitalize">{order.paymentMethod}</p>
                            {order.tip && order.tip > 0 && (
                              <p className="text-xs text-green-600">Tip: ${order.tip.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {todayPayments.length === 0 && (
                        <p className="text-center text-gray-400 py-8">No transactions today</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="all" className="mt-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {completedPayments.slice(0, 20).map((order) => (
                        <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">
                                Table {order.table.number} • {order.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 capitalize">{order.paymentMethod}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Order #{selectedOrder.id}</span>
                  <span className="font-medium">Table {selectedOrder.table.number}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                      paymentMethod === 'cash' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Banknote className="w-6 h-6" />
                    <span className="text-sm">Cash</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm">Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('digital_wallet')}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                      paymentMethod === 'digital_wallet' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-sm">Digital</span>
                  </button>
                </div>
              </div>

              {/* Tip */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tip Amount (Optional)</label>
                <div className="flex gap-2 mb-2">
                  {[10, 15, 18, 20].map(percent => (
                    <button
                      key={percent}
                      onClick={() => setTipAmount(((selectedOrder.total * percent) / 100).toFixed(2))}
                      className="flex-1 py-2 px-3 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Custom tip amount"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                />
              </div>

              {/* Cash Payment */}
              {paymentMethod === 'cash' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount Received</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter amount received"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                  />
                  {parseFloat(amountReceived) > 0 && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-green-700">Change Due:</span>
                        <span className="font-bold text-green-700">${calculateChange().toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Total with Tip */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Subtotal</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
                {parseFloat(tipAmount) > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tip</span>
                    <span>${parseFloat(tipAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold mt-2">
                  <span>Final Total</span>
                  <span>${(selectedOrder.total + (parseFloat(tipAmount) || 0)).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPaymentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={handlePayment}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
