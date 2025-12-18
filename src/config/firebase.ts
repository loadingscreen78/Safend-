// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk0XR-n2dSeIKTWblpe5CJwV146l80Ffs",
  authDomain: "testsafend-eca71.firebaseapp.com",
  projectId: "testsafend-eca71",
  storageBucket: "testsafend-eca71.firebasestorage.app",
  messagingSenderId: "987410813131",
  appId: "1:987410813131:web:7508e0a201baa7289b4b4e",
  measurementId: "G-5YRB7TJHP3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;
