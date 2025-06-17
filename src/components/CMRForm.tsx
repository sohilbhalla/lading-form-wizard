
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateCMRPDF } from '@/utils/cmrPdfExport';
import { generateCMRXML } from '@/utils/cmrXmlExport';

interface CargoItem {
  id: string;
  quantity: string;
  description: string;
  weight: string;
  volume: string;
  marks: string;
}

interface CMRFormData {
  // Sender (1)
  senderName: string;
  senderAddress: string;
  senderCountry: string;
  
  // Consignee (2)
  consigneeName: string;
  consigneeAddress: string;
  consigneeCountry: string;
  
  // Place and date of taking over goods (3)
  placeOfTakeover: string;
  dateOfTakeover: string;
  
  // Place designated for delivery (4)
  placeOfDelivery: string;
  
  // Carrier (5, 6, 7)
  carrierName: string;
  carrierAddress: string;
  carrierCountry: string;
  successiveCarriers: string;
  
  // Vehicle registration (8)
  vehicleRegistration: string;
  trailerRegistration: string;
  
  // Instructions (9)
  specialAgreements: string;
  documentsAttached: string;
  
  // Cash on delivery (13)
  codAmount: string;
  codCurrency: string;
  
  // Carrier's reservations (14)
  carriersReservations: string;
  
  // Agreed upon (15)
  agreedUpon: string;
  
  // To be paid by (16)
  paidBySender: boolean;
  paidByConsignee: boolean;
  carriageCharges: string;
  supplements: string;
  
  // Instructions for customs (17)
  customsInstructions: string;
  
  // Place and date (18, 19)
  placeOfSigning: string;
  dateOfSigning: string;
  
  // Signatures
  senderSignature: string;
  carrierSignature: string;
  consigneeSignature: string;
}

