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

interface AgreementData {
  id: string;
  clientName: string;
  serviceDetails: string;
  value: string;
  status: string;
  createdAt?: any;
  linkedQuoteId?: string;
}

export class AgreementDocumentService {
  
  // Generate Word Document
  static async generateWordDocument(agreement: AgreementData): Promise<void> {
    const startDate = agreement.createdAt ? new Date(agreement.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 1 year from now
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: "SERVICE AGREEMENT",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          
          // Parties
          new Paragraph({
            text: "Between",
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Safend Security & Facility Management Pvt. Ltd.", bold: true }),
              new TextRun({ text: ' ("Service Provider")' })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: "and",
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: agreement.clientName, bold: true }),
              new TextRun({ text: ' ("Client")' })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          
          // Agreement Details
          new Paragraph({
            children: [
              new TextRun({ text: "Agreement Reference: ", bold: true }),
              new TextRun({ text: agreement.id })
            ],
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Effective Date: ", bold: true }),
              new TextRun({ text: startDate })
            ],
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Validity: ", bold: true }),
              new TextRun({ text: `Until ${endDate}` })
            ],
            spacing: { after: 300 }
          }),
          
          // Scope of Services
          new Paragraph({
            text: "Scope of Services:",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: agreement.serviceDetails,
            spacing: { after: 300 }
          }),
          
          // Service Charges
          new Paragraph({
            text: "Service Charges:",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Monthly Value: ", bold: true }),
              new TextRun({ text: agreement.value, bold: true, size: 28 })
            ],
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Billing Cycle: ", bold: true }),
              new TextRun({ text: "Monthly / Quarterly" })
            ],
            spacing: { after: 300 }
          }),
          
          // Responsibilities
          new Paragraph({
            text: "Responsibilities:",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: "• Safend will deploy trained personnel and supervise operations.",
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: "• Client will provide necessary facility access and emergency coordination.",
            spacing: { after: 300 }
          }),
          
          // Termination
          new Paragraph({
            text: "Termination:",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: "Either party may terminate with 30 days notice.",
            spacing: { after: 400 }
          }),
          
          // Signatures
          new Paragraph({
            text: "Authorized Signatures:",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
          }),
          
          new Paragraph({
            text: "Safend Representative: ___________________",
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: "Client Representative: ___________________",
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: `Date: ${startDate}`
          })
        ]
      }]
    });
    
    const blob = await this.generateBlob(doc);
    saveAs(blob, `Agreement_${agreement.id}.docx`);
  }
  
  // Generate PDF Document
  static async generatePDFDocument(agreement: AgreementData): Promise<void> {
    const pdf = await initPdfMake();
    const startDate = agreement.createdAt ? new Date(agreement.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString();
    
    const docDefinition: any = {
      content: [
        {
          text: 'SERVICE AGREEMENT',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },
        
        {
          text: 'Between',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        
        {
          text: [
            { text: 'Safend Security & Facility Management Pvt. Ltd.', bold: true },
            ' ("Service Provider")'
          ],
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        
        {
          text: 'and',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        
        {
          text: [
            { text: agreement.clientName, bold: true },
            ' ("Client")'
          ],
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },
        
        {
          text: [{ text: 'Agreement Reference: ', bold: true }, agreement.id],
          margin: [0, 0, 0, 5]
        },
        
        {
          text: [{ text: 'Effective Date: ', bold: true }, startDate],
          margin: [0, 0, 0, 5]
        },
        
        {
          text: [{ text: 'Validity: ', bold: true }, `Until ${endDate}`],
          margin: [0, 0, 0, 20]
        },
        
        {
          text: 'Scope of Services:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        
        {
          text: agreement.serviceDetails,
          margin: [0, 0, 0, 20]
        },
        
        {
          text: 'Service Charges:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        
        {
          text: [
            { text: 'Monthly Value: ', bold: true },
            { text: agreement.value, bold: true, fontSize: 16, color: '#ef4444' }
          ],
          margin: [0, 0, 0, 5]
        },
        
        {
          text: [{ text: 'Billing Cycle: ', bold: true }, 'Monthly / Quarterly'],
          margin: [0, 0, 0, 20]
        },
        
        {
          text: 'Responsibilities:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        
        {
          ul: [
            'Safend will deploy trained personnel and supervise operations.',
            'Client will provide necessary facility access and emergency coordination.'
          ],
          margin: [0, 0, 0, 20]
        },
        
        {
          text: 'Termination:',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        
        {
          text: 'Either party may terminate with 30 days notice.',
          margin: [0, 0, 0, 30]
        },
        
        {
          text: 'Authorized Signatures:',
          style: 'sectionHeader',
          margin: [0, 20, 0, 20]
        },
        
        {
          text: 'Safend Representative: ___________________',
          margin: [0, 0, 0, 15]
        },
        
        {
          text: 'Client Representative: ___________________',
          margin: [0, 0, 0, 15]
        },
        
        {
          text: `Date: ${startDate}`
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#ef4444'
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
    
    pdf.createPdf(docDefinition).download(`Agreement_${agreement.id}.pdf`);
  }
  
  // Preview PDF
  static async previewPDF(agreement: AgreementData): Promise<void> {
    const pdf = await initPdfMake();
    const startDate = agreement.createdAt ? new Date(agreement.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    
    const docDefinition: any = {
      content: [
        {
          text: 'SERVICE AGREEMENT',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: [{ text: 'Agreement Reference: ', bold: true }, agreement.id],
          margin: [0, 0, 0, 10]
        },
        {
          text: [{ text: 'Client: ', bold: true }, agreement.clientName],
          margin: [0, 0, 0, 10]
        },
        {
          text: [{ text: 'Value: ', bold: true }, agreement.value],
          margin: [0, 0, 0, 10]
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true }
      }
    };
    
    pdf.createPdf(docDefinition).open();
  }
  
  private static async generateBlob(doc: Document): Promise<Blob> {
    const { Packer } = await import('docx');
    return await Packer.toBlob(doc);
  }
}
