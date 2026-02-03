import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/shared/Sidebar';
import { StatsCard } from '@/components/shared/StatsCard';
import { OrderCard } from '@/components/shared/OrderCard';
import { UserManagement } from '@/components/admin/UserManagement';
import { MenuManagement } from '@/components/admin/MenuManagement';
import { Reports } from '@/components/admin/Reports';
import { Settings } from '@/components/admin/Settings';
import { 
  LayoutDashboard, 
  Users, 
  Utensils, 
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  ChefHat
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
  { id: 'menu', label: 'Menu', icon: <Utensils className="w-5 h-5" /> },
  { id: 'reports', label: 'Reports', icon: <TrendingUp className="w-5 h-5" /> },
];

export function AdminDashboard({ activeTab, setActiveTab }: AdminDashboardProps) {
  const { orders, getTodaySales, getTodayOrders, users, menuItems: menu } = useStore();
  
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status));
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');

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
                trend={{ value: 12.5, isPositive: true }}
                color="bg-green-500"
              />
              <StatsCard
                title="Today's Orders"
                value={getTodayOrders()}
                subtitle="Total orders today"
                icon={ShoppingCart}
                trend={{ value: 8.2, isPositive: true }}
                color="bg-blue-500"
              />
              <StatsCard
                title="Active Orders"
                value={activeOrders.length}
                subtitle="Orders in progress"
                icon={Clock}
                color="bg-orange-500"
              />
              <StatsCard
                title="Staff Online"
                value={users.filter(u => u.isActive).length}
                subtitle="Active staff members"
                icon={Users}
                color="bg-purple-500"
              />
            </div>

            {/* Orders Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending Orders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Pending ({pendingOrders.length})</h3>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {pendingOrders.map(order => (
                    <OrderCard key={order.id} order={order} compact />
                  ))}
                  {pendingOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No pending orders</p>
                  )}
                </div>
              </div>

              {/* Preparing Orders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Preparing ({preparingOrders.length})</h3>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {preparingOrders.map(order => (
                    <OrderCard key={order.id} order={order} compact />
                  ))}
                  {preparingOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No orders being prepared</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <Users className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-xs text-gray-500">{users.length} total users</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <Utensils className="w-8 h-8 text-orange-500 mb-2" />
                    <p className="font-medium text-gray-900">Edit Menu</p>
                    <p className="text-xs text-gray-500">{menu.length} menu items</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                    <p className="font-medium text-gray-900">View Reports</p>
                    <p className="text-xs text-gray-500">Sales analytics</p>
                  </button>
                  <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
                    <ChefHat className="w-8 h-8 text-purple-500 mb-2" />
                    <p className="font-medium text-gray-900">Kitchen View</p>
                    <p className="text-xs text-gray-500">Monitor orders</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'reports':
        return <Reports />;
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
