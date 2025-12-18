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
  where
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const COLLECTION_NAME = 'agreements';

export interface Agreement {
  id?: string;
  agreementId?: string;
  linkedQuoteId: string;
  leadId?: string; // Reference to original lead
  clientName: string;
  companyName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  serviceDetails: string;
  value: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  signedDate?: Date;
}

// Add a new agreement
export const addAgreement = async (agreement: Omit<Agreement, 'id'>) => {
  try {
    const agreementData = {
      ...agreement,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), agreementData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding agreement:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update an existing agreement
export const updateAgreement = async (id: string, agreement: Partial<Agreement>) => {
  try {
    const agreementRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(agreementRef, {
      ...agreement,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating agreement:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete an agreement
export const deleteAgreement = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting agreement:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get all agreements
export const getAgreements = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('status', '!=', 'Deleted'),
      orderBy('status'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const agreements: Agreement[] = [];
    
    querySnapshot.forEach((doc) => {
      agreements.push({
        id: doc.id,
        ...doc.data()
      } as Agreement);
    });
    
    return { success: true, data: agreements };
  } catch (error) {
    console.error('Error getting agreements:', error);
    return { success: false, error: (error as Error).message, data: [] };
  }
};

// Subscribe to real-time agreement updates
export const subscribeToAgreements = (callback: (agreements: Agreement[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const agreements: Agreement[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status !== 'Deleted') {
        agreements.push({
          id: doc.id,
          ...data
        } as Agreement);
      }
    });
    callback(agreements);
  }, (error) => {
    console.error('Error subscribing to agreements:', error);
  });
};
