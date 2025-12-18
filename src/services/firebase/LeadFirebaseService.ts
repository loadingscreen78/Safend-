// Firebase service for Lead Management
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface LeadData {
  id?: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  source: string;
  status: string;
  assignedTo: string;
  securityNeeds: {
    armedGuards: boolean;
    unarmedGuards: boolean;
    supervisors: boolean;
    patrolOfficers: boolean;
    eventSecurity: boolean;
    personalSecurity: boolean;
  };
  manpowerRequirements: {
    totalGuardsNeeded: string;
    shiftType: string;
    shiftCount: string;
    femaleGuardsRequired: boolean;
    exServicemenRequired: boolean;
  };
  siteInformation: {
    siteCount: string;
    primaryLocation: string;
    locationType: string;
    siteArea: string;
    accessControlNeeded: boolean;
    cameraSystemNeeded: boolean;
  };
  budget: string;
  targetStartDate: string;
  urgency: string;
  notes: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

const LEADS_COLLECTION = 'leads';

// Create a new lead
export const createLead = async (leadData: LeadData): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const currentUser = localStorage.getItem('userName') || 'Admin';
    
    const newLead = {
      ...leadData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: currentUser
    };

    const docRef = await addDoc(collection(db, LEADS_COLLECTION), newLead);
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing lead
export const updateLead = async (leadId: string, leadData: Partial<LeadData>): Promise<{ success: boolean; error?: string }> => {
  try {
    const leadRef = doc(db, LEADS_COLLECTION, leadId);
    
    await updateDoc(leadRef, {
      ...leadData,
      updatedAt: Timestamp.now()
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return { success: false, error: error.message };
  }
};

// Delete a lead
export const deleteLead = async (leadId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const leadRef = doc(db, LEADS_COLLECTION, leadId);
    await deleteDoc(leadRef);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return { success: false, error: error.message };
  }
};

// Get all leads
export const getAllLeads = async (): Promise<LeadData[]> => {
  try {
    const snapshot = await getDocs(collection(db, LEADS_COLLECTION));
    
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LeadData));
    
    // Sort in JavaScript instead of Firestore
    return leads.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

// Real-time listener for leads
export const subscribeToLeads = (callback: (leads: LeadData[]) => void): (() => void) => {
  const unsubscribe = onSnapshot(collection(db, LEADS_COLLECTION), (snapshot) => {
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LeadData));
    
    // Sort in JavaScript instead of Firestore
    const sortedLeads = leads.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    
    callback(sortedLeads);
  }, (error) => {
    console.error('Error in leads subscription:', error);
  });
  
  return unsubscribe;
};
