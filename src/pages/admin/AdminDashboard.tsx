
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  const { appointments, doctors, departments } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Get upcoming appointments (scheduled)
  const upcomingAppointments = appointments.filter(app => app.status === 'scheduled');
  
  // Get total number of patients (unique patient IDs)
  const uniquePatients = new Set(appointments.map(app => app.patientId)).size;
  
  // Get appointments by department
  const appointmentsByDepartment = appointments.reduce((acc: Record<string, number>, appointment) => {
    const dept = appointment.department;
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{uniquePatients}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Total Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{doctors.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {departments.map(dept => {
                const count = appointmentsByDepartment[dept.name] || 0;
                // Calculate percentage for the progress bar
                const percentage = appointments.length > 0 
                  ? Math.round((count / appointments.length) * 100) 
                  : 0;
                
                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{dept.name}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-medical-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.slice(0, 5).map(appointment => (
                <div key={appointment.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-gray-500">{appointment.doctorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{appointment.date}</p>
                      <p className="text-sm text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No appointments yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
