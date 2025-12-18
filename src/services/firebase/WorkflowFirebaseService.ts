import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Workflow Firebase Service
 * Provides real-time queries for workflow pipeline stages
 */

// Subscribe to Pending Agreements (status == "Pending Signature")
export const subscribeToPendingAgreements = (callback: (agreements: any[]) => void) => {
  const q = query(
    collection(db, 'agreements'),
    where('status', '==', 'Pending Signature'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const agreements: any[] = [];
    querySnapshot.forEach((doc) => {
      agreements.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(agreements);
  }, (error) => {
    console.error('Error subscribing to pending agreements:', error);
  });
};

// Subscribe to Signed Agreements (status == "Signed")
export const subscribeToSignedAgreements = (callback: (agreements: any[]) => void) => {
  const q = query(
    collection(db, 'agreements'),
    where('status', '==', 'Signed'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const agreements: any[] = [];
    querySnapshot.forEach((doc) => {
      agreements.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(agreements);
  }, (error) => {
    console.error('Error subscribing to signed agreements:', error);
  });
};

// Subscribe to Active Work Orders (status == "In Progress")
export const subscribeToActiveWorkOrders = (callback: (workOrders: any[]) => void) => {
  const q = query(
    collection(db, 'workorders'),
    where('status', '==', 'In Progress'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const workOrders: any[] = [];
    querySnapshot.forEach((doc) => {
      workOrders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(workOrders);
  }, (error) => {
    console.error('Error subscribing to active work orders:', error);
  });
};

// Subscribe to all workflow stages combined
export const subscribeToWorkflowPipeline = (callback: (pipeline: {
  pendingAgreements: any[];
  signedAgreements: any[];
  activeWorkOrders: any[];
}) => void) => {
  let pendingAgreements: any[] = [];
  let signedAgreements: any[] = [];
  let activeWorkOrders: any[] = [];
  
  const updateCallback = () => {
    callback({
      pendingAgreements,
      signedAgreements,
      activeWorkOrders
    });
  };
  
  const unsubscribePending = subscribeToPendingAgreements((data) => {
    pendingAgreements = data;
    updateCallback();
  });
  
  const unsubscribeSigned = subscribeToSignedAgreements((data) => {
    signedAgreements = data;
    updateCallback();
  });
  
  const unsubscribeActive = subscribeToActiveWorkOrders((data) => {
    activeWorkOrders = data;
    updateCallback();
  });
  
  // Return combined unsubscribe function
  return () => {
    unsubscribePending();
    unsubscribeSigned();
    unsubscribeActive();
  };
};
