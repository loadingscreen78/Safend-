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
import { getStatusBadge, getPricingTypeBadge } from "./QuotationStatusBadge";
import { QuotationActionButtons } from "./QuotationActionButtons";
import { subscribeToQuotations, deleteQuotation } from "@/services/firebase/QuotationFirebaseService";
import { useToast } from "@/components/ui/use-toast";

// Mock data removed - now using only Firebase data

interface QuotationsTableProps {
  filter: string;
  searchTerm: string;
  onEdit: (quotation: any) => void;
}

export function QuotationsTable({ filter, searchTerm, onEdit }: QuotationsTableProps) {
  const [quotations, setQuotations] = useState<any[]>([]);
  const { toast } = useToast();

  // Subscribe to real-time quotations from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToQuotations((firebaseQuotations) => {
      setQuotations(firebaseQuotations);
    });
    
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await deleteQuotation(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Quotation deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete quotation",
        variant: "destructive",
      });
    }
  };

  // Valid quotation filters
  const validQuotationFilters = ["All Quotations", "Draft", "Sent", "Revised", "Accepted", "Rejected", "Pending", "Approved"];
  
  // Filter quotations based on selected filter and search term
  const filteredQuotations = quotations.filter(quotation => {
    // Only apply filter if it's a valid quotation filter
    if (validQuotationFilters.includes(filter)) {
      if (filter !== "All Quotations") {
        const statusLower = (quotation.status || "").toLowerCase();
        const filterLower = filter.toLowerCase();
        
        // Direct match or partial match
        if (!statusLower.includes(filterLower)) {
          return false;
        }
      }
    }
    // If filter is not valid for quotations (like "All Clients"), show all quotations
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchFound = Object.values(quotation).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );
      if (!matchFound) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>List of quotations sent to clients</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Quote #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Service Details</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Pricing</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQuotations.length > 0 ? (
            filteredQuotations.map((quotation, index) => (
              <TableRow key={`quotation-${index}-${quotation.id || Date.now()}`}>
                <TableCell className="font-medium">{quotation.quotationId || quotation.id}</TableCell>
                <TableCell>
                  {quotation.client}
                  <div className="text-xs text-muted-foreground mt-1">
                    {quotation.contactPerson}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-[200px]">
                  <div className="truncate">{quotation.service}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Valid until: {quotation.validUntil}
                  </div>
                </TableCell>
                <TableCell>{quotation.amount}</TableCell>
                <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getPricingTypeBadge(quotation.pricingType)}
                </TableCell>
                <TableCell className="text-right">
                  <QuotationActionButtons quotation={quotation} onEdit={onEdit} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No quotations found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
