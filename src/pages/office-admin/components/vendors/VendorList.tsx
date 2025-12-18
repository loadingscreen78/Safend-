
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
import { StarIcon, Phone, Mail, MoreHorizontal } from "lucide-react";

interface VendorListProps {
  searchQuery: string;
}

export function VendorList({ searchQuery }: VendorListProps) {
  // Mock data - would come from API in real implementation
  const vendors = [
    {
      id: "VEN-001",
      name: "Security Solutions Ltd.",
      category: "Equipment",
      contactName: "John Smith",
      phone: "9876543210",
      email: "john@securitysolutions.com",
      rating: 4.5,
      status: "active"
    },
    {
      id: "VEN-002",
      name: "Uniforms & Apparel Co.",
      category: "Uniforms",
      contactName: "Sarah Johnson",
      phone: "8765432109",
      email: "sarah@uniformsco.com",
      rating: 4.2,
      status: "active"
    },
    {
      id: "VEN-003",
      name: "Tech Supplies Inc.",
      category: "Electronics",
      contactName: "Michael Lee",
      phone: "7654321098",
      email: "mike@techsupplies.com",
      rating: 3.8,
      status: "inactive"
    },
    {
      id: "VEN-004",
      name: "Office Essentials",
      category: "Stationery",
      contactName: "Priya Singh",
      phone: "6543210987",
      email: "priya@officeessentials.com",
      rating: 4.7,
      status: "active"
    }
  ];

  const filteredVendors = vendors.filter(
    vendor => 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVendors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No vendors found
              </TableCell>
            </TableRow>
          ) : (
            filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{vendor.contactName}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 mr-1" />
                      {vendor.phone}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="h-3 w-3 mr-1" />
                      {vendor.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{renderRating(vendor.rating)}</TableCell>
                <TableCell>
                  <Badge variant={vendor.status === "active" ? "default" : "secondary"}>
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
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
