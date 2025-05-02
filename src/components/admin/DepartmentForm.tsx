
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/AppContext';
import { Department } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';

const departmentSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  description: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  onClose: () => void;
  initialDepartment: Department | null;
  isEdit: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ onClose, initialDepartment, isEdit }) => {
  const { addDepartment, updateDepartment } = useApp();
  
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialDepartment?.name || '',
      description: initialDepartment?.description || '',
    },
  });
  
  const onSubmit = async (data: DepartmentFormValues) => {
    if (isEdit && initialDepartment) {
      await updateDepartment({
        ...data,
        id: initialDepartment.id,
      });
    } else {
      await addDepartment(data);
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
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cardiology" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief department description"
                  className="resize-none"
                  {...field}
                />
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
            {isEdit ? 'Update Department' : 'Add Department'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepartmentForm;