const CMRForm = () => {
  const [formData, setFormData] = useState<CMRFormData>({
    senderName: '',
    senderAddress: '',
    senderCountry: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneeCountry: '',
    placeOfTakeover: '',
    dateOfTakeover: '',
    placeOfDelivery: '',
    carrierName: '',
    carrierAddress: '',
    carrierCountry: '',
    successiveCarriers: '',
    vehicleRegistration: '',
    trailerRegistration: '',
    specialAgreements: '',
    documentsAttached: '',
    codAmount: '',
    codCurrency: 'EUR',
    carriersReservations: '',
    agreedUpon: '',
    paidBySender: true,
    paidByConsignee: false,
    carriageCharges: '',
    supplements: '',
    customsInstructions: '',
    placeOfSigning: '',
    dateOfSigning: new Date().toISOString().split('T')[0],
    senderSignature: '',
    carrierSignature: '',
    consigneeSignature: ''
  });

  const [cargoItems, setCargoItems] = useState<CargoItem[]>([
    { id: '1', quantity: '', description: '', weight: '', volume: '', marks: '' }
  ]);

  const handleInputChange = (field: keyof CMRFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCargoItem = () => {
    const newItem: CargoItem = {
      id: Date.now().toString(),
      quantity: '',
      description: '',
      weight: '',
      volume: '',
      marks: ''
    };
    setCargoItems([...cargoItems, newItem]);
  };

  const removeCargoItem = (id: string) => {
    if (cargoItems.length > 1) {
      setCargoItems(cargoItems.filter(item => item.id !== id));
    }
  };

  const updateCargoItem = (id: string, field: keyof CargoItem, value: string) => {
    setCargoItems(cargoItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleExportPDF = async () => {
    try {
      await generateCMRPDF(formData, cargoItems);
      toast.success('CMR PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleExportXML = async () => {
    try {
      await generateCMRXML(formData, cargoItems);
      toast.success('CMR XML exported successfully!');
    } catch (error) {
      console.error('XML export error:', error);
      toast.error('Failed to export XML');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              CMR - Convention relative au contrat de transport international de Marchandises par Route
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            
            {/* Section 1-2: Sender and Consignee */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">1. Sender (name, address, country)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="senderName">Name</Label>
                    <Input
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => handleInputChange('senderName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderAddress">Address</Label>
                    <Textarea
                      id="senderAddress"
                      value={formData.senderAddress}
                      onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderCountry">Country</Label>
                    <Input
                      id="senderCountry"
                      value={formData.senderCountry}
                      onChange={(e) => handleInputChange('senderCountry', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">2. Consignee (name, address, country)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="consigneeName">Name</Label>
                    <Input
                      id="consigneeName"
                      value={formData.consigneeName}
                      onChange={(e) => handleInputChange('consigneeName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="consigneeAddress">Address</Label>
                    <Textarea
                      id="consigneeAddress"
                      value={formData.consigneeAddress}
                      onChange={(e) => handleInputChange('consigneeAddress', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="consigneeCountry">Country</Label>
                    <Input
                      id="consigneeCountry"
                      value={formData.consigneeCountry}
                      onChange={(e) => handleInputChange('consigneeCountry', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section 3-4: Places */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">3. Place and date of taking over goods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="placeOfTakeover">Place</Label>
                    <Input
                      id="placeOfTakeover"
                      value={formData.placeOfTakeover}
                      onChange={(e) => handleInputChange('placeOfTakeover', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfTakeover">Date</Label>
                    <Input
                      id="dateOfTakeover"
                      type="date"
                      value={formData.dateOfTakeover}
                      onChange={(e) => handleInputChange('dateOfTakeover', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">4. Place designated for delivery of goods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="placeOfDelivery">Place</Label>
                    <Input
                      id="placeOfDelivery"
                      value={formData.placeOfDelivery}
                      onChange={(e) => handleInputChange('placeOfDelivery', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section 5-7: Carrier */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">5. Carrier (name, address, country)</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="carrierName">Name</Label>
                  <Input
                    id="carrierName"
                    value={formData.carrierName}
                    onChange={(e) => handleInputChange('carrierName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="carrierAddress">Address</Label>
                  <Input
                    id="carrierAddress"
                    value={formData.carrierAddress}
                    onChange={(e) => handleInputChange('carrierAddress', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="carrierCountry">Country</Label>
                  <Input
                    id="carrierCountry"
                    value={formData.carrierCountry}
                    onChange={(e) => handleInputChange('carrierCountry', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 8: Vehicle */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">8. Vehicle registration</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleRegistration">Vehicle Registration</Label>
                  <Input
                    id="vehicleRegistration"
                    value={formData.vehicleRegistration}
                    onChange={(e) => handleInputChange('vehicleRegistration', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="trailerRegistration">Trailer Registration</Label>
                  <Input
                    id="trailerRegistration"
                    value={formData.trailerRegistration}
                    onChange={(e) => handleInputChange('trailerRegistration', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 9-12: Goods */}
            <Card className="mb-6">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">9-12. Goods</CardTitle>
                <Button onClick={addCargoItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                {cargoItems.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Item {index + 1}</h4>
                      {cargoItems.length > 1 && (
                        <Button
                          onClick={() => removeCargoItem(item.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`quantity-${item.id}`}>Quantity and nature of packages</Label>
                        <Input
                          id={`quantity-${item.id}`}
                          value={item.quantity}
                          onChange={(e) => updateCargoItem(item.id, 'quantity', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weight-${item.id}`}>Gross weight (kg)</Label>
                        <Input
                          id={`weight-${item.id}`}
                          value={item.weight}
                          onChange={(e) => updateCargoItem(item.id, 'weight', e.target.value)}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`volume-${item.id}`}>Volume (m³)</Label>
                        <Input
                          id={`volume-${item.id}`}
                          value={item.volume}
                          onChange={(e) => updateCargoItem(item.id, 'volume', e.target.value)}
                          type="number"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`description-${item.id}`}>Description of goods</Label>
                        <Textarea
                          id={`description-${item.id}`}
                          value={item.description}
                          onChange={(e) => updateCargoItem(item.id, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`marks-${item.id}`}>Marks and numbers</Label>
                        <Textarea
                          id={`marks-${item.id}`}
                          value={item.marks}
                          onChange={(e) => updateCargoItem(item.id, 'marks', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sections 13-19 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">13. Cash on delivery</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codAmount">Amount</Label>
                    <Input
                      id="codAmount"
                      value={formData.codAmount}
                      onChange={(e) => handleInputChange('codAmount', e.target.value)}
                      type="number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="codCurrency">Currency</Label>
                    <Input
                      id="codCurrency"
                      value={formData.codCurrency}
                      onChange={(e) => handleInputChange('codCurrency', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">16. To be paid by</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="paidBySender"
                      checked={formData.paidBySender}
                      onCheckedChange={(checked) => handleInputChange('paidBySender', checked as boolean)}
                    />
                    <Label htmlFor="paidBySender">Sender</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="paidByConsignee"
                      checked={formData.paidByConsignee}
                      onCheckedChange={(checked) => handleInputChange('paidByConsignee', checked as boolean)}
                    />
                    <Label htmlFor="paidByConsignee">Consignee</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional sections */}
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Special agreements</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.specialAgreements}
                    onChange={(e) => handleInputChange('specialAgreements', e.target.value)}
                    rows={3}
                    placeholder="Any special agreements or instructions"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">18-19. Place and date of signing</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="placeOfSigning">Place</Label>
                    <Input
                      id="placeOfSigning"
                      value={formData.placeOfSigning}
                      onChange={(e) => handleInputChange('placeOfSigning', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfSigning">Date</Label>
                    <Input
                      id="dateOfSigning"
                      type="date"
                      value={formData.dateOfSigning}
                      onChange={(e) => handleInputChange('dateOfSigning', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-6" />

            {/* Export buttons */}
            <div className="flex gap-4 justify-center">
              <Button onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={handleExportXML} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export XML
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CMRForm;
