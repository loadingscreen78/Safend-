import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '@/config/firebase';

const COLLECTION_NAME = 'users';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
  location?: string;
  bio?: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create or update user profile
export const updateUserProfile = async (uid: string, profileData: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    const userDoc = await getDoc(userRef);
    
    const updateData = {
      ...profileData,
      uid,
      updatedAt: Timestamp.now()
    };
    
    if (!userDoc.exists()) {
      // Create new profile
      await setDoc(userRef, {
        ...updateData,
        createdAt: Timestamp.now()
      });
    } else {
      // Update existing profile
      await updateDoc(userRef, updateData);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get user profile
export const getUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        success: true,
        data: {
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserProfile
      };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Upload profile picture
export const uploadProfilePicture = async (uid: string, file: File) => {
  try {
    // Create a reference to the file location
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${uid}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-pictures/${fileName}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update user profile with new photo URL
    await updateUserProfile(uid, { photoURL: downloadURL });
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete profile picture
export const deleteProfilePicture = async (uid: string) => {
  try {
    await updateUserProfile(uid, { photoURL: '' });
    return { success: true };
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return { success: false, error: (error as Error).message };
  }
};
