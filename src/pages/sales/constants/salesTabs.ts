import {
  Users,
  FileText,
  MessageSquare,
  BarChart2,
  Calendar,
  FileSignature,
  DollarSign
} from "lucide-react";

export const salesTabs = [
  { id: "crm", label: "Client Management", icon: Users },
  { id: "quotations", label: "Quotations", icon: FileText },
  { id: "contracts", label: "Contracts", icon: FileSignature },
  { id: "aging", label: "Collections", icon: DollarSign },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "calendar", label: "Unified Calendar", icon: Calendar }
];

export const filterOptions = {
  "crm": ["All Clients", "New Leads", "Qualified Leads", "Opportunities", "Existing Clients", "Inactive Clients"],
  "quotations": ["All Quotations", "Draft", "Sent", "Revised", "Accepted", "Rejected"],
  "contracts": ["All Contracts", "Pending Agreement", "Agreement Signed", "Work Order Created", "Active", "Completed"],
  "reports": ["Sales Performance", "Revenue Analysis", "Pipeline Status", "Conversion Rate", "Activity Reports"],
  "calendar": ["All Events", "Sales Meetings", "Site Visits", "Contract Deadlines", "HR Interviews", "Operations Planning", "Office Admin Meetings", "Compliance Deadlines"],
  "aging": ["All Invoices", "0-30 Days", "31-60 Days", "61-90 Days", "90+ Days"]
};