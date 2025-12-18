
export interface Document {
  id: string;
  branchId: string;
  title: string;
  description: string;
  category: 'policy' | 'procedure' | 'form' | 'contract' | 'license' | 'certificate' | 'other';
  tags: string[];
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
  version: string;
  status: 'active' | 'archived' | 'draft';
  views: number;
  lastViewedAt?: string;
  lastViewedBy?: string;
  signatureRequired: boolean;
  signatures?: DocumentSignature[];
}

export interface DocumentSignature {
  id: string;
  documentId: string;
  employeeId: string;
  employeeName: string;
  signedAt: string;
  status: 'pending' | 'signed' | 'rejected';
  comments?: string;
}

export interface DocumentCategory {
  id: string;
  branchId: string;
  name: string;
  description: string;
  documentCount: number;
}
