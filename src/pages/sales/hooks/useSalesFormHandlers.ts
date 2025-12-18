import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleFormSubmit } from "@/services/firebase/LeadService";

export function useSalesFormHandlers() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWorkorderForm, setShowWorkorderForm] = useState(false);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [showAgingInvoiceForm, setShowAgingInvoiceForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [initialQuotationData, setInitialQuotationData] = useState(null);
  
  const { toast } = useToast();

  // Enhanced form submission handler for leads using Firebase
  const handleLeadFormSubmit = async (formData: any) => {
    try {
      await handleFormSubmit(formData, toast);
      setShowLeadForm(false);
      setEditingItem(null);
      
      toast({
        title: "Success",
        description: "Lead data synced in real-time!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  // Form submission handlers for other forms
  const handleOtherFormSubmit = (formData: any, type: string) => {
    const successMessage = editingItem 
      ? `${type} updated successfully` 
      : `New ${type} created successfully`;
      
    toast({
      title: "Success",
      description: successMessage,
      duration: 3000,
    });

    // Close all forms
    setShowQuotationForm(false);
    setShowContactForm(false);
    setShowWorkorderForm(false);
    setShowFollowupForm(false);
    setShowAgreementForm(false);
    setShowAgingInvoiceForm(false);
    setEditingItem(null);
  };

  // Handling edit actions
  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    switch (type) {
      case "lead":
        setShowLeadForm(true);
        break;
      case "quotation":
        setShowQuotationForm(true);
        break;
      case "contact":
        setShowContactForm(true);
        break;
      case "workorder":
        setShowWorkorderForm(true);
        break;
      case "followup":
        setShowFollowupForm(true);
        break;
      case "agreement":
        setShowAgreementForm(true);
        break;
      case "aging":
        setShowAgingInvoiceForm(true);
        break;
      default:
        break;
    }
  };

  return {
    // Form states
    showLeadForm,
    showQuotationForm,
    showContactForm,
    showWorkorderForm,
    showFollowupForm,
    showAgreementForm,
    showAgingInvoiceForm,
    editingItem,
    initialQuotationData,
    setShowLeadForm,
    setShowQuotationForm,
    setShowContactForm,
    setShowWorkorderForm,
    setShowFollowupForm,
    setShowAgreementForm,
    setShowAgingInvoiceForm,
    setEditingItem,
    setInitialQuotationData,
    
    // Form handlers
    handleLeadFormSubmit,
    handleOtherFormSubmit,
    handleEdit
  };
}