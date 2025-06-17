
interface CMRFormData {
  senderName: string;
  senderAddress: string;
  senderCountry: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeCountry: string;
  placeOfTakeover: string;
  dateOfTakeover: string;
  placeOfDelivery: string;
  carrierName: string;
  carrierAddress: string;
  carrierCountry: string;
  successiveCarriers: string;
  vehicleRegistration: string;
  trailerRegistration: string;
  specialAgreements: string;
  documentsAttached: string;
  codAmount: string;
  codCurrency: string;
  carriersReservations: string;
  agreedUpon: string;
  paidBySender: boolean;
  paidByConsignee: boolean;
  carriageCharges: string;
  supplements: string;
  customsInstructions: string;
  placeOfSigning: string;
  dateOfSigning: string;
  senderSignature: string;
  carrierSignature: string;
  consigneeSignature: string;
}

interface CargoItem {
  id: string;
  quantity: string;
  description: string;
  weight: string;
  volume: string;
  marks: string;
}

export const generateCMRXML = async (formData: CMRFormData, cargoItems: CargoItem[]) => {
  try {
    console.log('Starting CMR XML generation');

    const escapeXml = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const formatDate = (dateString: string): string => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    // Calculate totals
    const totalWeight = cargoItems.reduce((sum, item) => sum + parseFloat(item.weight || '0'), 0);
    const totalVolume = cargoItems.reduce((sum, item) => sum + parseFloat(item.volume || '0'), 0);
    const totalPackages = cargoItems.reduce((sum, item) => sum + parseInt(item.quantity || '0'), 0);

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<cmrDocument xmlns="urn:cmr:transport:1.0" version="1.0">
  <documentHeader>
    <documentType>CMR</documentType>
    <documentNumber>CMR-${Date.now()}</documentNumber>
    <issueDate>${formatDate(formData.dateOfSigning)}</issueDate>
    <issuePlace>${escapeXml(formData.placeOfSigning || '')}</issuePlace>
  </documentHeader>

  <!-- Section 1: Sender -->
  <sender>
    <name>${escapeXml(formData.senderName || '')}</name>
    <address>
      <street>${escapeXml(formData.senderAddress || '')}</street>
      <country>${escapeXml(formData.senderCountry || '')}</country>
    </address>
  </sender>

  <!-- Section 2: Consignee -->
  <consignee>
    <name>${escapeXml(formData.consigneeName || '')}</name>
    <address>
      <street>${escapeXml(formData.consigneeAddress || '')}</street>
      <country>${escapeXml(formData.consigneeCountry || '')}</country>
    </address>
  </consignee>

  <!-- Section 3: Place and date of taking over goods -->
  <takeoverDetails>
    <place>${escapeXml(formData.placeOfTakeover || '')}</place>
    <date>${formatDate(formData.dateOfTakeover)}</date>
  </takeoverDetails>

  <!-- Section 4: Place designated for delivery -->
  <deliveryDetails>
    <place>${escapeXml(formData.placeOfDelivery || '')}</place>
  </deliveryDetails>

  <!-- Section 5-7: Carrier -->
  <carrier>
    <name>${escapeXml(formData.carrierName || '')}</name>
    <address>
      <street>${escapeXml(formData.carrierAddress || '')}</street>
      <country>${escapeXml(formData.carrierCountry || '')}</country>
    </address>
    <successiveCarriers>${escapeXml(formData.successiveCarriers || '')}</successiveCarriers>
  </carrier>

  <!-- Section 8: Vehicle registration -->
  <vehicle>
    <registration>${escapeXml(formData.vehicleRegistration || '')}</registration>
    <trailerRegistration>${escapeXml(formData.trailerRegistration || '')}</trailerRegistration>
  </vehicle>

  <!-- Section 9-12: Goods -->
  <goods>
    <summary>
      <totalPackages>${totalPackages}</totalPackages>
      <totalWeight unit="kg">${totalWeight}</totalWeight>
      <totalVolume unit="m3">${totalVolume}</totalVolume>
    </summary>
    <cargoItems>
${cargoItems.map(item => `      <cargoItem>
        <quantity>${escapeXml(item.quantity || '')}</quantity>
        <description>${escapeXml(item.description || '')}</description>
        <weight unit="kg">${escapeXml(item.weight || '')}</weight>
        <volume unit="m3">${escapeXml(item.volume || '')}</volume>
        <marks>${escapeXml(item.marks || '')}</marks>
      </cargoItem>`).join('\n')}
    </cargoItems>
  </goods>

  <!-- Section 13: Cash on delivery -->
  ${formData.codAmount ? `<cashOnDelivery>
    <amount currency="${escapeXml(formData.codCurrency || 'EUR')}">${escapeXml(formData.codAmount)}</amount>
  </cashOnDelivery>` : ''}

  <!-- Section 14: Carrier's reservations -->
  ${formData.carriersReservations ? `<carriersReservations>
    <text>${escapeXml(formData.carriersReservations)}</text>
  </carriersReservations>` : ''}

  <!-- Section 15: Agreed upon -->
  ${formData.agreedUpon ? `<agreedUpon>
    <text>${escapeXml(formData.agreedUpon)}</text>
  </agreedUpon>` : ''}

  <!-- Section 16: To be paid by -->
  <freightCharges>
    <paidBy>
      <sender>${formData.paidBySender ? 'true' : 'false'}</sender>
      <consignee>${formData.paidByConsignee ? 'true' : 'false'}</consignee>
    </paidBy>
    <carriageCharges>${escapeXml(formData.carriageCharges || '')}</carriageCharges>
    <supplements>${escapeXml(formData.supplements || '')}</supplements>
  </freightCharges>

  <!-- Section 17: Instructions for customs -->
  ${formData.customsInstructions ? `<customsInstructions>
    <text>${escapeXml(formData.customsInstructions)}</text>
  </customsInstructions>` : ''}

  <!-- Special agreements -->
  ${formData.specialAgreements ? `<specialAgreements>
    <text>${escapeXml(formData.specialAgreements)}</text>
  </specialAgreements>` : ''}

  <!-- Documents attached -->
  ${formData.documentsAttached ? `<documentsAttached>
    <text>${escapeXml(formData.documentsAttached)}</text>
  </documentsAttached>` : ''}

  <!-- Signatures -->
  <signatures>
    <sender>
      <signature>${escapeXml(formData.senderSignature || '')}</signature>
    </sender>
    <carrier>
      <signature>${escapeXml(formData.carrierSignature || '')}</signature>
    </carrier>
    <consignee>
      <signature>${escapeXml(formData.consigneeSignature || '')}</signature>
    </consignee>
  </signatures>

  <!-- Legal notice -->
  <legalNotice>
    <text>Cette lettre de voiture est soumise à la Convention relative au contrat de transport international de marchandises par route (CMR).</text>
  </legalNotice>
</cmrDocument>`;

    // Create and download the XML file
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CMR_${formData.carrierName || 'document'}_${new Date().toISOString().split('T')[0]}.xml`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);

    console.log('CMR XML generation completed successfully');
  } catch (error) {
    console.error('Error in CMR XML generation:', error);
    throw error;
  }
};
