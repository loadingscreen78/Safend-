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
  orderBy 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const COLLECTION_NAME = 'workorders';

export interface WorkOrder {
  id?: string;
  workOrderId?: string;
  linkedAgreementId: string;
  linkedQuoteId?: string;
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
  startDate?: Date;
  completionDate?: Date;
}

// Add a new work order
export const addWorkOrder = async (workOrder: Omit<WorkOrder, 'id'>) => {
  try {
    const workOrderData = {
      ...workOrder,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), workOrderData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding work order:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update an existing work order
export const updateWorkOrder = async (id: string, workOrder: Partial<WorkOrder>) => {
  try {
    const workOrderRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(workOrderRef, {
      ...workOrder,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating work order:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete a work order
export const deleteWorkOrder = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting work order:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get all work orders
export const getWorkOrders = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const workOrders: WorkOrder[] = [];
    
    querySnapshot.forEach((doc) => {
      workOrders.push({
        id: doc.id,
        ...doc.data()
      } as WorkOrder);
    });
    
    return { success: true, data: workOrders };
  } catch (error) {
    console.error('Error getting work orders:', error);
    return { success: false, error: (error as Error).message, data: [] };
  }
};

// Subscribe to real-time work order updates
export const subscribeToWorkOrders = (callback: (workOrders: WorkOrder[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const workOrders: WorkOrder[] = [];
    querySnapshot.forEach((doc) => {
      workOrders.push({
        id: doc.id,
        ...doc.data()
      } as WorkOrder);
    });
    callback(workOrders);
  }, (error) => {
    console.error('Error subscribing to work orders:', error);
  });
};
