
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BookAppointmentDialog } from '@/components/patient/BookAppointmentDialog';
import { Doctor } from '@/types';

const DoctorList: React.FC = () => {
  const { doctors, departments, filterDoctorsByDepartment } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    searchParams.get('department') || 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Set initial department from URL if present
  useEffect(() => {
    const deptParam = searchParams.get('department');
    if (deptParam) {
      setSelectedDepartment(deptParam);
    }
  }, [searchParams]);

  // Update filtered doctors when department or search changes
  useEffect(() => {
    let filtered = selectedDepartment === 'All' 
      ? [...doctors]
      : filterDoctorsByDepartment(selectedDepartment);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(query) || 
        doctor.specialty.toLowerCase().includes(query)
      );
    }
    
    setFilteredDoctors(filtered);
    
    // Update URL
    if (selectedDepartment !== 'All') {
      searchParams.set('department', selectedDepartment);
    } else {
      searchParams.delete('department');
    }
    setSearchParams(searchParams);
  }, [selectedDepartment, searchQuery, doctors]);

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Find a Doctor</h1>
        
        {/* Filter section */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Department
              </label>
              <Select
                value={selectedDepartment}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-2/3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Doctors
              </label>
              <Input
                id="search"
                placeholder="Search by name or specialty"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Doctor list */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                      {doctor.image ? (
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 text-xl">{doctor.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle>{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-1">Department: {doctor.department}</p>
                  {doctor.bio && <p className="text-sm text-gray-600">{doctor.bio}</p>}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500">
              Try changing your search criteria or selecting a different department.
            </p>
          </div>
        )}
      </div>
      
      {selectedDoctor && (
        <BookAppointmentDialog
          doctor={selectedDoctor}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </PageLayout>
  );
};

export default DoctorList;
