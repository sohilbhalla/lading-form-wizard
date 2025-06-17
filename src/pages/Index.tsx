
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BillOfLadingForm from '@/components/BillOfLadingForm';
import AuthPage from '@/components/AuthPage';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-blue-900 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <BillOfLadingForm />;
};

export default Index;
