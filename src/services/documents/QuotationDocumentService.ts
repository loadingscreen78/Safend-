import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// Dynamic import for pdfmake to avoid build issues
let pdfMake: any = null;

const initPdfMake = async () => {
  if (!pdfMake) {
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFonts = await import('pdfmake/build/vfs_fonts');
    pdfMake = pdfMakeModule.default;
    pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
  }
  return pdfMake;
};

interface QuotationData {
  id: string;
  client: string;
  service: string;
  amount: string;
  date: string;
  validUntil: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export class QuotationDocumentService {
  
  // Generate Word Document
  static async generateWordDocument(quotation: QuotationData): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header - Company Name
          new Paragraph({
            text: "Safend Security & Facility Management Pvt. Ltd.",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          
          // Company Details
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Address: Mumbai, Maharashtra, India", size: 20 }),
              new TextRun({ text: " | ", size: 20 }),
              new TextRun({ text: "Phone: +91 98765 43210", size: 20 }),
              new TextRun({ text: " | ", size: 20 }),
              new TextRun({ text: "Email: info@safend.in", size: 20 }),
            ],
            spacing: { after: 400 }
          }),
          
          // Document Title
          new Paragraph({
            text: "QUOTATION",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),
          
          // Quotation Details
          new Paragraph({
            children: [
              new TextRun({ text: "Quotation No: ", bold: true }),
              new TextRun({ text: quotation.id })
            ],
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Date: ", bold: true }),
              new TextRun({ text: quotation.date })
            ],
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Valid Until: ", bold: true }),
              new TextRun({ text: quotation.validUntil })
            ],
            spacing: { after: 300 }
          }),
          
          // Client Details Section
          new Paragraph({
            text: "Client Details:",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Name: ", bold: true }),
              new TextRun({ text: quotation.client })
            ],
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Contact Person: ", bold: true }),
              new TextRun({ text: quotation.contactPerson || "N/A" })
            ],
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Phone: ", bold: true }),
              new TextRun({ text: quotation.contactPhone || "N/A" })
            ],
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Email: ", bold: true }),
              new TextRun({ text: quotation.contactEmail || "N/A" })
            ],
            spacing: { after: 300 }
          }),
          
          // Service Proposal
          new Paragraph({
            text: "Service Proposal:",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: quotation.service,
            spacing: { after: 300 }
          }),
          
          // Pricing Section
          new Paragraph({
            text: "Pricing:",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Total Amount: ", bold: true }),
              new TextRun({ text: quotation.amount, bold: true, size: 28 })
            ],
            spacing: { after: 300 }
          }),
          
          // Terms
          new Paragraph({
            text: "Terms & Conditions:",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: "• All personnel provided will be trained and identity verified.",
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: "• Service rates may vary as per additional manpower or shift adjustments.",
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: "• Payment due monthly unless otherwise stated.",
            spacing: { after: 300 }
          }),
          
          // Footer
          new Paragraph({
            text: "We appreciate your business.",
            spacing: { before: 400, after: 200 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Authorized Signatory,", break: 1 }),
              new TextRun({ text: "Safend Security & Facility Management Pvt. Ltd.", bold: true })
            ]
          })
        ]
      }]
    });
    
    // Generate and download
    const blob = await this.generateBlob(doc);
    saveAs(blob, `Quotation_${quotation.id}.docx`);
  }
  
  // Generate PDF Document
  static async generatePDFDocument(quotation: QuotationData): Promise<void> {
    const pdf = await initPdfMake();
    const docDefinition: any = {
      content: [
        // Header
        {
          text: 'Safend Security & Facility Management Pvt. Ltd.',
          style: 'header',
          alignment: 'center'
        },
        {
          text: 'Address: Mumbai, Maharashtra, India | Phone: +91 98765 43210 | Email: info@safend.in',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 5, 0, 20]
        },
        
        // Title
        {
          text: 'QUOTATION',
          style: 'title',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        
        // Quotation Details
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: [{ text: 'Quotation No: ', bold: true }, quotation.id], margin: [0, 0, 0, 5] },
                { text: [{ text: 'Date: ', bold: true }, quotation.date], margin: [0, 0, 0, 5] },
                { text: [{ text: 'Valid Until: ', bold: true }, quotation.validUntil], margin: [0, 0, 0, 5] }
              ]
            },
            { width: '50%', text: '' }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Client Details
        {
          text: 'Client Details:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          stack: [
            { text: [{ text: 'Name: ', bold: true }, quotation.client], margin: [0, 0, 0, 5] },
            { text: [{ text: 'Contact Person: ', bold: true }, quotation.contactPerson || 'N/A'], margin: [0, 0, 0, 5] },
            { text: [{ text: 'Phone: ', bold: true }, quotation.contactPhone || 'N/A'], margin: [0, 0, 0, 5] },
            { text: [{ text: 'Email: ', bold: true }, quotation.contactEmail || 'N/A'], margin: [0, 0, 0, 5] }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Service Proposal
        {
          text: 'Service Proposal:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          text: quotation.service,
          margin: [0, 0, 0, 20]
        },
        
        // Pricing
        {
          text: 'Pricing:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          text: [
            { text: 'Total Amount: ', bold: true },
            { text: quotation.amount, bold: true, fontSize: 16, color: '#ef4444' }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Terms
        {
          text: 'Terms & Conditions:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          ul: [
            'All personnel provided will be trained and identity verified.',
            'Service rates may vary as per additional manpower or shift adjustments.',
            'Payment due monthly unless otherwise stated.'
          ],
          margin: [0, 0, 0, 30]
        },
        
        // Footer
        {
          text: 'We appreciate your business.',
          margin: [0, 20, 0, 10]
        },
        {
          text: [
            'Authorized Signatory,\n',
            { text: 'Safend Security & Facility Management Pvt. Ltd.', bold: true }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#ef4444'
        },
        subheader: {
          fontSize: 10,
          color: '#666666'
        },
        title: {
          fontSize: 16,
          bold: true,
          decoration: 'underline'
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#333333'
        }
      },
      defaultStyle: {
        fontSize: 11
      }
    };
    
    pdf.createPdf(docDefinition).download(`Quotation_${quotation.id}.pdf`);
  }
  
  // Preview PDF in new tab
  static async previewPDF(quotation: QuotationData): Promise<void> {
    const pdf = await initPdfMake();
    const docDefinition: any = {
      content: [
        {
          text: 'Safend Security & Facility Management Pvt. Ltd.',
          style: 'header',
          alignment: 'center'
        },
        {
          text: 'QUOTATION',
          style: 'title',
          alignment: 'center',
          margin: [0, 20, 0, 20]
        },
        {
          text: [{ text: 'Quotation No: ', bold: true }, quotation.id],
          margin: [0, 0, 0, 10]
        },
        {
          text: [{ text: 'Client: ', bold: true }, quotation.client],
          margin: [0, 0, 0, 10]
        },
        {
          text: [{ text: 'Amount: ', bold: true }, quotation.amount],
          margin: [0, 0, 0, 10]
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        title: { fontSize: 16, bold: true }
      }
    };
    
    pdf.createPdf(docDefinition).open();
  }
  
  private static async generateBlob(doc: Document): Promise<Blob> {
    const { Packer } = await import('docx');
    return await Packer.toBlob(doc);
  }
}
