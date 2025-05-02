
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  isAdmin?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  image?: string;
  bio?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface AdminSettings {
  password: string;
}
