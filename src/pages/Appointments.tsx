
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Appointment } from '@/types';

const AppointmentPage: React.FC = () => {
  const { getUserAppointments, cancelAppointment } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const appointments = getUserAppointments();
  const upcomingAppointments = appointments.filter(app => app.status === 'scheduled');
  const pastAppointments = appointments.filter(app => app.status === 'completed' || app.status === 'cancelled');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedAppointment) {
      await cancelAppointment(selectedAppointment.id);
      setIsDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const AppointmentCard: React.FC<{ appointment: Appointment; showCancelButton?: boolean }> = ({ 
    appointment, 
    showCancelButton = false 
  }) => {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
          <CardDescription>{appointment.department}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm">
              <span className="font-medium">Date:</span> {formatDate(appointment.date)}
            </div>
            <div className="text-sm">
              <span className="font-medium">Time:</span> {appointment.time}
            </div>
            <div className="text-sm col-span-2">
              <span className="font-medium">Status:</span>{' '}
              <span className={`
                ${appointment.status === 'scheduled' ? 'text-green-600' : ''}
                ${appointment.status === 'completed' ? 'text-blue-600' : ''}
                ${appointment.status === 'cancelled' ? 'text-red-600' : ''}
              `}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>
            {showCancelButton && (
              <div className="col-span-2 mt-2">
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-800 w-full"
                  onClick={() => handleCancelClick(appointment)}
                >
                  Cancel Appointment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

        <Tabs defaultValue="upcoming">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="upcoming" className="flex-1">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  showCancelButton={true}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No upcoming appointments</h3>
                <p className="text-gray-500 mb-4">
                  You don't have any scheduled appointments.
                </p>
                <Button onClick={() => navigate('/doctors')}>
                  Book an Appointment
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You don't have any past appointments.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your appointment with {selectedAppointment?.doctorName} on {selectedAppointment?.date} at {selectedAppointment?.time}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmCancel}
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default AppointmentPage;
