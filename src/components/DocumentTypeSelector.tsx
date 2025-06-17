
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Truck } from 'lucide-react';

interface DocumentTypeSelectorProps {
  selectedType: 'BOL' | 'CMR';
  onTypeChange: (type: 'BOL' | 'CMR') => void;
}

const DocumentTypeSelector = ({ selectedType, onTypeChange }: DocumentTypeSelectorProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Select Document Type</h2>
          <p className="text-gray-600 mt-2">Choose the type of transport document to create</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={() => onTypeChange('BOL')}
            variant={selectedType === 'BOL' ? 'default' : 'outline'}
            className={`h-24 flex flex-col items-center justify-center space-y-2 ${
              selectedType === 'BOL' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'hover:bg-blue-50'
            }`}
          >
            <FileText className="h-8 w-8" />
            <div className="text-center">
              <div className="font-semibold">Bill of Lading (BOL)</div>
              <div className="text-sm opacity-80">Maritime/Ocean freight</div>
            </div>
          </Button>

          <Button
            onClick={() => onTypeChange('CMR')}
            variant={selectedType === 'CMR' ? 'default' : 'outline'}
            className={`h-24 flex flex-col items-center justify-center space-y-2 ${
              selectedType === 'CMR' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'hover:bg-green-50'
            }`}
          >
            <Truck className="h-8 w-8" />
            <div className="text-center">
              <div className="font-semibold">CMR</div>
              <div className="text-sm opacity-80">Road transport</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTypeSelector;
