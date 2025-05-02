
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/AppContext';
import { Doctor } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const doctorSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  specialty: z.string().min(2, { message: 'Specialty is required' }),
  department: z.string().min(2, { message: 'Department is required' }),
  bio: z.string().optional(),
  image: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

interface DoctorFormProps {
  onClose: () => void;
  initialDoctor: Doctor | null;
  isEdit: boolean;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ onClose, initialDoctor, isEdit }) => {
  const { addDoctor, updateDoctor, departments } = useApp();
  
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: initialDoctor?.name || '',
      specialty: initialDoctor?.specialty || '',
      department: initialDoctor?.department || '',
      bio: initialDoctor?.bio || '',
      image: initialDoctor?.image || '',
    },
  });
  
  const onSubmit = async (data: DoctorFormValues) => {
    if (isEdit && initialDoctor) {
      await updateDoctor({
        ...initialDoctor,
        name: data.name,
        specialty: data.specialty,
        department: data.department,
        bio: data.bio || '',
        image: data.image || '',
      });
    } else {
      await addDoctor({
        name: data.name,
        specialty: data.specialty,
        department: data.department,
        bio: data.bio || '',
        image: data.image || '',
      });
    }
    onClose();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Name</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cardiac Surgeon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief professional biography"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DoctorForm;
