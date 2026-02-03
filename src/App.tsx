import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { LoginForm } from '@/components/LoginForm';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { KitchenDashboard } from '@/components/dashboard/KitchenDashboard';
import { WaiterDashboard } from '@/components/dashboard/WaiterDashboard';
import { CashierDashboard } from '@/components/dashboard/CashierDashboard';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  const { isAuthenticated, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <LoginForm />
        <Toaster />
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'manager':
        return <ManagerDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'chef':
        return <KitchenDashboard />;
      case 'waiter':
        return <WaiterDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'cashier':
        return <CashierDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
      <Toaster />
    </div>
  );
}

export default App;
