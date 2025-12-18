import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CenteredLoader } from "@/components/ui/modern-loader";
import { CRMTabContent } from "./tabs/CRMTabContent";
import { QuotationsTabContent } from "./tabs/QuotationsTabContent";
import { CollectionsTabContent } from "./tabs/CollectionsTabContent";
import { ContractsManagement } from "./ContractsManagement";
import { SalesReportView } from "./SalesReportView";
import { EnhancedCalendarView } from "./calendar/EnhancedCalendarView";

interface SalesTabsContentProps {
  isLoading: boolean;
  activeTab: string;
  selectedClient: any;
  setSelectedClient: (client: any) => void;
  activeFilter: string;
  searchTerm: string;
  handleEdit: (item: any, type: string) => void;
  handleClientSelect: (client: any) => void;
  setEditingItem: (item: any) => void;
  setShowFollowupForm: (show: boolean) => void;
  onConvertToQuotation?: (followup: any) => void;
  onCreateQuotationFromLead?: (lead: any) => void;
}

export function SalesTabsContent({
  isLoading,
  activeTab,
  selectedClient,
  setSelectedClient,
  activeFilter,
  searchTerm,
  handleEdit,
  handleClientSelect,
  setEditingItem,
  setShowFollowupForm,
  onConvertToQuotation,
  onCreateQuotationFromLead
}: SalesTabsContentProps) {
  if (isLoading) {
    return (
      <CenteredLoader
        size="lg"
        variant="dual-ring"
        message={`Loading ${activeTab} data...`}
        className="h-[400px]"
      />
    );
  }

  return (
    <div className="p-6">
      <TabsContent value="crm" className="space-y-4 animate-in fade-in-50">
        <CRMTabContent
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          activeFilter={activeFilter}
          searchTerm={searchTerm}
          onEdit={handleEdit}
          onClientSelect={handleClientSelect}
          onShowFollowupForm={() => {
            setEditingItem(null);
            setShowFollowupForm(true);
          }}
          onConvertToQuotation={onConvertToQuotation}
          onCreateQuotationFromLead={onCreateQuotationFromLead}
        />
      </TabsContent>
      
      <TabsContent value="quotations" className="space-y-6 animate-in fade-in-50">
        <QuotationsTabContent
          activeFilter={activeFilter}
          searchTerm={searchTerm}
          onEdit={handleEdit}
        />
      </TabsContent>
      
      <TabsContent value="contracts" className="space-y-6 animate-in fade-in-50">
        <ContractsManagement
          filter={activeFilter}
          searchTerm={searchTerm}
          onEdit={handleEdit}
        />
      </TabsContent>
      
      <TabsContent value="aging" className="space-y-6 animate-in fade-in-50">
        <CollectionsTabContent
          activeFilter={activeFilter}
          searchTerm={searchTerm}
          onEdit={handleEdit}
        />
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-6 animate-in fade-in-50">
        <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800/30">
          <h3 className="text-lg font-medium mb-2">Sales Reports</h3>
          <p className="text-muted-foreground">
            Access and analyze sales performance metrics and trends.
          </p>
        </div>
        
        <SalesReportView filter={activeFilter} />
      </TabsContent>
      
      <TabsContent value="calendar" className="space-y-6 animate-in fade-in-50">
        <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800/30">
          <h3 className="text-lg font-medium mb-2">Unified Calendar</h3>
          <p className="text-muted-foreground">
            Centralized calendar integrating Sales, HR, Operations, and Office Admin activities with smart conflict detection and resource optimization.
          </p>
        </div>
        
        <EnhancedCalendarView filter={activeFilter} />
      </TabsContent>
    </div>
  );
}