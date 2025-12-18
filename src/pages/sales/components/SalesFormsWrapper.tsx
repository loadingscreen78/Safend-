import React from "react";
import { LeadForm } from "./LeadForm";
import { QuotationForm } from "./QuotationForm";
import { ContactForm } from "./ContactForm";
import { WorkorderForm } from "./WorkorderForm";
import { FollowupForm } from "./FollowupForm";
import { AgreementForm } from "./AgreementForm";
import { AgingInvoiceForm } from "./AgingInvoiceForm";

interface SalesFormsWrapperProps {
  showLeadForm: boolean;
  showQuotationForm: boolean;
  showContactForm: boolean;
  showWorkorderForm: boolean;
  showFollowupForm: boolean;
  showAgreementForm: boolean;
  showAgingInvoiceForm: boolean;
  setShowLeadForm: (show: boolean) => void;
  setShowQuotationForm: (show: boolean) => void;
  setShowContactForm: (show: boolean) => void;
  setShowWorkorderForm: (show: boolean) => void;
  setShowFollowupForm: (show: boolean) => void;
  setShowAgreementForm: (show: boolean) => void;
  setShowAgingInvoiceForm: (show: boolean) => void;
  editingItem: any;
  handleLeadFormSubmit: (data: any) => void;
  handleOtherFormSubmit: (data: any, type: string) => void;
}

export function SalesFormsWrapper({
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
  handleLeadFormSubmit,
  handleOtherFormSubmit
}: SalesFormsWrapperProps) {
  return (
    <>
      {showLeadForm && 
        <LeadForm 
          isOpen={showLeadForm} 
          onClose={() => setShowLeadForm(false)} 
          onSubmit={handleLeadFormSubmit}
          editData={editingItem}
        />
      }
      
      {showQuotationForm && 
        <QuotationForm 
          isOpen={showQuotationForm} 
          onClose={() => setShowQuotationForm(false)} 
          onSubmit={(data) => handleOtherFormSubmit(data, "quotation")}
          editData={editingItem}
        />
      }
      
      {showContactForm && 
        <ContactForm 
          isOpen={showContactForm} 
          onClose={() => setShowContactForm(false)} 
          onSubmit={(data) => handleOtherFormSubmit(data, "contact")}
          editData={editingItem}
        />
      }
      
      {showWorkorderForm && 
        <WorkorderForm 
          isOpen={showWorkorderForm} 
          onClose={() => setShowWorkorderForm(false)} 
          onSubmit={(data) => handleOtherFormSubmit(data, "workorder")}
          editData={editingItem}
        />
      }
      
      {showFollowupForm && 
        <FollowupForm 
          isOpen={showFollowupForm} 
          onClose={() => setShowFollowupForm(false)} 
          onSubmit={(data) => handleOtherFormSubmit(data, "followup")}
          editData={editingItem}
        />
      }
      
      {showAgreementForm && 
        <AgreementForm 
          isOpen={showAgreementForm} 
          onClose={() => setShowAgreementForm(false)}
          onSubmit={(data) => handleOtherFormSubmit(data, "agreement")}
          editData={editingItem}
        />
      }
      
      {showAgingInvoiceForm && 
        <AgingInvoiceForm 
          isOpen={showAgingInvoiceForm} 
          onClose={() => setShowAgingInvoiceForm(false)}
          onSubmit={(data) => handleOtherFormSubmit(data, "aging invoice")}
          editData={editingItem}
        />
      }
    </>
  );
}