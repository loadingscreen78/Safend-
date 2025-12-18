// Firebase auth wrapper to replace Supabase client
// This maintains the same API structure for easier migration
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

// Wrapper to maintain Supabase-like API
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
          data: { user: userCredential.user, session: { user: userCredential.user } },
          error: null
        };
      } catch (error: any) {
        return {
          data: { user: null, session: null },
          error: { message: error.message }
        };
      }
    },
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document in Firestore with default role
        const userDoc = {
          email: userCredential.user.email,
          roles: ['admin'], // Default role for new users
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
        
        return {
          data: { user: userCredential.user, session: { user: userCredential.user } },
          error: null
        };
      } catch (error: any) {
        return {
          data: { user: null, session: null },
          error: { message: error.message }
        };
      }
    },
    signOut: async ({ scope }: { scope?: string } = {}) => {
      try {
        await firebaseSignOut(auth);
        return { error: null };
      } catch (error: any) {
        return { error: { message: error.message } };
      }
    },
    getSession: async () => {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            resolve({
              data: { session: { user } },
              error: null
            });
          } else {
            resolve({
              data: { session: null },
              error: null
            });
          }
        });
      });
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          callback('SIGNED_IN', { user });
        } else {
          callback('SIGNED_OUT', null);
        }
      });
      return {
        data: {
          subscription: {
            unsubscribe
          }
        }
      };
    }
  },
  // Firestore-based role management
  rpc: async (functionName: string, params?: any) => {
    if (functionName === 'get_user_roles') {
      try {
        const user = auth.currentUser;
        if (!user) {
          return { data: [], error: null };
        }
        
        // Check if this is the permanent admin
        if (user.email === 'safendadmin@mail.com') {
          return { data: ['admin'], error: null };
        }
        
        // Fetch user roles from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return { data: userData.roles || [], error: null };
        } else {
          // No document means no access
          return { data: [], error: null };
        }
      } catch (error: any) {
        console.error('Error fetching user roles:', error);
        return { data: [], error: null };
      }
    }
    return { data: null, error: { message: 'Function not implemented' } };
  }
};