
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PurchaseRequestsListProps {
  searchQuery: string;
}

export function PurchaseRequestsList({ searchQuery }: PurchaseRequestsListProps) {
  // Mock data - would come from API in real implementation
  const purchaseRequests = [
    {
      id: "PR-2025-001",
      title: "Security Equipment Restock",
      vendorId: "VEN-001",
      vendorName: "Security Solutions Ltd.",
      requestedBy: "Amit Kumar",
      requestedDate: "2025-04-28T10:30:00Z",
      status: "pending",
      totalAmount: 45000,
      currency: "INR",
      items: [
        { name: "Security Badge", quantity: 50, unitPrice: 300, total: 15000 },
        { name: "Radio Sets", quantity: 10, unitPrice: 3000, total: 30000 }
      ]
    },
    {
      id: "PR-2025-002",
      title: "Office Supplies",
      vendorId: "VEN-004",
      vendorName: "Office Essentials",
      requestedBy: "Maya Patel",
      requestedDate: "2025-04-29T14:15:00Z",
      status: "approved",
      totalAmount: 12500,
      currency: "INR",
      items: [
        { name: "Printer Paper", quantity: 50, unitPrice: 150, total: 7500 },
        { name: "Stationery Kit", quantity: 10, unitPrice: 500, total: 5000 }
      ]
    },
    {
      id: "PR-2025-003",
      title: "Uniform Order",
      vendorId: "VEN-002",
      vendorName: "Uniforms & Apparel Co.",
      requestedBy: "Amit Kumar",
      requestedDate: "2025-05-01T09:45:00Z",
      status: "completed",
      totalAmount: 60000,
      currency: "INR",
      items: [
        { name: "Security Uniforms", quantity: 20, unitPrice: 3000, total: 60000 }
      ]
    },
    {
      id: "PR-2025-004",
      title: "Communication Devices",
      vendorId: "VEN-003",
      vendorName: "Tech Supplies Inc.",
      requestedBy: "Rahul Sharma",
      requestedDate: "2025-05-02T11:20:00Z",
      status: "rejected",
      totalAmount: 75000,
      currency: "INR",
      items: [
        { name: "Walkie Talkie", quantity: 15, unitPrice: 5000, total: 75000 }
      ],
      rejectionReason: "Duplicate of existing purchase request PR-2025-001"
    }
  ];

  const filteredRequests = purchaseRequests.filter(
    pr => 
      pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">Pending</Badge>;
      case 'approved': return <Badge variant="default">Approved</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Completed</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PR Number</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No purchase requests found
              </TableCell>
            </TableRow>
          ) : (
            filteredRequests.map((pr) => (
              <TableRow key={pr.id}>
                <TableCell className="font-mono text-xs">{pr.id}</TableCell>
                <TableCell className="font-medium">{pr.title}</TableCell>
                <TableCell>{pr.vendorName}</TableCell>
                <TableCell>{pr.requestedBy}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(pr.requestedDate), { addSuffix: true })}
                    </span>
                    <span className="text-xs">
                      {new Date(pr.requestedDate).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {pr.currency} {pr.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {getStatusBadge(pr.status)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Generate P/O">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
