
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Default admin password - in a real app, this would come from a secure backend
const DEFAULT_ADMIN_PASSWORD = "admin123";

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if admin is already authenticated in this session
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = (password: string): boolean => {
    if (password === DEFAULT_ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast({
        title: "Admin Login Successful",
        description: "You have successfully logged in as admin.",
      });
      return true;
    } else {
      toast({
        title: "Admin Login Failed",
        description: "Incorrect admin password.",
        variant: "destructive",
      });
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Admin Logout",
      description: "You have been logged out of admin portal.",
    });
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
