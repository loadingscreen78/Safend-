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
import { addCalendarEvent } from './CalendarEventFirebaseService';

const COLLECTION_NAME = 'followups';

export interface Followup {
  id?: string;
  contact: string;
  company: string;
  type: string;
  dateTime: string;
  subject: string;
  status: string;
  priority?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Add a new follow-up
export const addFollowup = async (followup: Omit<Followup, 'id'>) => {
  try {
    const followupData = {
      ...followup,
      priority: followup.priority || 'Medium',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), followupData);
    const followupId = docRef.id;
    
    // Create a calendar event for this follow-up
    const followupDate = new Date(followup.dateTime);
    const followupEndDate = new Date(followupDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    await addCalendarEvent({
      id: `followup-${followupId}`,
      title: `${followup.type}: ${followup.contact}`,
      start: followupDate,
      end: followupEndDate,
      type: 'followup',
      description: followup.subject,
      relatedId: followupId,
      attendees: [followup.contact]
    });
    
    return { success: true, id: followupId };
  } catch (error) {
    console.error('Error adding follow-up:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update an existing follow-up
export const updateFollowup = async (id: string, followup: Partial<Followup>) => {
  try {
    const followupRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(followupRef, {
      ...followup,
      updatedAt: Timestamp.now()
    });
    
    // Update the calendar event if dateTime or other relevant fields changed
    if (followup.dateTime || followup.subject || followup.type || followup.contact) {
      const { updateCalendarEvent } = await import('./CalendarEventFirebaseService');
      const calendarEventId = `followup-${id}`;
      
      const updateData: any = {};
      
      if (followup.dateTime) {
        const followupDate = new Date(followup.dateTime);
        const followupEndDate = new Date(followupDate.getTime() + 60 * 60 * 1000);
        updateData.start = followupDate;
        updateData.end = followupEndDate;
      }
      
      if (followup.type || followup.contact) {
        updateData.title = `${followup.type || 'Follow-up'}: ${followup.contact || 'Client'}`;
      }
      
      if (followup.subject) {
        updateData.description = followup.subject;
      }
      
      if (followup.contact) {
        updateData.attendees = [followup.contact];
      }
      
      await updateCalendarEvent(calendarEventId, updateData);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating follow-up:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete a follow-up
export const deleteFollowup = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    
    // Delete the associated calendar event
    const { deleteCalendarEvent } = await import('./CalendarEventFirebaseService');
    const calendarEventId = `followup-${id}`;
    await deleteCalendarEvent(calendarEventId);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting follow-up:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get all follow-ups
export const getFollowups = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('dateTime', 'desc'));
    const querySnapshot = await getDocs(q);
    const followups: Followup[] = [];
    
    querySnapshot.forEach((doc) => {
      followups.push({
        id: doc.id,
        ...doc.data()
      } as Followup);
    });
    
    return { success: true, data: followups };
  } catch (error) {
    console.error('Error getting follow-ups:', error);
    return { success: false, error: (error as Error).message, data: [] };
  }
};

// Subscribe to real-time follow-up updates
export const subscribeToFollowups = (callback: (followups: Followup[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('dateTime', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const followups: Followup[] = [];
    querySnapshot.forEach((doc) => {
      followups.push({
        id: doc.id,
        ...doc.data()
      } as Followup);
    });
    callback(followups);
  }, (error) => {
    console.error('Error subscribing to follow-ups:', error);
  });
};
