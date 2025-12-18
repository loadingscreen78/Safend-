
import { SoundBus, SoundEvent } from "@/services/SoundService";
import { useEffect, useCallback, useState } from "react";

/**
 * Hook for easily using sound effects across the application
 * Provides convenient methods for playing different sound types with enhanced functionality
 */
export function useSoundEffect() {
  const [soundsReady, setSoundsReady] = useState(false);
  
  // Initialize sounds on first use
  useEffect(() => {
    // Check if sound files are properly loaded
    const checkSounds = async () => {
      try {
        // Try loading a test sound to verify system works
        const audio = new Audio('/sfx/ui_click.mp3');
        audio.volume = 0.01; // Very low volume for the test
        
        // Promise to check if sound can be played
        const canPlay = await new Promise((resolve) => {
          audio.oncanplaythrough = () => resolve(true);
          audio.onerror = () => resolve(false);
          audio.load();
          
          // Set a timeout in case loading hangs
          setTimeout(() => resolve(false), 2000);
        });
        
        setSoundsReady(Boolean(canPlay));
        
        if (!canPlay) {
          console.warn("Sound system may not be working properly. Fallback will be used.");
        }
      } catch (error) {
        console.warn("Error initializing sound system:", error);
        setSoundsReady(false);
      }
    };
    
    checkSounds();
  }, []);
  
  // Method to play welcome sound
  const playWelcome = useCallback(() => {
    SoundBus.play('welcome');
  }, []);

  // Method to play UI click sound
  const playClick = useCallback(() => {
    SoundBus.play('click');
  }, []);

  // Method to play success sound
  const playSuccess = useCallback(() => {
    SoundBus.play('success');
  }, []);

  // Method to play "add" sound
  const playAdd = useCallback(() => {
    SoundBus.play('add');
  }, []);

  // Method to play delete sound
  const playDelete = useCallback(() => {
    SoundBus.play('delete');
  }, []);

  // Method to play error sound
  const playError = useCallback(() => {
    SoundBus.play('error');
  }, []);

  // Method to play download complete sound
  const playDownload = useCallback(() => {
    SoundBus.play('download');
  }, []);

  // Method to play notification sound
  const playNotification = useCallback(() => {
    SoundBus.play('notification');
  }, []);

  // Generic method to play any sound with volume control
  const playSound = useCallback((sound: SoundEvent, volume?: number) => {
    if (volume !== undefined) {
      // Temporarily adjust volume for this sound
      const currentVolume = SoundBus.getVolume();
      SoundBus.setVolume(volume);
      SoundBus.play(sound);
      // Reset to previous volume
      setTimeout(() => SoundBus.setVolume(currentVolume), 100);
    } else {
      SoundBus.play(sound);
    }
  }, []);

  return {
    playWelcome,
    playClick,
    playSuccess,
    playAdd,
    playDelete,
    playError,
    playDownload,
    playNotification,
    playSound,
    soundsReady
  };
}
