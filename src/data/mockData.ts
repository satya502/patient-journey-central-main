
import { User, Doctor, Department, Appointment } from "../types";

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "patient@example.com",
    name: "John Patient",
    phone: "555-123-4567",
    isAdmin: false,
  },
  {
    id: "u2",
    email: "admin@example.com",
    name: "Admin User",
    phone: "555-987-6543",
    isAdmin: true,
  },
];

export const mockDepartments: Department[] = [
  {
    id: "d1",
    name: "Cardiology",
    description: "Diagnosis and treatment of heart disorders",
  },
  {
    id: "d2",
    name: "Neurology",
    description: "Diagnosis and treatment of nervous system disorders",
  },
  {
    id: "d3",
    name: "Orthopedics",
    description: "Care for musculoskeletal system",
  },
  {
    id: "d4",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
  },
  {
    id: "d5",
    name: "Dermatology",
    description: "Diagnosis and treatment of skin disorders",
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiac Surgeon",
    department: "Cardiology",
    bio: "Experienced cardiac surgeon with 15 years of practice",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "doc2",
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    department: "Neurology",
    bio: "Specializes in treating complex neurological disorders",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "doc3",
    name: "Dr. Emily Rodriguez",
    specialty: "Orthopedic Surgeon",
    department: "Orthopedics",
    bio: "Expert in joint replacement and sports medicine",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "doc4",
    name: "Dr. James Wilson",
    specialty: "Pediatrician",
    department: "Pediatrics",
    bio: "Caring for children from newborns to adolescents",
    image: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    id: "doc5",
    name: "Dr. Lisa Wong",
    specialty: "Dermatologist",
    department: "Dermatology",
    bio: "Specializes in treating skin conditions and cosmetic procedures",
    image: "https://randomuser.me/api/portraits/women/54.jpg",
  },
  {
    id: "doc6",
    name: "Dr. Robert Smith",
    specialty: "Cardiologist",
    department: "Cardiology",
    bio: "Focuses on preventive cardiology and heart health",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    patientId: "u1",
    patientName: "John Patient",
    doctorId: "doc1",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "2025-05-15",
    time: "10:00 AM",
    status: "scheduled",
  },
  {
    id: "a2",
    patientId: "u1",
    patientName: "John Patient",
    doctorId: "doc3",
    doctorName: "Dr. Emily Rodriguez",
    department: "Orthopedics",
    date: "2025-05-20",
    time: "2:30 PM",
    status: "scheduled",
  },
  {
    id: "a3",
    patientId: "u1",
    patientName: "John Patient",
    doctorId: "doc2",
    doctorName: "Dr. Michael Chen",
    department: "Neurology",
    date: "2025-04-05",
    time: "11:15 AM",
    status: "completed",
  },
];
