
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Doctor, Department, Appointment } from '../types';
import { mockDoctors, mockDepartments, mockAppointments } from '../data/mockData';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface AppContextType {
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  filterDoctorsByDepartment: (departmentName: string) => Doctor[];
  bookAppointment: (doctorId: string, date: string, time: string) => Promise<boolean>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
  getUserAppointments: () => Appointment[];
  getAllAppointments: () => Appointment[];
  filterAppointmentsByDate: (date: string) => Appointment[];
  filterAppointmentsByDepartment: (department: string) => Appointment[];
  getDoctorById: (id: string) => Doctor | undefined;
  addDoctor: (doctor: Omit<Doctor, "id">) => Promise<boolean>;
  updateDoctor: (doctor: Doctor) => Promise<boolean>;
  deleteDoctor: (doctorId: string) => Promise<boolean>;
  addDepartment: (department: Omit<Department, "id">) => Promise<boolean>;
  updateDepartment: (department: Department) => Promise<boolean>;
  deleteDepartment: (departmentId: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const { currentUser } = useAuth();

  const filterDoctorsByDepartment = (departmentName: string): Doctor[] => {
    if (departmentName === "All") return doctors;
    return doctors.filter(doctor => doctor.department === departmentName);
  };

  const getDoctorById = (id: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === id);
  };

  const bookAppointment = async (doctorId: string, date: string, time: string): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to book an appointment",
          variant: "destructive",
        });
        return false;
      }

      const doctor = doctors.find(doc => doc.id === doctorId);
      
      if (!doctor) {
        toast({
          title: "Error",
          description: "Doctor not found",
          variant: "destructive",
        });
        return false;
      }

      // Check if appointment time is available
      const isTimeSlotTaken = appointments.some(
        app => app.doctorId === doctorId && app.date === date && app.time === time && app.status !== 'cancelled'
      );

      if (isTimeSlotTaken) {
        toast({
          title: "Booking failed",
          description: "This time slot is already booked",
          variant: "destructive",
        });
        return false;
      }

      const newAppointment: Appointment = {
        id: `a${appointments.length + 1}`,
        patientId: currentUser.id,
        patientName: currentUser.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
        date,
        time,
        status: 'scheduled',
      };

      setAppointments([...appointments, newAppointment]);
      
      toast({
        title: "Appointment booked",
        description: `Your appointment with ${doctor.name} on ${date} at ${time} has been booked`,
      });
      
      return true;
    } catch (error) {
      console.error('Appointment booking error:', error);
      toast({
        title: "Booking error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
    try {
      const appointment = appointments.find(app => app.id === appointmentId);
      
      if (!appointment) {
        toast({
          title: "Error",
          description: "Appointment not found",
          variant: "destructive",
        });
        return false;
      }

      // Update appointment status to cancelled
      const updatedAppointments = appointments.map(app =>
        app.id === appointmentId ? { ...app, status: 'cancelled' as const } : app
      );
      
      setAppointments(updatedAppointments);
      
      toast({
        title: "Appointment cancelled",
        description: `Your appointment with ${appointment.doctorName} has been cancelled`,
      });
      
      return true;
    } catch (error) {
      console.error('Appointment cancellation error:', error);
      toast({
        title: "Cancellation error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const getUserAppointments = (): Appointment[] => {
    if (!currentUser) return [];
    return appointments.filter(app => app.patientId === currentUser.id);
  };

  const getAllAppointments = (): Appointment[] => {
    return appointments;
  };

  const filterAppointmentsByDate = (date: string): Appointment[] => {
    return appointments.filter(app => app.date === date);
  };

  const filterAppointmentsByDepartment = (department: string): Appointment[] => {
    if (department === "All") return appointments;
    return appointments.filter(app => app.department === department);
  };

  const addDoctor = async (doctor: Omit<Doctor, "id">): Promise<boolean> => {
    try {
      const newDoctor: Doctor = {
        ...doctor,
        id: `doc${doctors.length + 1}`,
      };
      
      setDoctors([...doctors, newDoctor]);
      
      toast({
        title: "Doctor added",
        description: `${doctor.name} has been added successfully`,
      });
      
      return true;
    } catch (error) {
      console.error('Add doctor error:', error);
      toast({
        title: "Error",
        description: "Failed to add doctor",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateDoctor = async (doctor: Doctor): Promise<boolean> => {
    try {
      const updatedDoctors = doctors.map(doc =>
        doc.id === doctor.id ? doctor : doc
      );
      
      setDoctors(updatedDoctors);
      
      toast({
        title: "Doctor updated",
        description: `${doctor.name}'s information has been updated`,
      });
      
      return true;
    } catch (error) {
      console.error('Update doctor error:', error);
      toast({
        title: "Error",
        description: "Failed to update doctor",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDoctor = async (doctorId: string): Promise<boolean> => {
    try {
      const doctorToDelete = doctors.find(doc => doc.id === doctorId);
      
      if (!doctorToDelete) {
        toast({
          title: "Error",
          description: "Doctor not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if doctor has any appointments
      const hasAppointments = appointments.some(
        app => app.doctorId === doctorId && app.status === 'scheduled'
      );
      
      if (hasAppointments) {
        toast({
          title: "Error",
          description: "Cannot delete doctor with scheduled appointments",
          variant: "destructive",
        });
        return false;
      }
      
      setDoctors(doctors.filter(doc => doc.id !== doctorId));
      
      toast({
        title: "Doctor deleted",
        description: `${doctorToDelete.name} has been removed`,
      });
      
      return true;
    } catch (error) {
      console.error('Delete doctor error:', error);
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
      return false;
    }
  };

  const addDepartment = async (department: Omit<Department, "id">): Promise<boolean> => {
    try {
      const newDepartment: Department = {
        ...department,
        id: `d${departments.length + 1}`,
      };
      
      setDepartments([...departments, newDepartment]);
      
      toast({
        title: "Department added",
        description: `${department.name} department has been added`,
      });
      
      return true;
    } catch (error) {
      console.error('Add department error:', error);
      toast({
        title: "Error",
        description: "Failed to add department",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateDepartment = async (department: Department): Promise<boolean> => {
    try {
      const updatedDepartments = departments.map(dept =>
        dept.id === department.id ? department : dept
      );
      
      setDepartments(updatedDepartments);
      
      toast({
        title: "Department updated",
        description: `${department.name} department has been updated`,
      });
      
      return true;
    } catch (error) {
      console.error('Update department error:', error);
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDepartment = async (departmentId: string): Promise<boolean> => {
    try {
      const departmentToDelete = departments.find(dept => dept.id === departmentId);
      
      if (!departmentToDelete) {
        toast({
          title: "Error",
          description: "Department not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if department has any doctors
      const hasDoctors = doctors.some(doc => doc.department === departmentToDelete.name);
      
      if (hasDoctors) {
        toast({
          title: "Error",
          description: "Cannot delete department with active doctors",
          variant: "destructive",
        });
        return false;
      }
      
      setDepartments(departments.filter(dept => dept.id !== departmentId));
      
      toast({
        title: "Department deleted",
        description: `${departmentToDelete.name} department has been removed`,
      });
      
      return true;
    } catch (error) {
      console.error('Delete department error:', error);
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        doctors,
        departments,
        appointments,
        filterDoctorsByDepartment,
        bookAppointment,
        cancelAppointment,
        getUserAppointments,
        getAllAppointments,
        filterAppointmentsByDate,
        filterAppointmentsByDepartment,
        getDoctorById,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addDepartment,
        updateDepartment,
        deleteDepartment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
