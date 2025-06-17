
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Ship, FileText, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CargoItem {
  id: string;
  description: string;
  marks: string;
  packages: string;
  packageType: string;
  weight: string;
  measurement: string;
}

const BillOfLadingForm = () => {
  const [formData, setFormData] = useState({
    // Header Information
    bolNumber: '',
    exportReference: '',
    forwardingAgent: '',
    
    // Shipper Information
    shipperName: '',
    shipperAddress: '',
    shipperCity: '',
    shipperCountry: '',
    
    // Consignee Information
    consigneeName: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeCountry: '',
    
    // Notify Party
    notifyPartyName: '',
    notifyPartyAddress: '',
    notifyPartyCity: '',
    notifyPartyCountry: '',
    
    // Vessel Information
    vesselName: '',
    voyageNumber: '',
    portOfLoading: '',
    portOfDischarge: '',
    placeOfReceipt: '',
    placeOfDelivery: '',
    
    // Freight Information
    freightPayableAt: '',
    numberOfOriginalBols: '3',
    
    // Additional Information
    onBoardDate: '',
    freightCharges: '',
    otherCharges: '',
    prepaid: false,
    collect: false,
    
    // Terms
    termsAndConditions: 'Received the goods herein mentioned in apparent good order and condition unless otherwise noted, to be transported and delivered as mentioned above.',
  });

  const [cargoItems, setCargoItems] = useState<CargoItem[]>([
    { id: '1', description: '', marks: '', packages: '', packageType: '', weight: '', measurement: '' }
  ]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCargoChange = (id: string, field: string, value: string) => {
    setCargoItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addCargoItem = () => {
    const newId = (cargoItems.length + 1).toString();
    setCargoItems(prev => [...prev, {
      id: newId,
      description: '',
      marks: '',
      packages: '',
      packageType: '',
      weight: '',
      measurement: ''
    }]);
  };

  const removeCargoItem = (id: string) => {
    if (cargoItems.length > 1) {
      setCargoItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    toast({
      title: "Bill of Lading Saved",
      description: "Your Bill of Lading has been saved successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Ship className="h-8 w-8" />
          <h1 className="text-3xl font-bold">BILL OF LADING</h1>
          <FileText className="h-8 w-8" />
        </div>
        <p className="text-blue-100">Ocean Bill of Lading - Non-Negotiable</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button onClick={handleSave} className="bg-blue-900 hover:bg-blue-800">
          Save BOL
        </Button>
        <Button onClick={handlePrint} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      {/* BOL Header Information */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">BOL Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="bolNumber" className="font-semibold">B/L Number *</Label>
              <Input
                id="bolNumber"
                value={formData.bolNumber}
                onChange={(e) => handleInputChange('bolNumber', e.target.value)}
                className="font-mono"
                placeholder="BOL-2024-001"
              />
            </div>
            <div>
              <Label htmlFor="exportReference" className="font-semibold">Export Reference</Label>
              <Input
                id="exportReference"
                value={formData.exportReference}
                onChange={(e) => handleInputChange('exportReference', e.target.value)}
                placeholder="EXP-REF-001"
              />
            </div>
            <div>
              <Label htmlFor="forwardingAgent" className="font-semibold">Forwarding Agent</Label>
              <Input
                id="forwardingAgent"
                value={formData.forwardingAgent}
                onChange={(e) => handleInputChange('forwardingAgent', e.target.value)}
                placeholder="Agent Name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parties Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipper */}
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-900">Shipper (Exporter)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="shipperName" className="font-semibold">Company Name *</Label>
              <Input
                id="shipperName"
                value={formData.shipperName}
                onChange={(e) => handleInputChange('shipperName', e.target.value)}
                placeholder="Shipper Company Name"
              />
            </div>
            <div>
              <Label htmlFor="shipperAddress" className="font-semibold">Address</Label>
              <Textarea
                id="shipperAddress"
                value={formData.shipperAddress}
                onChange={(e) => handleInputChange('shipperAddress', e.target.value)}
                placeholder="Street Address"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipperCity" className="font-semibold">City</Label>
                <Input
                  id="shipperCity"
                  value={formData.shipperCity}
                  onChange={(e) => handleInputChange('shipperCity', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="shipperCountry" className="font-semibold">Country</Label>
                <Input
                  id="shipperCountry"
                  value={formData.shipperCountry}
                  onChange={(e) => handleInputChange('shipperCountry', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consignee */}
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-900">Consignee (Importer)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="consigneeName" className="font-semibold">Company Name *</Label>
              <Input
                id="consigneeName"
                value={formData.consigneeName}
                onChange={(e) => handleInputChange('consigneeName', e.target.value)}
                placeholder="Consignee Company Name"
              />
            </div>
            <div>
              <Label htmlFor="consigneeAddress" className="font-semibold">Address</Label>
              <Textarea
                id="consigneeAddress"
                value={formData.consigneeAddress}
                onChange={(e) => handleInputChange('consigneeAddress', e.target.value)}
                placeholder="Street Address"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consigneeCity" className="font-semibold">City</Label>
                <Input
                  id="consigneeCity"
                  value={formData.consigneeCity}
                  onChange={(e) => handleInputChange('consigneeCity', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="consigneeCountry" className="font-semibold">Country</Label>
                <Input
                  id="consigneeCountry"
                  value={formData.consigneeCountry}
                  onChange={(e) => handleInputChange('consigneeCountry', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notify Party */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Notify Party</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="notifyPartyName" className="font-semibold">Company Name</Label>
              <Input
                id="notifyPartyName"
                value={formData.notifyPartyName}
                onChange={(e) => handleInputChange('notifyPartyName', e.target.value)}
                placeholder="Notify Party Name"
              />
            </div>
            <div>
              <Label htmlFor="notifyPartyAddress" className="font-semibold">Address</Label>
              <Input
                id="notifyPartyAddress"
                value={formData.notifyPartyAddress}
                onChange={(e) => handleInputChange('notifyPartyAddress', e.target.value)}
                placeholder="Address"
              />
            </div>
            <div>
              <Label htmlFor="notifyPartyCity" className="font-semibold">City</Label>
              <Input
                id="notifyPartyCity"
                value={formData.notifyPartyCity}
                onChange={(e) => handleInputChange('notifyPartyCity', e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="notifyPartyCountry" className="font-semibold">Country</Label>
              <Input
                id="notifyPartyCountry"
                value={formData.notifyPartyCountry}
                onChange={(e) => handleInputChange('notifyPartyCountry', e.target.value)}
                placeholder="Country"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vessel & Port Information */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Vessel & Port Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="vesselName" className="font-semibold">Vessel Name *</Label>
              <Input
                id="vesselName"
                value={formData.vesselName}
                onChange={(e) => handleInputChange('vesselName', e.target.value)}
                placeholder="MV Example Ship"
              />
            </div>
            <div>
              <Label htmlFor="voyageNumber" className="font-semibold">Voyage Number</Label>
              <Input
                id="voyageNumber"
                value={formData.voyageNumber}
                onChange={(e) => handleInputChange('voyageNumber', e.target.value)}
                placeholder="V001E"
              />
            </div>
            <div>
              <Label htmlFor="onBoardDate" className="font-semibold">On Board Date</Label>
              <Input
                id="onBoardDate"
                type="date"
                value={formData.onBoardDate}
                onChange={(e) => handleInputChange('onBoardDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="portOfLoading" className="font-semibold">Port of Loading *</Label>
              <Input
                id="portOfLoading"
                value={formData.portOfLoading}
                onChange={(e) => handleInputChange('portOfLoading', e.target.value)}
                placeholder="Port of Loading"
              />
            </div>
            <div>
              <Label htmlFor="portOfDischarge" className="font-semibold">Port of Discharge *</Label>
              <Input
                id="portOfDischarge"
                value={formData.portOfDischarge}
                onChange={(e) => handleInputChange('portOfDischarge', e.target.value)}
                placeholder="Port of Discharge"
              />
            </div>
            <div>
              <Label htmlFor="placeOfReceipt" className="font-semibold">Place of Receipt</Label>
              <Input
                id="placeOfReceipt"
                value={formData.placeOfReceipt}
                onChange={(e) => handleInputChange('placeOfReceipt', e.target.value)}
                placeholder="Place of Receipt"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="placeOfDelivery" className="font-semibold">Place of Delivery</Label>
              <Input
                id="placeOfDelivery"
                value={formData.placeOfDelivery}
                onChange={(e) => handleInputChange('placeOfDelivery', e.target.value)}
                placeholder="Place of Delivery"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cargo Details */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Cargo Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {cargoItems.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-blue-900">Cargo Item #{index + 1}</h4>
                  {cargoItems.length > 1 && (
                    <Button
                      onClick={() => removeCargoItem(item.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2 lg:col-span-1">
                    <Label className="font-semibold">Description of Goods *</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => handleCargoChange(item.id, 'description', e.target.value)}
                      placeholder="Detailed description of goods"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="font-semibold">Marks & Numbers</Label>
                    <Textarea
                      value={item.marks}
                      onChange={(e) => handleCargoChange(item.id, 'marks', e.target.value)}
                      placeholder="Container/Package marks"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="font-semibold">No. of Packages</Label>
                    <Input
                      value={item.packages}
                      onChange={(e) => handleCargoChange(item.id, 'packages', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label className="font-semibold">Package Type</Label>
                    <Select value={item.packageType} onValueChange={(value) => handleCargoChange(item.id, 'packageType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boxes">Boxes</SelectItem>
                        <SelectItem value="pallets">Pallets</SelectItem>
                        <SelectItem value="containers">Containers</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="drums">Drums</SelectItem>
                        <SelectItem value="cases">Cases</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-semibold">Gross Weight (kg)</Label>
                    <Input
                      value={item.weight}
                      onChange={(e) => handleCargoChange(item.id, 'weight', e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <Label className="font-semibold">Measurement (CBM)</Label>
                    <Input
                      value={item.measurement}
                      onChange={(e) => handleCargoChange(item.id, 'measurement', e.target.value)}
                      placeholder="10.5"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addCargoItem} variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
              Add Another Cargo Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Freight & Charges */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Freight & Charges</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="freightPayableAt" className="font-semibold">Freight Payable At</Label>
              <Input
                id="freightPayableAt"
                value={formData.freightPayableAt}
                onChange={(e) => handleInputChange('freightPayableAt', e.target.value)}
                placeholder="Destination Port"
              />
            </div>
            <div>
              <Label htmlFor="freightCharges" className="font-semibold">Freight Charges</Label>
              <Input
                id="freightCharges"
                value={formData.freightCharges}
                onChange={(e) => handleInputChange('freightCharges', e.target.value)}
                placeholder="$5,000.00"
              />
            </div>
            <div>
              <Label htmlFor="otherCharges" className="font-semibold">Other Charges</Label>
              <Input
                id="otherCharges"
                value={formData.otherCharges}
                onChange={(e) => handleInputChange('otherCharges', e.target.value)}
                placeholder="$500.00"
              />
            </div>
            <div>
              <Label htmlFor="numberOfOriginalBols" className="font-semibold">Number of Original B/Ls</Label>
              <Select value={formData.numberOfOriginalBols} onValueChange={(value) => handleInputChange('numberOfOriginalBols', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prepaid"
                  checked={formData.prepaid}
                  onCheckedChange={(checked) => handleInputChange('prepaid', checked as boolean)}
                />
                <Label htmlFor="prepaid" className="font-semibold">Prepaid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="collect"
                  checked={formData.collect}
                  onCheckedChange={(checked) => handleInputChange('collect', checked as boolean)}
                />
                <Label htmlFor="collect" className="font-semibold">Collect</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div>
            <Label htmlFor="termsAndConditions" className="font-semibold">Terms and Conditions</Label>
            <Textarea
              id="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
              rows={8}
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg">
        <p className="text-sm text-blue-100">
          This Bill of Lading is subject to the terms and conditions on the reverse side hereof and to the Hague-Visby Rules.
        </p>
        <p className="text-xs text-blue-200 mt-2">
          Generated on {new Date().toLocaleDateString()} | BOL Management System
        </p>
      </div>
    </div>
  );
};

export default BillOfLadingForm;
