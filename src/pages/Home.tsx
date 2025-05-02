
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import PageLayout from '@/components/layout/PageLayout';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { departments } = useApp();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Health Journey Starts Here</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Find specialists, book appointments, and manage your healthcare all in one place
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-medical-primary hover:bg-gray-100">
              <Link to="/doctors">Find a Doctor</Link>
            </Button>
            {!isAuthenticated && (
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Link to="/register">Create an Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Medical Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((department) => (
              <div key={department.id} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-medical-secondary">{department.name}</h3>
                <p className="text-gray-600 mb-4">{department.description}</p>
                <Link 
                  to={`/doctors?department=${encodeURIComponent(department.name)}`}
                  className="text-medical-primary hover:underline font-medium"
                >
                  Find specialists →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Patient Journey?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-medical-primary w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Appointment Booking</h3>
              <p className="text-gray-600">
                Book appointments with your preferred doctors in just a few clicks, saving you time and hassle.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-medical-primary w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Manage Your Schedule</h3>
              <p className="text-gray-600">
                Keep track of all your upcoming appointments and medical visits in one convenient location.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-medical-primary w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Health Records</h3>
              <p className="text-gray-600">
                Your medical information is protected with industry-leading security and privacy features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-medical-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have simplified their healthcare journey with our platform.
          </p>
          <Button asChild size="lg" className="bg-medical-accent text-white hover:bg-medical-accent/90">
            <Link to={isAuthenticated ? "/doctors" : "/register"}>
              {isAuthenticated ? "Find Specialists" : "Get Started Today"}
            </Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;
