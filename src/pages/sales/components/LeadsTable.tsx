import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, MoreVertical, Edit, Eye, Trash2, Phone, Mail, MapPin, Building2, Clock, FileText } from "lucide-react";
import { subscribeToLeads, deleteLead } from "@/services/firebase/LeadFirebaseService";
import { addFollowup } from "@/services/firebase/FollowupFirebaseService";
import { useToast } from "@/components/ui/use-toast";
import { CallClientModal } from "./CallClientModal";
import { EmailClientModal } from "./EmailClientModal";
import { ScheduleFollowupModal, FollowupData } from "./ScheduleFollowupModal";
interface Lead {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  source: string;
  status: string;
  assignedTo: string;
  budget: string;
  createdAt: Date;
}
interface LeadsTableProps {
  filter: string;
  searchTerm: string;
  onEdit: (lead: Lead) => void;
  onClientSelect: (client: Lead) => void;
  onCreateQuotation?: (lead: Lead) => void;
}

// Mock data for demonstration
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    companyName: "Tech Solutions Pvt Ltd",
    email: "rajesh@techsolutions.com",
    phone: "+91 98765 43210",
    address: "123 Business Park",
    city: "Mumbai",
    state: "Maharashtra",
    source: "Website",
    status: "New Lead",
    assignedTo: "John Doe",
    budget: "₹5-10 Lakhs",
    createdAt: new Date("2024-01-15")
  },
  {
    id: "2",
    name: "Priya Sharma",
    companyName: "Retail Chain Ltd",
    email: "priya@retailchain.com",
    phone: "+91 87654 32109",
    address: "456 Commercial Street",
    city: "Bangalore",
    state: "Karnataka",
    source: "Referral",
    status: "Qualified Lead",
    assignedTo: "Jane Smith",
    budget: "₹10-25 Lakhs",
    createdAt: new Date("2024-01-20")
  },
  {
    id: "3",
    name: "Amit Patel",
    companyName: "Manufacturing Industries",
    email: "amit@manufacturing.com",
    phone: "+91 99887 76655",
    address: "789 Industrial Area",
    city: "Ahmedabad",
    state: "Gujarat",
    source: "Cold Call",
    status: "Opportunity",
    assignedTo: "John Doe",
    budget: "₹25-50 Lakhs",
    createdAt: new Date("2024-01-25")
  },
  {
    id: "4",
    name: "Sunita Reddy",
    companyName: "Hospitality Group",
    email: "sunita@hospitalitygroup.com",
    phone: "+91 88776 65544",
    address: "321 Hotel District",
    city: "Hyderabad",
    state: "Telangana",
    source: "Website",
    status: "New Lead",
    assignedTo: "Jane Smith",
    budget: "₹15-30 Lakhs",
    createdAt: new Date("2024-02-01")
  },
  {
    id: "5",
    name: "Vikram Singh",
    companyName: "Real Estate Developers",
    email: "vikram@realestate.com",
    phone: "+91 77665 54433",
    address: "555 Construction Site",
    city: "Delhi",
    state: "Delhi",
    source: "Referral",
    status: "Client",
    assignedTo: "John Doe",
    budget: "₹50+ Lakhs",
    createdAt: new Date("2024-02-05")
  }
];
export function LeadsTable({
  filter,
  searchTerm,
  onEdit,
  onClientSelect,
  onCreateQuotation
}: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Modal states
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToLeads((firebaseLeads) => {
      const formattedLeads = firebaseLeads.map((lead: any) => ({
        ...lead,
        createdAt: lead.createdAt?.toDate ? lead.createdAt.toDate() : new Date()
      }));
      setLeads(formattedLeads);
    });
    
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    let filtered = leads;

    // Apply filter
    if (filter !== "All Clients") {
      filtered = filtered.filter(lead => {
        switch (filter) {
          case "New Leads":
            return lead.status === "New Lead";
          case "Qualified Leads":
            return lead.status === "Qualified Lead";
          case "Opportunities":
            return lead.status === "Opportunity";
          case "Existing Clients":
            return lead.status === "Client";
          case "Inactive Clients":
            return lead.status === "Inactive";
          default:
            return true;
        }
      });
    }

    // Apply search
    const searchQuery = localSearchTerm || searchTerm;
    if (searchQuery) {
      filtered = filtered.filter(lead => lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase()) || lead.phone.includes(searchQuery) || lead.city.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredLeads(filtered);
  }, [leads, filter, searchTerm, localSearchTerm]);
  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      "New Lead": "default",
      "Qualified Lead": "secondary",
      "Opportunity": "outline",
      "Client": "default",
      "Inactive": "secondary"
    };
    return <Badge variant={variants[status] || "default"}>
        {status}
      </Badge>;
  };
  const handleDelete = async (leadId: string) => {
    const result = await deleteLead(leadId);
    if (result.success) {
      toast({
        title: "Success",
        description: "Lead deleted successfully"
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete lead",
        variant: "destructive"
      });
    }
  };

  // Handle opening modals
  const handleCallClick = (lead: Lead) => {
    setSelectedLead(lead);
    setCallModalOpen(true);
  };

  const handleEmailClick = (lead: Lead) => {
    setSelectedLead(lead);
    setEmailModalOpen(true);
  };

  const handleScheduleClick = (lead: Lead) => {
    setSelectedLead(lead);
    setScheduleModalOpen(true);
  };

  // Handle saving follow-up
  const handleSaveFollowup = async (followupData: FollowupData) => {
    const result = await addFollowup(followupData);
    if (result.success) {
      toast({
        title: "Success",
        description: "Follow-up scheduled successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to schedule follow-up",
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="w-full">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name & Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      <Building2 className="h-8 w-8 mx-auto mb-2" />
                      <p>No leads found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead, index) => (
                  <TableRow key={lead.id || `lead-${index}`} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.companyName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{lead.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{lead.city}, {lead.state}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(lead.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{lead.assignedTo}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{lead.budget}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {lead.createdAt.toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider>
                          {/* Email Client */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEmailClick(lead);
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Send Email</p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Call Client */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCallClick(lead);
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Call Client</p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Schedule Follow-up */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleScheduleClick(lead);
                                }}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Schedule Follow-up</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* More Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onClientSelect(lead)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {onCreateQuotation && (
                              <DropdownMenuItem 
                                onClick={() => onCreateQuotation(lead)}
                                className="text-blue-600 dark:text-blue-400"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Create Quotation
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => onEdit(lead)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(lead.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modals */}
      {selectedLead && (
        <>
          <CallClientModal
            isOpen={callModalOpen}
            onClose={() => setCallModalOpen(false)}
            clientName={selectedLead.name}
            clientPhone={selectedLead.phone}
          />
          
          <EmailClientModal
            isOpen={emailModalOpen}
            onClose={() => setEmailModalOpen(false)}
            clientName={selectedLead.name}
            clientEmail={selectedLead.email}
            companyName={selectedLead.companyName}
          />
          
          <ScheduleFollowupModal
            isOpen={scheduleModalOpen}
            onClose={() => setScheduleModalOpen(false)}
            clientName={selectedLead.name}
            companyName={selectedLead.companyName}
            onSave={handleSaveFollowup}
          />
        </>
      )}
    </Card>
  );
}