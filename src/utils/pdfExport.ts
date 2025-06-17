
import jsPDF from 'jspdf';

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
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = 10;

    console.log('Starting PDF generation with pageWidth:', pageWidth, 'pageHeight:', pageHeight);

    // Helper function to safely draw borders with validation
    const drawBorder = (x: number, y: number, width: number, height: number) => {
      // Validate all parameters
      if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        console.error('Invalid rectangle parameters:', { x, y, width, height });
        return;
      }
      if (width <= 0 || height <= 0) {
        console.error('Invalid rectangle dimensions:', { width, height });
        return;
      }
      try {
        pdf.rect(x, y, width, height);
      } catch (error) {
        console.error('Error drawing rectangle:', error, { x, y, width, height });
      }
    };

    // Helper function to add text with border
    const addTextWithBorder = (text: string, x: number, y: number, width: number, height: number, align: 'left' | 'center' | 'right' = 'left') => {
      drawBorder(x, y, width, height);
      if (!isNaN(x) && !isNaN(y) && text) {
        try {
          pdf.text(text, x + 2, y + height/2 + 1, { align });
        } catch (error) {
          console.error('Error adding text:', error);
        }
      }
    };

    // Date and Page header
    pdf.setFontSize(10);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 10, currentY + 5);
    pdf.text(`Page 1 of 1`, pageWidth - 30, currentY + 5);
    currentY += 10;

    // Main Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('BILL OF LADING', pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    // Ship From Section
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(0, 0, 0);
    const headerWidth = pageWidth - 20;
    if (headerWidth > 0) {
      pdf.rect(10, currentY, headerWidth, 6, 'F');
    }
    pdf.setTextColor(255, 255, 255);
    pdf.text('SHIP FROM', 12, currentY + 4);
    pdf.setTextColor(0, 0, 0);
    currentY += 6;

    // Shipper Information Box
    const shipperBoxHeight = 25;
    const halfWidth = (pageWidth - 20) / 2;
    if (halfWidth > 0 && shipperBoxHeight > 0) {
      drawBorder(10, currentY, halfWidth, shipperBoxHeight);
    }
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    let shipperY = currentY + 3;
    pdf.text(`Name: ${formData.shipperName || ''}`, 12, shipperY);
    shipperY += 4;
    pdf.text(`Address: ${formData.shipperAddress || ''}`, 12, shipperY);
    shipperY += 4;
    pdf.text(`City/State/Zip: ${formData.shipperCity || ''}, ${formData.shipperCountry || ''}`, 12, shipperY);

    // Bill of Lading Number Box (right side)
    const bolBoxX = 10 + halfWidth;
    if (halfWidth > 0 && shipperBoxHeight > 0) {
      drawBorder(bolBoxX, currentY, halfWidth, shipperBoxHeight);
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill of Lading Number:', bolBoxX + 2, currentY + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.bolNumber || '', bolBoxX + 2, currentY + 10);
    
    // Add barcode space placeholder
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('BAR CODE SPACE', bolBoxX + halfWidth/2, currentY + 18, { align: 'center' });
    pdf.setTextColor(0, 0, 0);

    currentY += shipperBoxHeight + 2;

    // Ship To Section
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(0, 0, 0);
    if (headerWidth > 0) {
      pdf.rect(10, currentY, headerWidth, 6, 'F');
    }
    pdf.setTextColor(255, 255, 255);
    pdf.text('SHIP TO', 12, currentY + 4);
    pdf.setTextColor(0, 0, 0);
    currentY += 6;

    // Consignee Information Box
    const consigneeBoxHeight = 25;
    if (halfWidth > 0 && consigneeBoxHeight > 0) {
      drawBorder(10, currentY, halfWidth, consigneeBoxHeight);
    }
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    let consigneeY = currentY + 3;
    pdf.text(`Name: ${formData.consigneeName || ''}`, 12, consigneeY);
    consigneeY += 4;
    pdf.text(`Address: ${formData.consigneeAddress || ''}`, 12, consigneeY);
    consigneeY += 4;
    pdf.text(`City/State/Zip: ${formData.consigneeCity || ''}, ${formData.consigneeCountry || ''}`, 12, consigneeY);

    // Carrier Information Box (right side)
    if (halfWidth > 0 && consigneeBoxHeight > 0) {
      drawBorder(bolBoxX, currentY, halfWidth, consigneeBoxHeight);
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('CARRIER NAME:', bolBoxX + 2, currentY + 4);
    pdf.text('Trailer number:', bolBoxX + 2, currentY + 8);
    pdf.text('Seal number(s):', bolBoxX + 2, currentY + 12);
    pdf.text('SCAC:', bolBoxX + 2, currentY + 16);
    pdf.text('Pro number:', bolBoxX + 2, currentY + 20);

    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.forwardingAgent || '', bolBoxX + 25, currentY + 4);
    // Add container/seal info
    if (containers.length > 0) {
      pdf.text(containers[0].containerNumber || '', bolBoxX + 25, currentY + 8);
      pdf.text(containers[0].sealNumber || '', bolBoxX + 25, currentY + 12);
    }

    currentY += consigneeBoxHeight + 2;

    // Third Party Freight Charges Section
    if (formData.notifyPartyName) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(0, 0, 0);
      if (headerWidth > 0) {
        pdf.rect(10, currentY, headerWidth, 6, 'F');
      }
      pdf.setTextColor(255, 255, 255);
      pdf.text('THIRD PARTY FREIGHT CHARGES BILL TO:', 12, currentY + 4);
      pdf.setTextColor(0, 0, 0);
      currentY += 6;

      const notifyBoxHeight = 20;
      if (halfWidth > 0 && notifyBoxHeight > 0) {
        drawBorder(10, currentY, halfWidth, notifyBoxHeight);
      }
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      let notifyY = currentY + 3;
      pdf.text(`Name: ${formData.notifyPartyName}`, 12, notifyY);
      notifyY += 4;
      pdf.text(`Address: ${formData.notifyPartyAddress || ''}`, 12, notifyY);
      notifyY += 4;
      pdf.text(`City/State/Zip: ${formData.notifyPartyCity || ''}, ${formData.notifyPartyCountry || ''}`, 12, notifyY);

      // Freight Terms Box (right side)
      if (halfWidth > 0 && notifyBoxHeight > 0) {
        drawBorder(bolBoxX, currentY, halfWidth, notifyBoxHeight);
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.text('Freight Charge Terms:', bolBoxX + 2, currentY + 4);
      pdf.setFontSize(7);
      pdf.text('(freight charges are prepaid unless marked otherwise)', bolBoxX + 2, currentY + 7);
      
      pdf.setFontSize(8);
      const prepaidX = bolBoxX + 2;
      const collectX = bolBoxX + 40;
      const partyX = bolBoxX + 75;
      
      pdf.text('Prepaid', prepaidX, currentY + 12);
      pdf.text('Collect', collectX, currentY + 12);
      pdf.text('3rd Party', partyX, currentY + 12);
      
      // Checkboxes - using safe dimensions
      const checkboxSize = 3;
      if (checkboxSize > 0) {
        drawBorder(prepaidX + 15, currentY + 9, checkboxSize, checkboxSize);
        drawBorder(collectX + 15, currentY + 9, checkboxSize, checkboxSize);
        drawBorder(partyX + 18, currentY + 9, checkboxSize, checkboxSize);
      }
      
      // Mark appropriate checkbox
      if (formData.prepaid) {
        pdf.text('X', prepaidX + 16, currentY + 11.5);
      } else if (formData.collect) {
        pdf.text('X', collectX + 16, currentY + 11.5);
      }

      currentY += notifyBoxHeight + 2;
    }

    // Special Instructions Section
    const specialInstHeight = 15;
    if (halfWidth > 0 && specialInstHeight > 0) {
      drawBorder(10, currentY, halfWidth, specialInstHeight);
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('SPECIAL INSTRUCTIONS:', 12, currentY + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    const instructions = `Vessel: ${formData.vesselName || ''}\nVoyage: ${formData.voyageNumber || ''}\nPort of Loading: ${formData.portOfLoading || ''}\nPort of Discharge: ${formData.portOfDischarge || ''}`;
    const instructionLines = pdf.splitTextToSize(instructions, halfWidth - 4);
    pdf.text(instructionLines, 12, currentY + 8);

    currentY += specialInstHeight + 5;

    // Cargo Information Table Header
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(0, 0, 0);
    if (headerWidth > 0) {
      pdf.rect(10, currentY, headerWidth, 6, 'F');
    }
    pdf.setTextColor(255, 255, 255);
    pdf.text('CARRIER INFORMATION', 12, currentY + 4);
    pdf.setTextColor(0, 0, 0);
    currentY += 6;

    // Table Headers with safe column widths
    const tableY = currentY;
    const totalTableWidth = pageWidth - 20;
    const colWidths = [25, 25, 30, 30, 25, 25, 30];
    const safeColWidths = colWidths.map(width => Math.max(width, 10)); // Ensure minimum width
    const headers = ['HANDLING UNIT', 'PACKAGE', '', 'COMMODITY DESCRIPTION', '', 'LTL ONLY', ''];
    const subHeaders = ['QTY', 'TYPE', 'QTY', 'TYPE', 'WEIGHT', 'H.M.(X)', 'NMFC #', 'CLASS'];

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    
    let headerX = 10;
    headers.forEach((header, index) => {
      if (header && safeColWidths[index] > 0) {
        drawBorder(headerX, tableY, safeColWidths[index], 8);
        pdf.text(header, headerX + 1, tableY + 5);
      }
      headerX += safeColWidths[index];
    });

    currentY += 8;
    headerX = 10;
    subHeaders.forEach((subHeader, index) => {
      if (safeColWidths[index] > 0) {
        drawBorder(headerX, currentY, safeColWidths[index], 6);
        pdf.text(subHeader, headerX + 1, currentY + 4);
      }
      headerX += safeColWidths[index];
    });

    currentY += 6;

    // Cargo Data Rows
    pdf.setFont('helvetica', 'normal');
    containers.forEach(container => {
      container.cargoItems.forEach(item => {
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = 20;
        }

        let rowX = 10;
        const rowHeight = 8;
        
        // QTY, Package Type, QTY, Package Type, Weight, H.M., NMFC#, Class
        const rowData = [
          item.packages || '',
          item.packageType || '',
          item.packages || '',
          item.packageType || '',
          `${item.weight || '0'} kg`,
          '',
          '',
          ''
        ];

        rowData.forEach((data, index) => {
          if (safeColWidths[index] > 0 && rowHeight > 0) {
            drawBorder(rowX, currentY, safeColWidths[index], rowHeight);
            pdf.text(data, rowX + 1, currentY + 5);
          }
          rowX += safeColWidths[index];
        });

        currentY += rowHeight;

        // Description row
        const descRowHeight = 12;
        if (headerWidth > 0 && descRowHeight > 0) {
          drawBorder(10, currentY, headerWidth, descRowHeight);
        }
        
        pdf.setFontSize(8);
        const description = pdf.splitTextToSize(item.description || '', headerWidth - 4);
        pdf.text(description, 12, currentY + 4);
        
        currentY += descRowHeight;
      });
    });

    // Grand Total Section
    const grandTotalHeight = 8;
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(200, 200, 200);
    if (headerWidth > 0 && grandTotalHeight > 0) {
      pdf.rect(10, currentY, headerWidth, grandTotalHeight, 'F');
    }
    pdf.text('GRAND TOTAL', 12, currentY + 5);

    // Calculate totals safely
    const totalPackages = containers.reduce((total, container) => 
      total + container.cargoItems.reduce((sum, item) => sum + parseInt(item.packages || '0'), 0), 0
    );
    const totalWeight = containers.reduce((total, container) => 
      total + container.cargoItems.reduce((sum, item) => sum + parseFloat(item.weight || '0'), 0), 0
    );

    pdf.text(`${totalPackages} packages`, pageWidth - 80, currentY + 5);
    pdf.text(`${totalWeight} kg`, pageWidth - 40, currentY + 5);

    currentY += grandTotalHeight + 10;

    // COD and Fee Terms
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    
    const codSection = `COD Amount: $ ${formData.otherCharges || '0.00'}`;
    pdf.text(codSection, pageWidth - 80, currentY);
    
    const feeTerms = `Fee Terms:   Collect: ${formData.collect ? '☑' : '☐'}   Prepaid: ${formData.prepaid ? '☑' : '☐'}`;
    pdf.text(feeTerms, pageWidth - 80, currentY + 5);

    currentY += 15;

    // Legal Notice
    pdf.setFontSize(7);
    const legalNotice = 'NOTE: Liability Limitation for loss or damage in this shipment may be applicable. See 49 U.S.C. • 14706(c)(1)(A) and (B).';
    pdf.text(legalNotice, 10, currentY);

    currentY += 10;

    // Signature Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    
    const signatureY = pageHeight - 25;
    
    // Left signature section
    pdf.text('SHIPPER SIGNATURE / DATE', 10, signatureY);
    pdf.line(10, signatureY + 5, 80, signatureY + 5);
    
    // Right signature section
    pdf.text('CARRIER SIGNATURE / PICKUP DATE', pageWidth - 100, signatureY);
    pdf.line(pageWidth - 100, signatureY + 5, pageWidth - 10, signatureY + 5);

    // Trailer loaded checkboxes
    pdf.setFontSize(7);
    pdf.text('Trailer Loaded:', 10, signatureY + 10);
    pdf.text('☐ By Shipper', 10, signatureY + 13);
    pdf.text('☐ By Driver', 10, signatureY + 16);

    pdf.text('Freight Counted:', 50, signatureY + 10);
    pdf.text('☐ By Shipper', 50, signatureY + 13);
    pdf.text('☐ By Driver/pallets said to contain', 50, signatureY + 16);
    pdf.text('☐ By Driver/Pieces', 50, signatureY + 19);

    // Footer text
    pdf.setFontSize(6);
    pdf.text('This Bill of Lading is subject to the terms and conditions on the reverse side hereof and to applicable federal regulations.', 10, pageHeight - 5);

    // Save the PDF
    const fileName = `BOL_${formData.bolNumber || 'draft'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    console.log('PDF generation completed successfully');
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  }
};
