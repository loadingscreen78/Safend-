import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileSignature, Printer, Send, CheckCircle, Download, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { subscribeToAgreements, deleteAgreement, updateAgreement } from "@/services/firebase/AgreementFirebaseService";
import { addWorkOrder } from "@/services/firebase/WorkOrderFirebaseService";
import { AgreementDocumentService } from "@/services/documents/AgreementDocumentService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Draft":
    case "Pending Signature":
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    case "Signed":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Active":
      return <Badge className="bg-safend-red hover:bg-red-700">{status}</Badge>;
    case "Expired":
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    case "Terminated":
      return <Badge className="bg-black hover:bg-gray-900 text-white">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface AgreementsTableProps {
  filter: string;
  searchTerm: string;
  onEdit: (agreement: any) => void;
}

export function AgreementsTable({ filter, searchTerm, onEdit }: AgreementsTableProps) {
  const [agreements, setAgreements] = useState<any[]>([]);
  const { toast } = useToast();

  // Subscribe to real-time agreements from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToAgreements((firebaseAgreements) => {
      setAgreements(firebaseAgreements);
    });
    
    return () => unsubscribe();
  }, []);

  // Valid agreement filters
  const validAgreementFilters = ["All Agreements", "Draft", "Pending Signature", "Signed", "Active", "Expired", "Terminated"];
  
  // Filter agreements based on selected filter and search term
  const filteredAgreements = agreements.filter(agreement => {
    // Only apply filter if it's a valid agreement filter
    if (validAgreementFilters.includes(filter)) {
      if (filter !== "All Agreements") {
        const statusLower = (agreement.status || "").toLowerCase();
        const filterLower = filter.toLowerCase();
        
        if (!statusLower.includes(filterLower)) {
          return false;
        }
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchFound = Object.values(agreement).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );
      if (!matchFound) {
        return false;
      }
    }
    
    return true;
  });
  
  const handleDelete = async (id: string) => {
    const result = await deleteAgreement(id);
    if (result.success) {
      toast({
        title: "Agreement Deleted",
        description: "Agreement has been deleted successfully.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete agreement",
        variant: "destructive",
      });
    }
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Viewing Agreement",
      description: `Viewing details for agreement.`,
      duration: 3000,
    });
  };
  
  const handleDownloadPDF = (agreement: any) => {
    try {
      AgreementDocumentService.generatePDFDocument(agreement);
      toast({
        title: "PDF Downloaded",
        description: `Agreement ${agreement.id} downloaded as PDF.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF document",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadWord = async (agreement: any) => {
    try {
      await AgreementDocumentService.generateWordDocument(agreement);
      toast({
        title: "Word Document Downloaded",
        description: `Agreement ${agreement.id} downloaded as Word document.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate Word document",
        variant: "destructive",
      });
    }
  };
  
  const handlePreview = (agreement: any) => {
    try {
      AgreementDocumentService.previewPDF(agreement);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to preview document",
        variant: "destructive",
      });
    }
  };
  
  const handleSign = async (agreement: any) => {
    // Update agreement status to Signed
    const updateResult = await updateAgreement(agreement.id, { 
      status: "Signed",
      signedDate: new Date()
    });
    
    if (updateResult.success) {
      // Create work order from agreement
      const workOrderResult = await addWorkOrder({
        linkedAgreementId: agreement.id,
        clientName: agreement.clientName,
        serviceDetails: agreement.serviceDetails,
        value: agreement.value,
        status: "Draft"
      });
      
      if (workOrderResult.success) {
        toast({
          title: "Agreement Signed",
          description: "Agreement signed and work order created successfully!",
          duration: 3000,
        });
      } else {
        toast({
          title: "Partial Success",
          description: "Agreement signed but failed to create work order",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: updateResult.error || "Failed to sign agreement",
        variant: "destructive",
      });
    }
  };
  
  const handlePrint = (id: string) => {
    toast({
      title: "Print Agreement",
      description: "Preparing agreement for printing.",
      duration: 3000,
    });
  };
  
  const handleSend = (id: string) => {
    toast({
      title: "Send Agreement",
      description: "Preparing to send agreement via email.",
      duration: 3000,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>List of agreements and contracts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Quote Ref.</TableHead>
            <TableHead className="hidden lg:table-cell">Service Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAgreements.length > 0 ? (
            filteredAgreements.map((agreement, index) => (
              <TableRow key={agreement.id || `agreement-${index}`}>
                <TableCell className="font-medium">
                  {agreement.clientName}
                </TableCell>
                <TableCell className="hidden md:table-cell">{agreement.linkedQuoteId || "N/A"}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="max-w-xs truncate">{agreement.serviceDetails}</div>
                </TableCell>
                <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                <TableCell className="hidden lg:table-cell">{agreement.value}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(agreement.id)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(agreement.status === "Pending Signature" || agreement.status === "Draft") && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-green-500 hover:text-green-600"
                        onClick={() => handleSign(agreement)}
                        title="Sign & Create Work Order"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Download Options"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(agreement)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPDF(agreement)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadWord(agreement)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Download Word
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleSend(agreement.id)}
                      title="Send"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(agreement)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => handleDelete(agreement.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No agreements found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
