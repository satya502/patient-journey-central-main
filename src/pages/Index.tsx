
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';

const Index = () => {
  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Patient Journey Central</h1>
          <p className="text-xl mb-8">
            Welcome to our healthcare management system. Please choose where you would like to go:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Patient Portal</h2>
              <p className="mb-6">
                Book appointments, view doctors, and manage your healthcare journey.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Enter Patient Portal</Link>
              </Button>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Admin Portal</h2>
              <p className="mb-6">
                Manage doctors, departments, and view appointment statistics.
              </p>
              <Button asChild className="w-full">
                <Link to="/admin">Enter Admin Portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
