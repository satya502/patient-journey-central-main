
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Doctor } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BookAppointmentDialogProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
}

export const BookAppointmentDialog: React.FC<BookAppointmentDialogProps> = ({
  doctor,
  isOpen,
  onClose,
}) => {
  const { isAuthenticated } = useAuth();
  const { bookAppointment } = useApp();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [time, setTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM'
  ];
  
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!date || !time) {
      return;
    }
    
    setIsSubmitting(true);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const success = await bookAppointment(doctor.id, formattedDate, time);
    
    setIsSubmitting(false);
    if (success) {
      onClose();
      navigate('/appointments');
    }
  };
  
  // Disable past dates in calendar
  const disabledDays = (day: Date) => {
    // Disable past days and weekends (Saturday and Sunday)
    return (
      differenceInCalendarDays(day, new Date()) < 1 || 
      day.getDay() === 0 || 
      day.getDay() === 6
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
          <DialogDescription>
            Select a date and time for your appointment with {doctor.name}, {doctor.specialty} in the {doctor.department} department.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select a Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDays}
              className="rounded-md border shadow pointer-events-auto"
            />
          </div>
          
          {date && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Select a Time</h3>
              <Select
                value={time}
                onValueChange={setTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!date || !time || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
