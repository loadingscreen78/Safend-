// Firebase User Management Utilities
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export interface FirebaseUser {
  uid: string;
  email: string;
  name: string;
  roles: string[];
  branch: string;
  branchId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastActive?: string;
}

// Create a new user in Firebase Auth and Firestore
export const createFirebaseUser = async (
  email: string,
  password: string,
  userData: Omit<FirebaseUser, 'uid' | 'createdAt'>
): Promise<{ success: boolean; uid?: string; error?: string }> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Create user document in Firestore
    const userDoc: FirebaseUser = {
      uid,
      email,
      ...userData,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', uid), userDoc);

    return { success: true, uid };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};

// Get all users from Firestore
export const getAllUsers = async (): Promise<FirebaseUser[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    
    return snapshot.docs.map(doc => doc.data() as FirebaseUser);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get user by UID
export const getUserByUid = async (uid: string): Promise<FirebaseUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as FirebaseUser;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Update user data in Firestore
export const updateFirebaseUser = async (
  uid: string,
  updates: Partial<FirebaseUser>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};

// Delete user from Firestore (Note: Firebase Auth deletion requires admin SDK)
export const deleteFirebaseUser = async (uid: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, 'users', uid));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

// Update user roles
export const updateUserRoles = async (
  uid: string,
  roles: string[]
): Promise<{ success: boolean; error?: string }> => {
  return updateFirebaseUser(uid, { roles });
};

// Get users by role
export const getUsersByRole = async (role: string): Promise<FirebaseUser[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('roles', 'array-contains', role));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => doc.data() as FirebaseUser);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return [];
  }
};

// Generate a random password
export const generatePassword = (): string => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
