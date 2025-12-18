import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ModuleHeader } from "@/components/ui/module-header";
import { ModuleCard } from "@/components/ui/module-card";

// Components
import { SalesTabNavigation } from "./components/SalesTabNavigation";
import { SalesFormsWrapper } from "./components/SalesFormsWrapper";
import { SalesTabsContent } from "./components/SalesTabsContent";

// Hooks
import { useSalesFormHandlers } from "./hooks/useSalesFormHandlers";
import { useSalesModule } from "./hooks/useSalesModule";

export function SalesModule() {
  // Module state management
  const {
    activeTab,
    activeFilter,
    searchTerm,
    filterIsOpen,
    selectedClient,
    isLoading,
    setSearchTerm,
    setFilterIsOpen,
    setSelectedClient,
    setActiveTab,
    handleTabChange,
    handleFilterChange,
    handleClientSelect
  } = useSalesModule();
  
  // Form handling from custom hook
  const {
    showLeadForm,
    showQuotationForm,
    showContactForm,
    showWorkorderForm,
    showFollowupForm,
    showAgreementForm,
    showAgingInvoiceForm,
    setShowLeadForm,
    setShowQuotationForm,
    setShowContactForm,
    setShowWorkorderForm,
    setShowFollowupForm,
    setShowAgreementForm,
    setShowAgingInvoiceForm,
    editingItem,
    initialQuotationData,
    handleLeadFormSubmit,
    handleOtherFormSubmit,
    handleEdit,
    setEditingItem,
    setInitialQuotationData
  } = useSalesFormHandlers();

  // Handle convert lead to quotation
  const handleCreateQuotationFromLead = (lead: any) => {
    const quotationData = {
      leadId: lead.id,
      client: lead.name,
      companyName: lead.companyName,
      contactPerson: lead.name,
      contactEmail: lead.email,
      contactPhone: lead.phone,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode,
      service: `Security Services for ${lead.companyName}`,
      status: "Draft"
    };
    
    setInitialQuotationData(quotationData);
    setEditingItem(quotationData);
    setActiveTab("quotations");
    
    // Small delay to ensure tab switch completes
    setTimeout(() => {
      setShowQuotationForm(true);
    }, 100);
  };

  // Handle convert follow-up to quotation
  const handleConvertToQuotation = (followup: any) => {
    const quotationData = {
      client: followup.contact,
      company: followup.company,
      contactPerson: followup.contact,
      service: followup.subject,
      status: "Draft"
    };
    
    setInitialQuotationData(quotationData);
    setEditingItem(quotationData);
    setActiveTab("quotations");
    
    // Small delay to ensure tab switch completes
    setTimeout(() => {
      setShowQuotationForm(true);
    }, 100);
  };

  return (
    <Layout>
      <motion.div
        className="space-y-6 page-transition"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ModuleHeader
          title="Sales Management"
          description={activeTab === "aging" ? 
            "Manage outstanding invoices and collections" : 
            "Manage leads, quotations, agreements, work orders and follow-ups"}
        />

        <ModuleCard className="overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <SalesTabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              filterIsOpen={filterIsOpen}
              setFilterIsOpen={setFilterIsOpen}
              onShowLeadForm={() => {
                setEditingItem(null);
                setShowLeadForm(true);
              }}
              onShowAgreementForm={() => {
                setEditingItem(null);
                setShowAgreementForm(true);
              }}
              onShowAgingInvoiceForm={() => {
                setEditingItem(null);
                setShowAgingInvoiceForm(true);
              }}
            />
            
            <SalesTabsContent
              isLoading={isLoading}
              activeTab={activeTab}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              activeFilter={activeFilter}
              searchTerm={searchTerm}
              handleEdit={handleEdit}
              handleClientSelect={handleClientSelect}
              setEditingItem={setEditingItem}
              setShowFollowupForm={setShowFollowupForm}
              onConvertToQuotation={handleConvertToQuotation}
              onCreateQuotationFromLead={handleCreateQuotationFromLead}
            />
          </Tabs>
        </ModuleCard>
      </motion.div>

      <SalesFormsWrapper
        showLeadForm={showLeadForm}
        showQuotationForm={showQuotationForm}
        showContactForm={showContactForm}
        showWorkorderForm={showWorkorderForm}
        showFollowupForm={showFollowupForm}
        showAgreementForm={showAgreementForm}
        showAgingInvoiceForm={showAgingInvoiceForm}
        setShowLeadForm={setShowLeadForm}
        setShowQuotationForm={setShowQuotationForm}
        setShowContactForm={setShowContactForm}
        setShowWorkorderForm={setShowWorkorderForm}
        setShowFollowupForm={setShowFollowupForm}
        setShowAgreementForm={setShowAgreementForm}
        setShowAgingInvoiceForm={setShowAgingInvoiceForm}
        editingItem={editingItem}
        handleLeadFormSubmit={handleLeadFormSubmit}
        handleOtherFormSubmit={handleOtherFormSubmit}
      />
    </Layout>
  );
}