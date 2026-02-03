import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/shared/Sidebar';
import { StatsCard } from '@/components/shared/StatsCard';
import { InventoryManagement } from '@/components/manager/InventoryManagement';
import { StaffSchedule } from '@/components/manager/StaffSchedule';
import { Reservations } from '@/components/manager/Reservations';
import { Analytics } from '@/components/manager/Analytics';
import { Settings } from '@/components/admin/Settings';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ManagerDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'inventory', label: 'Inventory', icon: <Package className="w-5 h-5" /> },
  { id: 'staff', label: 'Staff Schedule', icon: <Users className="w-5 h-5" /> },
  { id: 'reservations', label: 'Reservations', icon: <Calendar className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
];

export function ManagerDashboard({ activeTab, setActiveTab }: ManagerDashboardProps) {
  const { inventory, orders, reservations, getTodaySales, getTodayOrders } = useStore();
  
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
  const todayReservations = reservations.filter(r => 
    new Date(r.date).toDateString() === new Date().toDateString()
  );
  const pendingReservations = todayReservations.filter(r => r.status === 'confirmed');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Today's Sales"
                value={`$${getTodaySales().toFixed(2)}`}
                subtitle="Total revenue today"
                icon={DollarSign}
                color="bg-green-500"
              />
              <StatsCard
                title="Today's Orders"
                value={getTodayOrders()}
                subtitle="Total orders today"
                icon={CheckCircle}
                color="bg-blue-500"
              />
              <StatsCard
                title="Reservations"
                value={pendingReservations.length}
                subtitle="Confirmed for today"
                icon={Calendar}
                color="bg-purple-500"
              />
              <StatsCard
                title="Low Stock Items"
                value={lowStockItems.length}
                subtitle="Need restocking"
                icon={AlertTriangle}
                color="bg-red-500"
              />
            </div>

            {/* Alerts & Quick Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Alerts */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Low Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">{item.quantity} {item.unit}</p>
                          <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                        </div>
                      </div>
                    ))}
                    {lowStockItems.length === 0 && (
                      <p className="text-center text-gray-400 py-4">All items are well stocked</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Reservations */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Today's Reservations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingReservations.slice(0, 5).map((res) => (
                      <div key={res.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{res.customerName}</p>
                          <p className="text-sm text-gray-500">{res.partySize} guests</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-600">{res.time}</p>
                          {res.tableId && <p className="text-xs text-gray-500">Table assigned</p>}
                        </div>
                      </div>
                    ))}
                    {pendingReservations.length === 0 && (
                      <p className="text-center text-gray-400 py-4">No reservations for today</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Orders Summary */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Order Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-100 text-yellow-800' },
                    { label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length, color: 'bg-orange-100 text-orange-800' },
                    { label: 'Ready', count: orders.filter(o => o.status === 'ready').length, color: 'bg-green-100 text-green-800' },
                    { label: 'Completed', count: orders.filter(o => o.status === 'completed').length, color: 'bg-blue-100 text-blue-800' },
                  ].map((stat) => (
                    <div key={stat.label} className={`p-4 rounded-lg ${stat.color} text-center`}>
                      <p className="text-2xl font-bold">{stat.count}</p>
                      <p className="text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'inventory':
        return <InventoryManagement />;
      case 'staff':
        return <StaffSchedule />;
      case 'reservations':
        return <Reservations />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
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
    </div>
  );
}
