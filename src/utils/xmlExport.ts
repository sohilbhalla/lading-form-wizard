
interface FormData {
  bolNumber: string;
  exportReference: string;
  forwardingAgent: string;
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperCountry: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeCountry: string;
  notifyPartyName: string;
  notifyPartyAddress: string;
  notifyPartyCity: string;
  notifyPartyCountry: string;
  vesselName: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  freightPayableAt: string;
  numberOfOriginalBols: string;
  onBoardDate: string;
  freightCharges: string;
  otherCharges: string;
  prepaid: boolean;
  collect: boolean;
  termsAndConditions: string;
}

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

export const generateBOLXML = (formData: FormData, containers: ContainerInfo[]): string => {
  const currentDate = new Date().toISOString();
  const totalPackages = containers.reduce((total, container) => 
    total + container.cargoItems.reduce((sum, item) => sum + parseInt(item.packages || '0'), 0), 0
  );
  const totalWeight = containers.reduce((total, container) => 
    total + container.cargoItems.reduce((sum, item) => sum + parseFloat(item.weight || '0'), 0), 0
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ShippingInstruction xmlns="https://dcsa.org/schemas/ebl/v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://dcsa.org/schemas/ebl/v3 shipping-instruction-v3.0.0.xsd">
  <shippingInstructionReference>${formData.bolNumber}</shippingReference>
  <documentStatus>RECEIVED</documentStatus>
  <shippingInstructionCreatedDateTime>${currentDate}</shippingInstructionCreatedDateTime>
  <shippingInstructionUpdatedDateTime>${currentDate}</shippingInstructionUpdatedDateTime>
  <transportDocumentType>BOL</transportDocumentType>
  <isShippedOnBoardType>true</isShippedOnBoardType>
  <numberOfCopies>${formData.numberOfOriginalBols || '3'}</numberOfCopies>
  <numberOfOriginals>${formData.numberOfOriginalBols || '3'}</numberOfOriginals>
  
  <shipper>
    <partyName>${formData.shipperName}</partyName>
    <address>
      <street>${formData.shipperAddress}</street>
      <city>${formData.shipperCity}</city>
      <country>${formData.shipperCountry}</country>
    </address>
  </shipper>
  
  <consignee>
    <partyName>${formData.consigneeName}</partyName>
    <address>
      <street>${formData.consigneeAddress}</street>
      <city>${formData.consigneeCity}</city>
      <country>${formData.consigneeCountry}</country>
    </address>
  </consignee>
  
  ${formData.notifyPartyName ? `
  <notifyParty>
    <partyName>${formData.notifyPartyName}</partyName>
    <address>
      <street>${formData.notifyPartyAddress}</street>
      <city>${formData.notifyPartyCity}</city>
      <country>${formData.notifyPartyCountry}</country>
    </address>
  </notifyParty>
  ` : ''}
  
  <cargoItems>
    ${containers.map(container => 
      container.cargoItems.map(item => `
    <cargoItem>
      <cargoLineItems>
        <cargoLineItem>
          <shippingMarks>${item.marks}</shippingMarks>
          <cargoDescription>${item.description}</cargoDescription>
          <HSCode></HSCode>
        </cargoLineItem>
      </cargoLineItems>
      <weight>${item.weight}</weight>
      <weightUnit>KGM</weightUnit>
      <volume>${item.measurement}</volume>
      <volumeUnit>MTQ</volumeUnit>
      <packageQuantity>${item.packages}</packageQuantity>
      <packageCode>${item.packageType}</packageCode>
    </cargoItem>
      `).join('')
    ).join('')}
  </cargoItems>
  
  <utilizedTransportEquipments>
    ${containers.map(container => `
    <utilizedTransportEquipment>
      <equipmentReference>${container.containerNumber}</equipmentReference>
      <ISOEquipmentCode>${container.containerType}</ISOEquipmentCode>
      <seals>
        <seal>
          <sealNumber>${container.sealNumber}</sealNumber>
          <sealSource>SHI</sealSource>
          <sealType>WIR</sealType>
        </seal>
      </seals>
    </utilizedTransportEquipment>
    `).join('')}
  </utilizedTransportEquipments>
  
  <transportPlan>
    <transportPlanStage>
      <transportPlanStageSequenceNumber>1</transportPlanStageSequenceNumber>
      <modeOfTransport>VESSEL</modeOfTransport>
      <vesselName>${formData.vesselName}</vesselName>
      <voyageNumber>${formData.voyageNumber}</voyageNumber>
      <placeOfReceipt>
        <locationName>${formData.placeOfReceipt}</locationName>
      </placeOfReceipt>
      <portOfLoading>
        <locationName>${formData.portOfLoading}</locationName>
      </portOfLoading>
      <portOfDischarge>
        <locationName>${formData.portOfDischarge}</locationName>
      </portOfDischarge>
      <placeOfDelivery>
        <locationName>${formData.placeOfDelivery}</locationName>
      </placeOfDelivery>
    </transportPlanStage>
  </transportPlan>
  
  <charges>
    ${formData.freightCharges ? `
    <charge>
      <chargeName>FREIGHT</chargeName>
      <chargeAmount>${formData.freightCharges}</chargeAmount>
      <chargeCurrency>USD</chargeCurrency>
      <paymentTerm>${formData.prepaid ? 'PREPAID' : formData.collect ? 'COLLECT' : 'PREPAID'}</paymentTerm>
    </charge>
    ` : ''}
    ${formData.otherCharges ? `
    <charge>
      <chargeName>OTHER</chargeName>
      <chargeAmount>${formData.otherCharges}</chargeAmount>
      <chargeCurrency>USD</chargeCurrency>
      <paymentTerm>${formData.prepaid ? 'PREPAID' : formData.collect ? 'COLLECT' : 'PREPAID'}</paymentTerm>
    </charge>
    ` : ''}
  </charges>
  
  <references>
    <reference>
      <referenceType>FF</referenceType>
      <referenceValue>${formData.exportReference}</referenceValue>
    </reference>
  </references>
  
</ShippingInstruction>`;

  return xml;
};

export const downloadBOLXML = (formData: FormData, containers: ContainerInfo[]) => {
  const xmlContent = generateBOLXML(formData, containers);
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `BOL_${formData.bolNumber || 'draft'}_${new Date().toISOString().split('T')[0]}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
