
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Your Firebase configuration
// Replace with your actual Firebase config when deploying
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Authentication services
export const firebaseAuth = {
  signIn: (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },
  signUp: (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },
  signOut: () => signOut(auth),
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
  currentUser: () => auth.currentUser
};

// Firestore database services
export const firebaseDB = {
  // Collection operations
  getCollection: async (collectionName: string) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
  
  queryCollection: async (
    collectionName: string, 
    fieldPath: string, 
    operator: any, 
    value: any,
    orderByField?: string,
    orderDirection?: 'asc' | 'desc'
  ) => {
    let q = query(collection(db, collectionName), where(fieldPath, operator, value));
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || 'asc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
  
  // Document operations
  getDocument: async (collectionName: string, documentId: string) => {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  },
  
  addDocument: (collectionName: string, data: any) => {
    return addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now()
    });
  },
  
  updateDocument: (collectionName: string, documentId: string, data: any) => {
    const docRef = doc(db, collectionName, documentId);
    return updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },
  
  deleteDocument: (collectionName: string, documentId: string) => {
    const docRef = doc(db, collectionName, documentId);
    return deleteDoc(docRef);
  }
};

// Storage services
export const firebaseStorage = {
  uploadFile: async (path: string, file: File) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },
  
  getFileUrl: (path: string) => {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }
};

// Cloud Functions
export const firebaseFunctions = {
  callFunction: (functionName: string, data: any) => {
    const functionRef = httpsCallable(functions, functionName);
    return functionRef(data);
  }
};

// Timestamp utility
export const timestamp = {
  now: Timestamp.now,
  fromDate: (date: Date) => Timestamp.fromDate(date),
  toDate: (timestamp: Timestamp) => timestamp.toDate()
};

// Export the Firebase instances for advanced usage
export { app, auth, db, storage, functions };
