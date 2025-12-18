
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SoundBus, SoundEvent } from '@/services/SoundService';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface SoundContextType {
  soundEffects: ReturnType<typeof useSoundEffect>;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundEffectsProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const soundEffects = useSoundEffect();
  
  // Initialize sound settings from SoundBus
  useEffect(() => {
    setIsSoundEnabled(SoundBus.isEnabled());
  }, []);

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    SoundBus.setEnabled(newState);
    setIsSoundEnabled(newState);
    
    // Play a sound when enabling sounds
    if (newState) {
      soundEffects.playClick();
    }
  };

  const setVolume = (volume: number) => {
    SoundBus.setVolume(volume);
  };

  const getVolume = () => {
    return SoundBus.getVolume();
  };

  return (
    <SoundContext.Provider value={{ 
      soundEffects, 
      isSoundEnabled, 
      toggleSound, 
      setVolume, 
      getVolume 
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundContext must be used within a SoundEffectsProvider');
  }
  return context;
}
