
import React, { createContext, useContext, useState } from 'react';

interface FirebaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  firebaseUser: any | null;
  loadingUser: boolean;
  refreshUserData: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isInitialized] = useState(true);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [loadingUser] = useState(false);

  const refreshUserData = async () => {
    // Mock implementation for frontend-only
  };

  const signIn = async (email: string, password: string) => {
    const user = { email, uid: 'demo-user' };
    setFirebaseUser(user);
    localStorage.setItem('firebaseUser', JSON.stringify(user));
  };

  const signUp = async (email: string, password: string) => {
    const user = { email, uid: 'demo-user-' + Date.now() };
    setFirebaseUser(user);
    localStorage.setItem('firebaseUser', JSON.stringify(user));
  };

  const signOut = async () => {
    setFirebaseUser(null);
    localStorage.removeItem('firebaseUser');
  };

  return (
    <FirebaseContext.Provider 
      value={{ 
        isInitialized, 
        isLoading, 
        error, 
        firebaseUser, 
        loadingUser,
        refreshUserData,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
