
import { EVENT_TYPES, emitEvent } from "@/services/EventService";
import { Vehicle, TripLog } from "@/types/fleet";
import { MaintenanceTicket } from "@/types/maintenance";
import { Document } from "@/types/documents";
import { ReportTemplate, ReportResult } from "@/types/reports";

// Mock PDF generation service
// In a real-world app, this would use something like jsPDF, PDFMake, or client-pdf

type PDFDocumentType = 
  | 'vehicle-report' 
  | 'maintenance-report' 
  | 'facility-booking-agreement' 
  | 'trip-report' 
  | 'visitor-pass'
  | 'purchase-order'
  | 'document-signature'
  | 'report-export';

interface PDFGenerationOptions {
  title: string;
  author: string;
  includeFooter?: boolean;
  includeLogo?: boolean;
  includeTimestamp?: boolean;
  password?: string;
  watermark?: string;
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'a4' | 'letter' | 'legal';
}

// Mock function to generate a PDF
export const generatePDF = (
  type: PDFDocumentType,
  data: any,
  options: PDFGenerationOptions
): string => {
  // In a real app, this would actually generate a PDF
  // For now, we'll just return a mocked file URL
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${type}-${timestamp}.pdf`;
  
  console.log(`Generating PDF ${fileName} with data:`, data);
  
  // Emit an event for tracking
  emitEvent(EVENT_TYPES.PDF_GENERATED, {
    type,
    title: options.title,
    fileName,
    timestamp: new Date().toISOString(),
    generatedBy: options.author
  });
  
  // Return a mock URL
  return `/generated-pdfs/${fileName}`;
};

// Specific PDF generation functions
export const generateVehicleReport = (
  vehicle: Vehicle, 
  includeServiceHistory: boolean = true,
  includeTripHistory: boolean = false
): string => {
  return generatePDF('vehicle-report', { vehicle, includeServiceHistory, includeTripHistory }, {
    title: `Vehicle Report - ${vehicle.model} (${vehicle.registrationNumber})`,
    author: 'Fleet Management System',
    includeFooter: true,
    includeLogo: true,
    includeTimestamp: true
  });
};

export const generateTripReport = (trip: TripLog, vehicle: Vehicle): string => {
  return generatePDF('trip-report', { trip, vehicle }, {
    title: `Trip Report - ${vehicle.registrationNumber}`,
    author: 'Fleet Management System',
    includeFooter: true,
    includeLogo: true,
    includeTimestamp: true
  });
};

export const generateMaintenanceReport = (ticket: MaintenanceTicket): string => {
  return generatePDF('maintenance-report', { ticket }, {
    title: `Maintenance Report - ${ticket.title}`,
    author: 'Maintenance Management System',
    includeFooter: true,
    includeLogo: true,
    includeTimestamp: true
  });
};

export const generateFacilityBookingAgreement = (booking: any): string => {
  return generatePDF('facility-booking-agreement', { booking }, {
    title: `Facility Booking Agreement - ${booking.facilityName}`,
    author: 'Facility Management System',
    includeFooter: true,
    includeLogo: true,
    includeTimestamp: true
  });
};

export const generateVisitorPass = (visitor: any): string => {
  return generatePDF('visitor-pass', { visitor }, {
    title: `Visitor Pass - ${visitor.name}`,
    author: 'Visitor Management System',
    includeFooter: false,
    includeLogo: true,
    includeTimestamp: true
  });
};

export const generatePurchaseOrder = (order: any): string => {
  return generatePDF('purchase-order', { order }, {
    title: `Purchase Order - ${order.poNumber}`,
    author: 'Procurement System',
    includeFooter: true,
    includeLogo: true,
    includeTimestamp: true
  });
};

export const generateDocumentWithSignature = (document: Document, signature: string): string => {
  return generatePDF('document-signature', { document, signature }, {
    title: `Signed Document - ${document.title}`,
    author: 'Document Management System',
    includeFooter: true,
    includeLogo: true,
    includeTimestamp: true
  });
};

// New Report System PDF Generation
export const generateReportPDF = (
  template: ReportTemplate,
  result: ReportResult,
  username: string
): string => {
  const moduleNames: Record<string, string> = {
    'control-centre': 'Control Centre',
    'sales': 'Sales',
    'operations': 'Operations', 
    'hr': 'Human Resources',
    'accounts': 'Accounts',
    'office-admin': 'Office Administration'
  };

  const moduleName = moduleNames[template.module] || template.module;
  
  return generatePDF('report-export', { template, result }, {
    title: `${template.name} - ${moduleName}`,
    author: username,
    includeFooter: true,
    includeLogo: true,
    includeTimestamp: true,
    watermark: template.isBuiltIn ? undefined : 'Custom Report',
    orientation: template.defaultChartType === 'table' ? 'landscape' : 'portrait',
    paperSize: 'a4'
  });
};

// Generate Excel export (mock implementation)
export const generateExcelExport = (
  template: ReportTemplate,
  result: ReportResult,
  username: string
): string => {
  // In a real app, this would use something like ExcelJS to generate the file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `report-${template.id}-${timestamp}.xlsx`;
  
  console.log(`Generating Excel ${fileName} with data:`, { template, result });
  
  // Emit an event for tracking
  emitEvent(EVENT_TYPES.EXCEL_GENERATED, {
    reportId: template.id,
    title: template.name,
    fileName,
    timestamp: new Date().toISOString(),
    generatedBy: username
  });
  
  // Return a mock URL
  return `/generated-excel/${fileName}`;
};
