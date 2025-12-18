import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  onSnapshot,
  Timestamp,
  orderBy,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const COLLECTION_NAME = 'quotations';

export interface Quotation {
  id?: string;
  quotationId?: string; // Custom display ID like QT-2025-1234
  leadId?: string; // Reference to original lead
  client: string;
  companyName?: string;
  service: string;
  amount?: string;
  status: string;
  date?: string;
  validUntil?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Add a new quotation with custom ID
export const addQuotation = async (quotation: Omit<Quotation, 'id'> & { id?: string }) => {
  try {
    const quotationData = {
      ...quotation,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // If custom ID is provided, use setDoc with that ID
    if (quotation.id) {
      const customDocRef = doc(db, COLLECTION_NAME, quotation.id);
      
      // Check if document already exists
      const docSnap = await getDoc(customDocRef);
      if (docSnap.exists()) {
        return { success: false, error: `Quotation ID ${quotation.id} already exists. Please use a different ID.` };
      }
      
      await setDoc(customDocRef, quotationData);
      return { success: true, id: quotation.id };
    } else {
      // Otherwise, let Firebase auto-generate ID
      const docRef = await addDoc(collection(db, COLLECTION_NAME), quotationData);
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error('Error adding quotation:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update an existing quotation
export const updateQuotation = async (id: string, quotation: Partial<Quotation>) => {
  try {
    const quotationRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(quotationRef, {
      ...quotation,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating quotation:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete a quotation
export const deleteQuotation = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get all quotations
export const getQuotations = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const quotations: Quotation[] = [];
    
    querySnapshot.forEach((doc) => {
      quotations.push({
        id: doc.id,
        ...doc.data()
      } as Quotation);
    });
    
    return { success: true, data: quotations };
  } catch (error) {
    console.error('Error getting quotations:', error);
    return { success: false, error: (error as Error).message, data: [] };
  }
};

// Subscribe to real-time quotation updates
export const subscribeToQuotations = (callback: (quotations: Quotation[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const quotations: Quotation[] = [];
    querySnapshot.forEach((doc) => {
      quotations.push({
        id: doc.id,
        ...doc.data()
      } as Quotation);
    });
    callback(quotations);
  }, (error) => {
    console.error('Error subscribing to quotations:', error);
  });
};
