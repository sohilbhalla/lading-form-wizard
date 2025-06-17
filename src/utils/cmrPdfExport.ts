
import jsPDF from 'jspdf';

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

export const generateCMRPDF = async (formData: CMRFormData, cargoItems: CargoItem[]) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = 10;

    console.log('Starting CMR PDF generation');

    // Helper function to draw border
    const drawBorder = (x: number, y: number, width: number, height: number) => {
      if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        console.error('Invalid rectangle parameters:', { x, y, width, height });
        return;
      }
      try {
        pdf.rect(x, y, width, height);
      } catch (error) {
        console.error('Error drawing rectangle:', error);
      }
    };

    // Helper function to add text with border
    const addTextWithBorder = (text: string, x: number, y: number, width: number, height: number) => {
      drawBorder(x, y, width, height);
      if (text && !isNaN(x) && !isNaN(y)) {
        try {
          pdf.text(text, x + 2, y + height/2 + 1);
        } catch (error) {
          console.error('Error adding text:', error);
        }
      }
    };

    // Main Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('CMR - CONVENTION RELATIVE AU CONTRAT DE TRANSPORT', pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;
    pdf.text('INTERNATIONAL DE MARCHANDISES PAR ROUTE', pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    // Section 1: Sender
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('1. Expéditeur (nom, adresse, pays)', 10, currentY);
    currentY += 5;
    
    const senderBoxHeight = 20;
    const halfWidth = (pageWidth - 20) / 2;
    
    if (halfWidth > 0 && senderBoxHeight > 0) {
      drawBorder(10, currentY, halfWidth, senderBoxHeight);
    }
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    let textY = currentY + 4;
    pdf.text(formData.senderName || '', 12, textY);
    textY += 4;
    pdf.text(formData.senderAddress || '', 12, textY);
    textY += 4;
    pdf.text(formData.senderCountry || '', 12, textY);

    // Section 2: Consignee (right side)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('2. Destinataire (nom, adresse, pays)', 10 + halfWidth, currentY - 5);
    
    if (halfWidth > 0 && senderBoxHeight > 0) {
      drawBorder(10 + halfWidth, currentY, halfWidth, senderBoxHeight);
    }
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    textY = currentY + 4;
    pdf.text(formData.consigneeName || '', 12 + halfWidth, textY);
    textY += 4;
    pdf.text(formData.consigneeAddress || '', 12 + halfWidth, textY);
    textY += 4;
    pdf.text(formData.consigneeCountry || '', 12 + halfWidth, textY);

    currentY += senderBoxHeight + 5;

    // Section 3: Place and date of taking over goods
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('3. Lieu et date de prise en charge de la marchandise', 10, currentY);
    currentY += 5;
    
    const takeoverHeight = 15;
    if (halfWidth > 0 && takeoverHeight > 0) {
      drawBorder(10, currentY, halfWidth, takeoverHeight);
    }
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Lieu: ${formData.placeOfTakeover || ''}`, 12, currentY + 5);
    pdf.text(`Date: ${formData.dateOfTakeover || ''}`, 12, currentY + 10);

    // Section 4: Place designated for delivery (right side)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('4. Lieu prévu pour la livraison', 10 + halfWidth, currentY - 5);
    
    if (halfWidth > 0 && takeoverHeight > 0) {
      drawBorder(10 + halfWidth, currentY, halfWidth, takeoverHeight);
    }
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(formData.placeOfDelivery || '', 12 + halfWidth, currentY + 8);

    currentY += takeoverHeight + 5;

    // Section 5: Carrier
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('5. Transporteur (nom, adresse, pays)', 10, currentY);
    currentY += 5;
    
    const carrierHeight = 20;
    const fullWidth = pageWidth - 20;
    if (fullWidth > 0 && carrierHeight > 0) {
      drawBorder(10, currentY, fullWidth, carrierHeight);
    }
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    textY = currentY + 4;
    pdf.text(`Nom: ${formData.carrierName || ''}`, 12, textY);
    textY += 4;
    pdf.text(`Adresse: ${formData.carrierAddress || ''}`, 12, textY);
    textY += 4;
    pdf.text(`Pays: ${formData.carrierCountry || ''}`, 12, textY);

    currentY += carrierHeight + 5;

    // Section 8: Vehicle registration
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('8. Immatriculation du véhicule', 10, currentY);
    currentY += 5;
    
    const vehicleHeight = 15;
    if (fullWidth > 0 && vehicleHeight > 0) {
      drawBorder(10, currentY, fullWidth, vehicleHeight);
    }
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Véhicule: ${formData.vehicleRegistration || ''}`, 12, currentY + 5);
    pdf.text(`Remorque: ${formData.trailerRegistration || ''}`, 12, currentY + 10);

    currentY += vehicleHeight + 5;

    // Section 9-12: Goods table header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('9-12. Marchandises', 10, currentY);
    currentY += 5;

    // Table headers
    const tableHeaders = ['Nombre et nature des colis', 'Marques et numéros', 'Poids brut (kg)', 'Volume (m³)', 'Désignation de la marchandise'];
    const colWidths = [35, 35, 25, 25, 70];
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    
    let headerX = 10;
    tableHeaders.forEach((header, index) => {
      if (colWidths[index] > 0) {
        drawBorder(headerX, currentY, colWidths[index], 8);
        pdf.text(header, headerX + 1, currentY + 5);
      }
      headerX += colWidths[index];
    });

    currentY += 8;

    // Cargo items
    pdf.setFont('helvetica', 'normal');
    cargoItems.forEach(item => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = 20;
      }

      const rowHeight = 12;
      let rowX = 10;
      
      const rowData = [
        item.quantity || '',
        item.marks || '',
        item.weight || '',
        item.volume || '',
        item.description || ''
      ];

      rowData.forEach((data, index) => {
        if (colWidths[index] > 0 && rowHeight > 0) {
          drawBorder(rowX, currentY, colWidths[index], rowHeight);
          const lines = pdf.splitTextToSize(data, colWidths[index] - 2);
          pdf.text(lines, rowX + 1, currentY + 4);
        }
        rowX += colWidths[index];
      });

      currentY += rowHeight;
    });

    currentY += 10;

    // Section 13: Cash on delivery
    if (formData.codAmount) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('13. Remboursement', 10, currentY);
      currentY += 5;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Montant: ${formData.codAmount} ${formData.codCurrency}`, 12, currentY);
      currentY += 10;
    }

    // Section 16: To be paid by
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('16. A payer par', 10, currentY);
    currentY += 5;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Expéditeur: ${formData.paidBySender ? '☑' : '☐'}`, 12, currentY);
    pdf.text(`Destinataire: ${formData.paidByConsignee ? '☑' : '☐'}`, 80, currentY);
    currentY += 10;

    // Special agreements
    if (formData.specialAgreements) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('Conventions particulières', 10, currentY);
      currentY += 5;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const agreements = pdf.splitTextToSize(formData.specialAgreements, fullWidth - 4);
      pdf.text(agreements, 12, currentY);
      currentY += agreements.length * 4 + 5;
    }

    // Check if we need a new page for signatures
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = 20;
    }

    // Signatures section
    const signatureY = Math.max(currentY, pageHeight - 35);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    
    // Place and date
    pdf.text(`Établi à: ${formData.placeOfSigning || ''}`, 10, signatureY);
    pdf.text(`Le: ${formData.dateOfSigning || ''}`, pageWidth - 60, signatureY);
    
    // Signature lines
    const signatureBoxHeight = 20;
    const signatureWidth = (pageWidth - 30) / 3;
    
    // Sender signature
    pdf.text('Signature de l\'expéditeur', 10, signatureY + 8);
    if (signatureWidth > 0 && signatureBoxHeight > 0) {
      drawBorder(10, signatureY + 10, signatureWidth, signatureBoxHeight);
    }
    
    // Carrier signature
    pdf.text('Signature du transporteur', 10 + signatureWidth + 5, signatureY + 8);
    if (signatureWidth > 0 && signatureBoxHeight > 0) {
      drawBorder(10 + signatureWidth + 5, signatureY + 10, signatureWidth, signatureBoxHeight);
    }
    
    // Consignee signature
    pdf.text('Signature du destinataire', 10 + 2 * (signatureWidth + 5), signatureY + 8);
    if (signatureWidth > 0 && signatureBoxHeight > 0) {
      drawBorder(10 + 2 * (signatureWidth + 5), signatureY + 10, signatureWidth, signatureBoxHeight);
    }

    // Footer
    pdf.setFontSize(7);
    pdf.text('Cette lettre de voiture est soumise à la Convention relative au contrat de transport international de marchandises par route (CMR).', 10, pageHeight - 5);

    // Save the PDF
    const fileName = `CMR_${formData.carrierName || 'document'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    console.log('CMR PDF generation completed successfully');
  } catch (error) {
    console.error('Error in CMR PDF generation:', error);
    throw error;
  }
};
