
import { EnhancedButton as Button } from "@/components/ui/enhanced-button";
import { Eye, Edit, Trash2, Download, Send, CheckCircle, XCircle, FileText } from "lucide-react";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { SoundBus } from "@/services/SoundService";
import { updateQuotation, deleteQuotation } from "@/services/firebase/QuotationFirebaseService";
import { addAgreement } from "@/services/firebase/AgreementFirebaseService";
import { QuotationDocumentService } from "@/services/documents/QuotationDocumentService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuotationActionProps {
  quotation: any;
  onEdit: (quotation: any) => void;
}

export function QuotationActionButtons({ quotation, onEdit }: QuotationActionProps) {
  const { toast } = useToastWithSound();
  
  const handleDelete = async (id: string) => {
    SoundBus.play('delete');
    
    if (!id) {
      toast.error({
        title: "Error",
        description: "Cannot delete: Quotation ID is missing.",
      });
      return;
    }
    
    const result = await deleteQuotation(id);
    if (result.success) {
      toast({
        title: "Quotation Deleted",
        description: `Quotation has been deleted successfully.`,
        duration: 3000,
        sound: 'delete'
      });
    } else {
      toast.error({
        title: "Error",
        description: result.error || "Failed to delete quotation. It may not exist in Firebase.",
      });
    }
  };
  
  const handleView = (id: string) => {
    SoundBus.play('click');
    toast({
      title: "Viewing Quotation Details",
      description: `Viewing details for quotation ${id}.`,
      duration: 3000,
    });
  };
  
  const handleDownloadPDF = () => {
    SoundBus.play('download');
    try {
      QuotationDocumentService.generatePDFDocument(quotation);
      toast({
        title: "PDF Downloaded",
        description: `Quotation ${quotation.id} downloaded as PDF.`,
        duration: 3000,
        sound: 'download'
      });
    } catch (error) {
      toast.error({
        title: "Error",
        description: "Failed to generate PDF document",
      });
    }
  };
  
  const handleDownloadWord = async () => {
    SoundBus.play('download');
    try {
      await QuotationDocumentService.generateWordDocument(quotation);
      toast({
        title: "Word Document Downloaded",
        description: `Quotation ${quotation.id} downloaded as Word document.`,
        duration: 3000,
        sound: 'download'
      });
    } catch (error) {
      toast.error({
        title: "Error",
        description: "Failed to generate Word document",
      });
    }
  };
  
  const handlePreview = () => {
    SoundBus.play('click');
    try {
      QuotationDocumentService.previewPDF(quotation);
    } catch (error) {
      toast.error({
        title: "Error",
        description: "Failed to preview document",
      });
    }
  };
  
  const handleSend = (id: string, client: string) => {
    SoundBus.play('notification');
    toast({
      title: "Sending Quotation",
      description: `Sending quotation ${id} to ${client}.`,
      duration: 3000,
    });
  };
  
  const handleApprove = async (quotation: any) => {
    SoundBus.play('success');
    
    // Validate quotation ID
    if (!quotation.id) {
      toast.error({
        title: "Error",
        description: "Cannot approve: Quotation ID is missing.",
      });
      return;
    }
    
    try {
      // Try to update quotation status to Accepted
      const updateResult = await updateQuotation(quotation.id, { status: "Accepted" });
      
      if (updateResult.success) {
        // Create agreement from quotation
        const agreementResult = await addAgreement({
          linkedQuoteId: quotation.id,
          clientName: quotation.client || quotation.clientName || "Unknown Client",
          serviceDetails: quotation.service || quotation.serviceDetails || "Service details",
          value: quotation.amount || quotation.value || "₹0",
          status: "Pending Signature"
        });
        
        if (agreementResult.success) {
          toast.success({
            title: "Quotation Approved",
            description: "Quotation approved and agreement created successfully!",
            duration: 3000,
          });
        } else {
          toast.error({
            title: "Partial Success",
            description: "Quotation approved but failed to create agreement: " + (agreementResult.error || "Unknown error"),
          });
        }
      } else {
        // Check if error is "document not found"
        if (updateResult.error && updateResult.error.includes("No document to update")) {
          toast.error({
            title: "Cannot Approve",
            description: "This quotation doesn't exist in Firebase. Please delete it and create a new one.",
          });
        } else {
          toast.error({
            title: "Error",
            description: updateResult.error || "Failed to approve quotation",
          });
        }
      }
    } catch (error) {
      console.error('Error in handleApprove:', error);
      toast.error({
        title: "Error",
        description: "An unexpected error occurred while approving the quotation.",
      });
    }
  };
  
  const handleReject = async (quotation: any) => {
    SoundBus.play('error');
    
    // Validate quotation ID
    if (!quotation.id) {
      toast.error({
        title: "Error",
        description: "Cannot reject: Quotation ID is missing.",
      });
      return;
    }
    
    try {
      const result = await updateQuotation(quotation.id, { status: "Rejected" });
      
      if (result.success) {
        toast.error({
          title: "Quotation Rejected",
          description: `Quotation has been rejected.`,
          duration: 3000,
        });
      } else {
        // Check if error is "document not found"
        if (result.error && result.error.includes("No document to update")) {
          toast.error({
            title: "Cannot Reject",
            description: "This quotation doesn't exist in Firebase. Please delete it and create a new one.",
          });
        } else {
          toast.error({
            title: "Error",
            description: result.error || "Failed to reject quotation",
          });
        }
      }
    } catch (error) {
      console.error('Error in handleReject:', error);
      toast.error({
        title: "Error",
        description: "An unexpected error occurred while rejecting the quotation.",
      });
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleView(quotation.id)}
        soundEffect="click"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            soundEffect="click"
            title="Download Options"
          >
            <Download className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadWord}>
            <FileText className="mr-2 h-4 w-4" />
            Download Word
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => handleSend(quotation.id, quotation.client)}
        soundEffect="notification"
      >
        <Send className="h-4 w-4" />
      </Button>
      {(quotation.status === "Pending" || quotation.status === "Draft" || quotation.status === "Sent") && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-green-500 hover:text-green-600"
            onClick={() => handleApprove(quotation)}
            soundEffect="success"
            title="Approve & Create Agreement"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-red-500 hover:text-red-600"
            onClick={() => handleReject(quotation)}
            soundEffect="error"
            title="Reject Quotation"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onEdit(quotation)}
        soundEffect="click"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-red-500 hover:text-red-600" 
        onClick={() => handleDelete(quotation.id)}
        soundEffect="delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
