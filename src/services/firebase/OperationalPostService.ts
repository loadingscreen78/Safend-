/**
 * Operational Post Service
 * Syncs posts from Work Orders to Operations module
 */

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

const COLLECTION_NAME = 'operationalPosts';

export interface OperationalPost {
  id?: string;
  workOrderId: string;
  postCode: string;
  postName: string;
  clientName: string;
  companyName?: string;
  location: {
    address: string;
    digipin?: string;
    latitude?: number;
    longitude?: number;
  };
  type: 'permanent' | 'temporary';
  dutyType: '8H' | '12H';
  status: 'active' | 'inactive' | 'pending';
  requiredStaff: Array<{
    role: string;
    count: number;
    shift: string;
    startTime: string;
    endTime: string;
    days: string[];
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create operational post from work order
 */
export const createOperationalPost = async (post: Omit<OperationalPost, 'id'>) => {
  try {
    console.log('createOperationalPost: Creating post in Firebase...', post);
    
    const postData = {
      ...post,
      status: post.status || 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    console.log('createOperationalPost: Post data to save:', postData);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), postData);
    
    console.log('createOperationalPost: Post created successfully with ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('createOperationalPost: Error creating post:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Update operational post
 */
export const updateOperationalPost = async (id: string, post: Partial<OperationalPost>) => {
  try {
    const postRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(postRef, {
      ...post,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating operational post:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Delete operational post
 */
export const deleteOperationalPost = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting operational post:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Get all operational posts
 */
export const getOperationalPosts = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts: OperationalPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      } as OperationalPost);
    });
    
    return { success: true, data: posts };
  } catch (error) {
    console.error('Error getting operational posts:', error);
    return { success: false, error: (error as Error).message, data: [] };
  }
};

/**
 * Get posts by work order ID
 */
export const getPostsByWorkOrder = async (workOrderId: string) => {
  try {
    // Try with orderBy first
    const q = query(
      collection(db, COLLECTION_NAME),
      where('workOrderId', '==', workOrderId),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const posts: OperationalPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      } as OperationalPost);
    });
    
    return { success: true, data: posts };
  } catch (error) {
    console.warn('Error with indexed query, trying without orderBy:', error);
    
    // Fallback: query without orderBy if index doesn't exist
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('workOrderId', '==', workOrderId)
      );
      const querySnapshot = await getDocs(q);
      const posts: OperationalPost[] = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        } as OperationalPost);
      });
      
      return { success: true, data: posts };
    } catch (fallbackError) {
      console.error('Error getting posts by work order (fallback):', fallbackError);
      return { success: false, error: (fallbackError as Error).message, data: [] };
    }
  }
};

/**
 * Subscribe to real-time operational post updates
 */
export const subscribeToOperationalPosts = (callback: (posts: OperationalPost[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const posts: OperationalPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      } as OperationalPost);
    });
    callback(posts);
  }, (error) => {
    console.error('Error subscribing to operational posts:', error);
  });
};

/**
 * Sync posts from work order to operations
 * Called when work order is created/updated
 */
export const syncPostsFromWorkOrder = async (workOrder: any) => {
  try {
    const { id: workOrderId, client, companyName, posts } = workOrder;
    
    console.log('Syncing posts from work order:', { workOrderId, client, postCount: posts?.length });
    
    if (!workOrderId) {
      console.error('No work order ID provided');
      return { success: false, error: 'Work order ID is required' };
    }
    
    if (!posts || posts.length === 0) {
      console.log('No posts to sync');
      return { success: true, message: 'No posts to sync' };
    }

    // Get existing posts for this work order
    const existingPosts = await getPostsByWorkOrder(workOrderId);
    const existingPostCodes = new Set(existingPosts.data?.map(p => p.postCode) || []);
    
    console.log('Existing posts:', existingPostCodes.size);

    // Create or update posts
    for (const post of posts) {
      const operationalPost: Omit<OperationalPost, 'id'> = {
        workOrderId,
        postCode: post.code,
        postName: post.name,
        clientName: client || companyName || 'Unknown Client',
        companyName: companyName || client || 'Unknown Company',
        location: {
          address: post.location.address,
          digipin: post.location.digipin || '',
          latitude: post.location.latitude || 0,
          longitude: post.location.longitude || 0
        },
        type: post.type,
        dutyType: post.dutyType,
        status: 'active',
        requiredStaff: post.requiredStaff
      };

      console.log('Processing post:', post.code, post.name);
      
      if (existingPostCodes.has(post.code)) {
        // Update existing post
        const existingPost = existingPosts.data?.find(p => p.postCode === post.code);
        if (existingPost?.id) {
          console.log('Updating existing post:', post.code);
          await updateOperationalPost(existingPost.id, operationalPost);
        }
      } else {
        // Create new post
        console.log('Creating new post:', post.code);
        const result = await createOperationalPost(operationalPost);
        console.log('Post created:', result);
      }
    }

    console.log('All posts synced successfully');
    return { success: true, message: `${posts.length} post(s) synced successfully` };
  } catch (error) {
    console.error('Error syncing posts:', error);
    return { success: false, error: (error as Error).message };
  }
};
