import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { LeadsTable } from "../LeadsTable";
import { FollowupSummaryCards } from "../FollowupSummaryCards";
import { FollowupsTable } from "../FollowupsTable";
import { ClientProfile } from "../ClientProfile";
import { CRMStatsCards } from "../CRMStatsCards";
interface CRMTabContentProps {
  selectedClient: any;
  setSelectedClient: (client: any) => void;
  activeFilter: string;
  searchTerm: string;
  onEdit: (item: any, type: string) => void;
  onClientSelect: (client: any) => void;
  onShowFollowupForm: () => void;
  onConvertToQuotation?: (followup: any) => void;
  onCreateQuotationFromLead?: (lead: any) => void;
}
export function CRMTabContent({
  selectedClient,
  setSelectedClient,
  activeFilter,
  searchTerm,
  onEdit,
  onClientSelect,
  onShowFollowupForm,
  onConvertToQuotation,
  onCreateQuotationFromLead
}: CRMTabContentProps) {
  if (selectedClient) {
    return <ClientProfile client={selectedClient} onBack={() => setSelectedClient(null)} onEdit={onEdit} />;
  }
  return <>
      <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800/30">
        <h3 className="text-lg font-medium mb-2">Optimized Client Management Dashboard</h3>
        <p className="text-muted-foreground">
          Unified view of leads, clients, opportunities, and integrated follow-ups. Smart prioritization and calendar sync optimize your sales workflow.
        </p>
      </div>
      
      <CRMStatsCards />
      
      <LeadsTable 
        filter={activeFilter} 
        searchTerm={searchTerm} 
        onEdit={item => onEdit(item, "lead")} 
        onClientSelect={onClientSelect}
        onCreateQuotation={onCreateQuotationFromLead}
      />

      <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800/30">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium mb-2">Integrated Follow-up Management</h3>
            <p className="text-muted-foreground">
              Schedule, manage and track all follow-ups with clients and prospects directly within the CRM workflow.
            </p>
          </div>
          
        </div>
      </div>
      
      <FollowupSummaryCards />
      
      <FollowupsTable 
        filter="All Follow-ups" 
        searchTerm="" 
        onEdit={item => onEdit(item, "followup")} 
        onConvertToQuotation={onConvertToQuotation}
      />
    </>;
}