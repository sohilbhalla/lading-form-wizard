import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Ship, FileText, Printer, Container, Plus, Minus, Save, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import UserNav from './UserNav';

interface CargoItem {
  id: string;
  description: string;
  marks: string;
  packages: string;
  packageType: string;
  weight: string;
  measurement: string;
}

interface ContainerInfo {
  id: string;
  containerNumber: string;
  containerType: string;
  sealNumber: string;
  cargoItems: CargoItem[];
}

interface SavedBOL {
  id: string;
  bl_number: string;
  shipper_name: string;
  consignee_name: string;
  vessel_name: string;
  created_at: string;
}

const BillOfLadingForm = () => {
  const { user } = useAuth();
  const [currentBOLId, setCurrentBOLId] = useState<string | null>(null);
  const [savedBOLs, setSavedBOLs] = useState<SavedBOL[]>([]);
  const [isViewMode, setIsViewMode] = useState(false);
  
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

  const [containers, setContainers] = useState<ContainerInfo[]>([
    {
      id: '1',
      containerNumber: '',
      containerType: '',
      sealNumber: '',
      cargoItems: [
        { id: '1', description: '', marks: '', packages: '', packageType: '', weight: '', measurement: '' }
      ]
    }
  ]);

  // Load saved BOLs on component mount
  useEffect(() => {
    if (user) {
      loadSavedBOLs();
    }
  }, [user]);

  const loadSavedBOLs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bill_of_ladings')
        .select('id, bl_number, shipper_name, consignee_name, vessel_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedBOLs(data || []);
    } catch (error) {
      console.error('Error loading BOLs:', error);
      toast({
        title: "Load Failed",
        description: "Could not load your saved Bills of Lading.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCurrentBOLId(null);
    setIsViewMode(false);
    setFormData({
      bolNumber: '',
      exportReference: '',
      forwardingAgent: '',
      shipperName: '',
      shipperAddress: '',
      shipperCity: '',
      shipperCountry: '',
      consigneeName: '',
      consigneeAddress: '',
      consigneeCity: '',
      consigneeCountry: '',
      notifyPartyName: '',
      notifyPartyAddress: '',
      notifyPartyCity: '',
      notifyPartyCountry: '',
      vesselName: '',
      voyageNumber: '',
      portOfLoading: '',
      portOfDischarge: '',
      placeOfReceipt: '',
      placeOfDelivery: '',
      freightPayableAt: '',
      numberOfOriginalBols: '3',
      onBoardDate: '',
      freightCharges: '',
      otherCharges: '',
      prepaid: false,
      collect: false,
      termsAndConditions: 'Received the goods herein mentioned in apparent good order and condition unless otherwise noted, to be transported and delivered as mentioned above.',
    });
    setContainers([
      {
        id: '1',
        containerNumber: '',
        containerType: '',
        sealNumber: '',
        cargoItems: [
          { id: '1', description: '', marks: '', packages: '', packageType: '', weight: '', measurement: '' }
        ]
      }
    ]);
  };

  const loadBOL = async (bolId: string, viewOnly: boolean = false) => {
    try {
      const { data, error } = await supabase
        .from('bill_of_ladings')
        .select('*')
        .eq('id', bolId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setCurrentBOLId(bolId);
      setIsViewMode(viewOnly);
      
      // Populate form data
      setFormData({
        bolNumber: data.bl_number || '',
        exportReference: '',
        forwardingAgent: '',
        shipperName: data.shipper_name || '',
        shipperAddress: data.shipper_address || '',
        consigneeName: data.consignee_name || '',
        consigneeAddress: data.consignee_address || '',
        notifyPartyName: data.notify_party_name || '',
        notifyPartyAddress: data.notify_party_address || '',
        vesselName: data.vessel_name || '',
        voyageNumber: data.voyage_number || '',
        portOfLoading: data.port_of_loading || '',
        portOfDischarge: data.port_of_discharge || '',
        placeOfReceipt: data.place_of_receipt || '',
        placeOfDelivery: data.place_of_delivery || '',
        freightPayableAt: '',
        numberOfOriginalBols: '3',
        onBoardDate: '',
        freightCharges: data.freight_charges || '',
        otherCharges: '',
        prepaid: data.payment_terms === 'Prepaid',
        collect: data.payment_terms === 'Collect',
        termsAndConditions: 'Received the goods herein mentioned in apparent good order and condition unless otherwise noted, to be transported and delivered as mentioned above.',
      });

      // Populate containers data
      if (data.containers && Array.isArray(data.containers)) {
        setContainers(data.containers as ContainerInfo[]);
      }

      toast({
        title: viewOnly ? "BOL Loaded for Viewing" : "BOL Loaded for Editing",
        description: `Bill of Lading ${data.bl_number} has been loaded.`,
      });
    } catch (error) {
      console.error('Error loading BOL:', error);
      toast({
        title: "Load Failed",
        description: "Could not load the selected Bill of Lading.",
        variant: "destructive",
      });
    }
  };

  const deleteBOL = async (bolId: string) => {
    if (!confirm('Are you sure you want to delete this Bill of Lading? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bill_of_ladings')
        .delete()
        .eq('id', bolId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "BOL Deleted",
        description: "The Bill of Lading has been deleted successfully.",
      });

      // Refresh the list and reset form if currently editing this BOL
      await loadSavedBOLs();
      if (currentBOLId === bolId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting BOL:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the Bill of Lading.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (isViewMode) return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContainerChange = (containerId: string, field: string, value: string) => {
    if (isViewMode) return;
    setContainers(prev => prev.map(container => 
      container.id === containerId ? { ...container, [field]: value } : container
    ));
  };

  const handleCargoChange = (containerId: string, cargoId: string, field: string, value: string) => {
    if (isViewMode) return;
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            cargoItems: container.cargoItems.map(item => 
              item.id === cargoId ? { ...item, [field]: value } : item
            )
          }
        : container
    ));
  };

  const addContainer = () => {
    if (isViewMode) return;
    const newId = (containers.length + 1).toString();
    setContainers(prev => [...prev, {
      id: newId,
      containerNumber: '',
      containerType: '',
      sealNumber: '',
      cargoItems: [
        { id: '1', description: '', marks: '', packages: '', packageType: '', weight: '', measurement: '' }
      ]
    }]);
  };

  const removeContainer = (containerId: string) => {
    if (isViewMode) return;
    if (containers.length > 1) {
      setContainers(prev => prev.filter(container => container.id !== containerId));
    }
  };

  const addCargoItem = (containerId: string) => {
    if (isViewMode) return;
    setContainers(prev => prev.map(container => {
      if (container.id === containerId) {
        const newCargoId = (container.cargoItems.length + 1).toString();
        return {
          ...container,
          cargoItems: [...container.cargoItems, {
            id: newCargoId,
            description: '',
            marks: '',
            packages: '',
            packageType: '',
            weight: '',
            measurement: ''
          }]
        };
      }
      return container;
    }));
  };

  const removeCargoItem = (containerId: string, cargoId: string) => {
    if (isViewMode) return;
    setContainers(prev => prev.map(container => {
      if (container.id === containerId && container.cargoItems.length > 1) {
        return {
          ...container,
          cargoItems: container.cargoItems.filter(item => item.id !== cargoId)
        };
      }
      return container;
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your Bill of Lading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const bolData = {
        user_id: user.id,
        bl_number: formData.bolNumber,
        shipper_name: formData.shipperName,
        shipper_address: formData.shipperAddress,
        consignee_name: formData.consigneeName,
        consignee_address: formData.consigneeAddress,
        notify_party_name: formData.notifyPartyName,
        notify_party_address: formData.notifyPartyAddress,
        port_of_loading: formData.portOfLoading,
        port_of_discharge: formData.portOfDischarge,
        place_of_receipt: formData.placeOfReceipt,
        place_of_delivery: formData.placeOfDelivery,
        vessel_name: formData.vesselName,
        voyage_number: formData.voyageNumber,
        freight_charges: formData.freightCharges,
        payment_terms: formData.prepaid ? 'Prepaid' : formData.collect ? 'Collect' : '',
        containers: containers as any, // Type assertion to match Json type
      };

      let result;
      if (currentBOLId) {
        // Update existing BOL
        result = await supabase
          .from('bill_of_ladings')
          .update(bolData)
          .eq('id', currentBOLId)
          .eq('user_id', user.id);
      } else {
        // Create new BOL
        result = await supabase
          .from('bill_of_ladings')
          .insert([bolData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: currentBOLId ? "BOL Updated" : "BOL Saved",
        description: currentBOLId 
          ? "Your Bill of Lading has been updated successfully."
          : "Your Bill of Lading has been saved successfully.",
      });

      await loadSavedBOLs();
    } catch (error) {
      console.error('Error saving BOL:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your Bill of Lading. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Ship className="h-8 w-8" />
            <h1 className="text-3xl font-bold">BILL OF LADING</h1>
            <FileText className="h-8 w-8" />
          </div>
          <UserNav />
        </div>
        <p className="text-blue-100 mt-2">Ocean Bill of Lading - Non-Negotiable</p>
        {isViewMode && (
          <p className="text-yellow-200 mt-2 font-semibold">VIEW ONLY MODE</p>
        )}
      </div>

      {/* Saved BOLs List */}
      {savedBOLs.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-900">Your Saved Bills of Lading</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {savedBOLs.map((bol) => (
                <div key={bol.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold">{bol.bl_number}</div>
                    <div className="text-sm text-gray-600">
                      {bol.shipper_name} → {bol.consignee_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Vessel: {bol.vessel_name} | Created: {new Date(bol.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => loadBOL(bol.id, true)} 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      onClick={() => loadBOL(bol.id, false)} 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => deleteBOL(bol.id)} 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button onClick={resetForm} variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-50">
            New BOL
          </Button>
        </div>
        <div className="flex gap-4">
          {!isViewMode && (
            <Button onClick={handleSave} className="bg-blue-900 hover:bg-blue-800">
              <Save className="h-4 w-4 mr-2" />
              {currentBOLId ? 'Update BOL' : 'Save BOL'}
            </Button>
          )}
          <Button onClick={handlePrint} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
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
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="exportReference" className="font-semibold">Export Reference</Label>
              <Input
                id="exportReference"
                value={formData.exportReference}
                onChange={(e) => handleInputChange('exportReference', e.target.value)}
                placeholder="EXP-REF-001"
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="forwardingAgent" className="font-semibold">Forwarding Agent</Label>
              <Input
                id="forwardingAgent"
                value={formData.forwardingAgent}
                onChange={(e) => handleInputChange('forwardingAgent', e.target.value)}
                placeholder="Agent Name"
                disabled={isViewMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parties Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                disabled={isViewMode}
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
                disabled={isViewMode}
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
                  disabled={isViewMode}
                />
              </div>
              <div>
                <Label htmlFor="shipperCountry" className="font-semibold">Country</Label>
                <Input
                  id="shipperCountry"
                  value={formData.shipperCountry}
                  onChange={(e) => handleInputChange('shipperCountry', e.target.value)}
                  placeholder="Country"
                  disabled={isViewMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                disabled={isViewMode}
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
                disabled={isViewMode}
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
                  disabled={isViewMode}
                />
              </div>
              <div>
                <Label htmlFor="consigneeCountry" className="font-semibold">Country</Label>
                <Input
                  id="consigneeCountry"
                  value={formData.consigneeCountry}
                  onChange={(e) => handleInputChange('consigneeCountry', e.target.value)}
                  placeholder="Country"
                  disabled={isViewMode}
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
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="notifyPartyAddress" className="font-semibold">Address</Label>
              <Input
                id="notifyPartyAddress"
                value={formData.notifyPartyAddress}
                onChange={(e) => handleInputChange('notifyPartyAddress', e.target.value)}
                placeholder="Address"
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="notifyPartyCity" className="font-semibold">City</Label>
              <Input
                id="notifyPartyCity"
                value={formData.notifyPartyCity}
                onChange={(e) => handleInputChange('notifyPartyCity', e.target.value)}
                placeholder="City"
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="notifyPartyCountry" className="font-semibold">Country</Label>
              <Input
                id="notifyPartyCountry"
                value={formData.notifyPartyCountry}
                onChange={(e) => handleInputChange('notifyPartyCountry', e.target.value)}
                placeholder="Country"
                disabled={isViewMode}
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
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="voyageNumber" className="font-semibold">Voyage Number</Label>
              <Input
                id="voyageNumber"
                value={formData.voyageNumber}
                onChange={(e) => handleInputChange('voyageNumber', e.target.value)}
                placeholder="V001E"
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="onBoardDate" className="font-semibold">On Board Date</Label>
              <Input
                id="onBoardDate"
                type="date"
                value={formData.onBoardDate}
                onChange={(e) => handleInputChange('onBoardDate', e.target.value)}
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="portOfLoading" className="font-semibold">Port of Loading *</Label>
              <Input
                id="portOfLoading"
                value={formData.portOfLoading}
                onChange={(e) => handleInputChange('portOfLoading', e.target.value)}
                placeholder="Port of Loading"
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="portOfDischarge" className="font-semibold">Port of Discharge *</Label>
              <Input
                id="portOfDischarge"
                value={formData.portOfDischarge}
                onChange={(e) => handleInputChange('portOfDischarge', e.target.value)}
                placeholder="Port of Discharge"
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="placeOfReceipt" className="font-semibold">Place of Receipt</Label>
              <Input
                id="placeOfReceipt"
                value={formData.placeOfReceipt}
                onChange={(e) => handleInputChange('placeOfReceipt', e.target.value)}
                placeholder="Place of Receipt"
                disabled={isViewMode}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="placeOfDelivery" className="font-semibold">Place of Delivery</Label>
              <Input
                id="placeOfDelivery"
                value={formData.placeOfDelivery}
                onChange={(e) => handleInputChange('placeOfDelivery', e.target.value)}
                placeholder="Place of Delivery"
                disabled={isViewMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updated Container & Cargo Details Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Container className="h-5 w-5" />
            Container & Cargo Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {containers.map((container, containerIndex) => (
              <div key={container.id} className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <Container className="h-5 w-5" />
                    Container #{containerIndex + 1}
                  </h3>
                  {containers.length > 1 && !isViewMode && (
                    <Button
                      onClick={() => removeContainer(container.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Remove Container
                    </Button>
                  )}
                </div>
                
                {/* Container Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white rounded-lg border">
                  <div>
                    <Label className="font-semibold">Container Number *</Label>
                    <Input
                      value={container.containerNumber}
                      onChange={(e) => handleContainerChange(container.id, 'containerNumber', e.target.value)}
                      placeholder="TEMU1234567"
                      className="font-mono"
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label className="font-semibold">Container Type</Label>
                    <Select 
                      value={container.containerType} 
                      onValueChange={(value) => handleContainerChange(container.id, 'containerType', value)}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20DC">20' Dry Container</SelectItem>
                        <SelectItem value="40DC">40' Dry Container</SelectItem>
                        <SelectItem value="40HC">40' High Cube</SelectItem>
                        <SelectItem value="20RF">20' Reefer</SelectItem>
                        <SelectItem value="40RF">40' Reefer</SelectItem>
                        <SelectItem value="20OT">20' Open Top</SelectItem>
                        <SelectItem value="40OT">40' Open Top</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-semibold">Seal Number</Label>
                    <Input
                      value={container.sealNumber}
                      onChange={(e) => handleContainerChange(container.id, 'sealNumber', e.target.value)}
                      placeholder="SL123456"
                      className="font-mono"
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                {/* Cargo Items for this Container */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Cargo Items in Container #{containerIndex + 1}
                  </h4>
                  
                  {container.cargoItems.map((item, itemIndex) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-medium text-gray-700">Product Line #{itemIndex + 1}</h5>
                        {container.cargoItems.length > 1 && !isViewMode && (
                          <Button
                            onClick={() => removeCargoItem(container.id, item.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="md:col-span-2 lg:col-span-1">
                          <Label className="font-semibold">Description of Goods *</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleCargoChange(container.id, item.id, 'description', e.target.value)}
                            placeholder="Detailed description of goods"
                            rows={3}
                            disabled={isViewMode}
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">Marks & Numbers</Label>
                          <Textarea
                            value={item.marks}
                            onChange={(e) => handleCargoChange(container.id, item.id, 'marks', e.target.value)}
                            placeholder="Package marks"
                            rows={3}
                            disabled={isViewMode}
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">No. of Packages</Label>
                          <Input
                            value={item.packages}
                            onChange={(e) => handleCargoChange(container.id, item.id, 'packages', e.target.value)}
                            placeholder="100"
                            disabled={isViewMode}
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">Package Type</Label>
                          <Select 
                            value={item.packageType} 
                            onValueChange={(value) => handleCargoChange(container.id, item.id, 'packageType', value)}
                            disabled={isViewMode}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="boxes">Boxes</SelectItem>
                              <SelectItem value="pallets">Pallets</SelectItem>
                              <SelectItem value="bags">Bags</SelectItem>
                              <SelectItem value="drums">Drums</SelectItem>
                              <SelectItem value="cases">Cases</SelectItem>
                              <SelectItem value="pieces">Pieces</SelectItem>
                              <SelectItem value="cartons">Cartons</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="font-semibold">Gross Weight (kg)</Label>
                          <Input
                            value={item.weight}
                            onChange={(e) => handleCargoChange(container.id, item.id, 'weight', e.target.value)}
                            placeholder="1000"
                            disabled={isViewMode}
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">Measurement (CBM)</Label>
                          <Input
                            value={item.measurement}
                            onChange={(e) => handleCargoChange(container.id, item.id, 'measurement', e.target.value)}
                            placeholder="10.5"
                            disabled={isViewMode}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!isViewMode && (
                    <Button 
                      onClick={() => addCargoItem(container.id)} 
                      variant="outline" 
                      className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product Line to Container #{containerIndex + 1}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {!isViewMode && (
              <Button onClick={addContainer} className="w-full bg-blue-900 hover:bg-blue-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Container
              </Button>
            )}
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
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="freightCharges" className="font-semibold">Freight Charges</Label>
              <Input
                id="freightCharges"
                value={formData.freightCharges}
                onChange={(e) => handleInputChange('freightCharges', e.target.value)}
                placeholder="$5,000.00"
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="otherCharges" className="font-semibold">Other Charges</Label>
              <Input
                id="otherCharges"
                value={formData.otherCharges}
                onChange={(e) => handleInputChange('otherCharges', e.target.value)}
                placeholder="$500.00"
                disabled={isViewMode}
              />
            </div>
            <div>
              <Label htmlFor="numberOfOriginalBols" className="font-semibold">Number of Original B/Ls</Label>
              <Select 
                value={formData.numberOfOriginalBols} 
                onValueChange={(value) => handleInputChange('numberOfOriginalBols', value)}
                disabled={isViewMode}
              >
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
                  disabled={isViewMode}
                />
                <Label htmlFor="prepaid" className="font-semibold">Prepaid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="collect"
                  checked={formData.collect}
                  onCheckedChange={(checked) => handleInputChange('collect', checked as boolean)}
                  disabled={isViewMode}
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
              disabled={isViewMode}
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
