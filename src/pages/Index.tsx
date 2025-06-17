
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BillOfLadingForm from '@/components/BillOfLadingForm';
import CMRForm from '@/components/CMRForm';
import DocumentTypeSelector from '@/components/DocumentTypeSelector';
import AuthPage from '@/components/AuthPage';

const Index = () => {
  const { user, loading } = useAuth();
  const [documentType, setDocumentType] = useState<'BOL' | 'CMR'>('BOL');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <DocumentTypeSelector 
          selectedType={documentType} 
          onTypeChange={setDocumentType} 
        />
        
        {documentType === 'BOL' ? <BillOfLadingForm /> : <CMRForm />}
      </div>
    </div>
  );
};

export default Index;
