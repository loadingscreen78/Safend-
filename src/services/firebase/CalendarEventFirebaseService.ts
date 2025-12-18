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
  setDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const COLLECTION_NAME = 'calendarEvents';

export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'contract' | 'compliance' | 'followup' | 'service';
  location?: string;
  attendees?: string[];
  description?: string;
  relatedId?: string; // quotationId, agreementId, or workOrderId
  createdAt?: Date;
  updatedAt?: Date;
}

// Add a new calendar event
export const addCalendarEvent = async (event: Omit<CalendarEvent, 'id'> & { id?: string }) => {
  try {
    const eventData = {
      ...event,
      start: Timestamp.fromDate(event.start),
      end: Timestamp.fromDate(event.end),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // If custom ID is provided, use setDoc
    if (event.id) {
      const customDocRef = doc(db, COLLECTION_NAME, event.id);
      await setDoc(customDocRef, eventData);
      return { success: true, id: event.id };
    } else {
      // Otherwise, let Firebase auto-generate ID
      const docRef = await addDoc(collection(db, COLLECTION_NAME), eventData);
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error('Error adding calendar event:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update an existing calendar event
export const updateCalendarEvent = async (id: string, event: Partial<CalendarEvent>) => {
  try {
    const eventRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = {
      ...event,
      updatedAt: Timestamp.now()
    };
    
    // Convert dates to Timestamps if present
    if (event.start) {
      updateData.start = Timestamp.fromDate(event.start);
    }
    if (event.end) {
      updateData.end = Timestamp.fromDate(event.end);
    }
    
    await updateDoc(eventRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete a calendar event
export const deleteCalendarEvent = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get all calendar events
export const getCalendarEvents = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('start', 'asc'));
    const querySnapshot = await getDocs(q);
    const events: CalendarEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        start: data.start?.toDate(),
        end: data.end?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as CalendarEvent);
    });
    
    return { success: true, data: events };
  } catch (error) {
    console.error('Error getting calendar events:', error);
    return { success: false, error: (error as Error).message, data: [] };
  }
};

// Subscribe to real-time calendar event updates
export const subscribeToCalendarEvents = (callback: (events: CalendarEvent[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('start', 'asc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const events: CalendarEvent[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        start: data.start?.toDate(),
        end: data.end?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as CalendarEvent);
    });
    callback(events);
  }, (error) => {
    console.error('Error subscribing to calendar events:', error);
  });
};
