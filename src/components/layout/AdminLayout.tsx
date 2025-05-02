
import React, { ReactNode } from 'react';
import Header from './Header';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import AdminLogin from '@/components/admin/AdminLogin';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { isAdminAuthenticated, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  // If not admin authenticated, show login
  if (!isAdminAuthenticated) {
    return <AdminLogin redirectPath={location.pathname} />;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <aside className="bg-medical-secondary w-64 min-h-screen text-white p-4">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <Button
              variant={isActive('/admin') ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:text-white"
              asChild
            >
              <Link to="/admin">Dashboard</Link>
            </Button>
            
            <Button
              variant={isActive('/admin/doctors') ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:text-white"
              asChild
            >
              <Link to="/admin/doctors">Manage Doctors</Link>
            </Button>
            
            <Button
              variant={isActive('/admin/departments') ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:text-white"
              asChild
            >
              <Link to="/admin/departments">Manage Departments</Link>
            </Button>
            
            <Button
              variant={isActive('/admin/appointments') ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:text-white"
              asChild
            >
              <Link to="/admin/appointments">All Appointments</Link>
            </Button>
            
            <div className="pt-4 mt-4 border-t border-white/20">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Admin Logout
              </Button>
            </div>
          </nav>
        </aside>
        
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
