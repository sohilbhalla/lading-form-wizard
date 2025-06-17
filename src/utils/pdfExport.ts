
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export const generateBOLPDF = async (formData: FormData, containers: ContainerInfo[]) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  // Set fonts
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);

  // Header
  pdf.text('BILL OF LADING', pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;
  
  pdf.setFontSize(12);
  pdf.text('Ocean Bill of Lading - Non-Negotiable', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // BOL Number and Date
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`B/L Number: ${formData.bolNumber}`, 20, currentY);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 60, currentY);
  currentY += 15;

  // Shipper and Consignee side by side
  const leftCol = 20;
  const rightCol = pageWidth / 2 + 10;

  pdf.setFont('helvetica', 'bold');
  pdf.text('SHIPPER (Exporter)', leftCol, currentY);
  pdf.text('CONSIGNEE (Importer)', rightCol, currentY);
  currentY += 7;

  pdf.setFont('helvetica', 'normal');
  const shipperLines = [
    formData.shipperName,
    formData.shipperAddress,
    `${formData.shipperCity}, ${formData.shipperCountry}`
  ].filter(line => line.trim());

  const consigneeLines = [
    formData.consigneeName,
    formData.consigneeAddress,
    `${formData.consigneeCity}, ${formData.consigneeCountry}`
  ].filter(line => line.trim());

  const maxLines = Math.max(shipperLines.length, consigneeLines.length);
  for (let i = 0; i < maxLines; i++) {
    if (shipperLines[i]) pdf.text(shipperLines[i], leftCol, currentY);
    if (consigneeLines[i]) pdf.text(consigneeLines[i], rightCol, currentY);
    currentY += 5;
  }

  currentY += 10;

  // Notify Party
  if (formData.notifyPartyName) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('NOTIFY PARTY', leftCol, currentY);
    currentY += 7;
    
    pdf.setFont('helvetica', 'normal');
    const notifyLines = [
      formData.notifyPartyName,
      formData.notifyPartyAddress,
      `${formData.notifyPartyCity}, ${formData.notifyPartyCountry}`
    ].filter(line => line.trim());
    
    notifyLines.forEach(line => {
      pdf.text(line, leftCol, currentY);
      currentY += 5;
    });
    currentY += 10;
  }

  // Vessel and Port Information
  pdf.setFont('helvetica', 'bold');
  pdf.text('VESSEL & PORT INFORMATION', leftCol, currentY);
  currentY += 7;

  pdf.setFont('helvetica', 'normal');
  const vesselInfo = [
    `Vessel: ${formData.vesselName}`,
    `Voyage: ${formData.voyageNumber}`,
    `Port of Loading: ${formData.portOfLoading}`,
    `Port of Discharge: ${formData.portOfDischarge}`,
    `Place of Receipt: ${formData.placeOfReceipt}`,
    `Place of Delivery: ${formData.placeOfDelivery}`
  ].filter(line => !line.endsWith(': '));

  vesselInfo.forEach(line => {
    pdf.text(line, leftCol, currentY);
    currentY += 5;
  });

  currentY += 10;

  // Container and Cargo Details
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONTAINER & CARGO DETAILS', leftCol, currentY);
  currentY += 7;

  containers.forEach((container, index) => {
    // Check if we need a new page
    if (currentY > pageHeight - 60) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Container #${index + 1}`, leftCol, currentY);
    currentY += 5;

    pdf.setFont('helvetica', 'normal');
    if (container.containerNumber) {
      pdf.text(`Container Number: ${container.containerNumber}`, leftCol, currentY);
      currentY += 5;
    }
    if (container.containerType) {
      pdf.text(`Type: ${container.containerType}`, leftCol, currentY);
      currentY += 5;
    }
    if (container.sealNumber) {
      pdf.text(`Seal: ${container.sealNumber}`, leftCol, currentY);
      currentY += 5;
    }

    // Cargo items table header
    currentY += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', leftCol, currentY);
    pdf.text('Packages', leftCol + 60, currentY);
    pdf.text('Weight (kg)', leftCol + 90, currentY);
    pdf.text('CBM', leftCol + 120, currentY);
    currentY += 7;

    // Draw line under header
    pdf.line(leftCol, currentY - 2, pageWidth - 20, currentY - 2);

    pdf.setFont('helvetica', 'normal');
    container.cargoItems.forEach(item => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = 20;
      }

      const description = item.description.length > 25 ? 
        item.description.substring(0, 25) + '...' : item.description;
      
      pdf.text(description, leftCol, currentY);
      pdf.text(`${item.packages} ${item.packageType}`, leftCol + 60, currentY);
      pdf.text(item.weight, leftCol + 90, currentY);
      pdf.text(item.measurement, leftCol + 120, currentY);
      currentY += 5;
    });

    currentY += 10;
  });

  // Freight Information
  if (currentY > pageHeight - 40) {
    pdf.addPage();
    currentY = 20;
  }

  pdf.setFont('helvetica', 'bold');
  pdf.text('FREIGHT & CHARGES', leftCol, currentY);
  currentY += 7;

  pdf.setFont('helvetica', 'normal');
  if (formData.freightCharges) {
    pdf.text(`Freight Charges: ${formData.freightCharges}`, leftCol, currentY);
    currentY += 5;
  }
  if (formData.otherCharges) {
    pdf.text(`Other Charges: ${formData.otherCharges}`, leftCol, currentY);
    currentY += 5;
  }

  const paymentTerms = formData.prepaid ? 'Prepaid' : formData.collect ? 'Collect' : '';
  if (paymentTerms) {
    pdf.text(`Payment Terms: ${paymentTerms}`, leftCol, currentY);
    currentY += 5;
  }

  pdf.text(`Number of Original B/Ls: ${formData.numberOfOriginalBols}`, leftCol, currentY);
  currentY += 15;

  // Terms and Conditions
  pdf.setFont('helvetica', 'bold');
  pdf.text('TERMS AND CONDITIONS', leftCol, currentY);
  currentY += 7;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  const terms = pdf.splitTextToSize(formData.termsAndConditions, pageWidth - 40);
  terms.forEach((line: string) => {
    if (currentY > pageHeight - 20) {
      pdf.addPage();
      currentY = 20;
    }
    pdf.text(line, leftCol, currentY);
    currentY += 4;
  });

  // Footer
  currentY = pageHeight - 20;
  pdf.setFontSize(8);
  pdf.text('This Bill of Lading is subject to the Hague-Visby Rules', pageWidth / 2, currentY, { align: 'center' });

  // Save the PDF
  const fileName = `BOL_${formData.bolNumber || 'draft'}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
