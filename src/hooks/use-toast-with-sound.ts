
import { toast } from "@/hooks/use-toast";
import { SoundBus, SoundEvent } from "@/services/SoundService";
import type { ToastActionElement } from "@/hooks/use-toast";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { useCallback } from "react";

// Define our own ToastProps based on what's used
type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
};

type SoundToastOptions = ToastProps & {
  sound?: SoundEvent;
};

// Define the return type for the toast function with its methods
interface SoundToast {
  (options: SoundToastOptions): { id: string; dismiss: () => void; update: (props: any) => void };
  success: (options: Omit<SoundToastOptions, 'sound' | 'variant'>) => { id: string; dismiss: () => void; update: (props: any) => void };
  error: (options: Omit<SoundToastOptions, 'sound' | 'variant'>) => { id: string; dismiss: () => void; update: (props: any) => void };
  warning: (options: Omit<SoundToastOptions, 'sound' | 'variant'>) => { id: string; dismiss: () => void; update: (props: any) => void };
  info: (options: Omit<SoundToastOptions, 'sound'>) => { id: string; dismiss: () => void; update: (props: any) => void };
}

export function useToastWithSound() {
  const soundToast = useCallback((options: SoundToastOptions) => {
    // Play sound if specified (default to 'notification')
    const sound = options.sound || 'notification';
    SoundBus.play(sound);
    
    // Call original toast
    return toast(options);
  }, []);

  // Create a toast object with helper methods
  const soundToastWithHelpers: SoundToast = Object.assign(
    soundToast,
    {
      success: (options: Omit<SoundToastOptions, 'sound' | 'variant'>) => 
        soundToast({ ...options, sound: 'success', variant: 'default' }),
      error: (options: Omit<SoundToastOptions, 'sound' | 'variant'>) => 
        soundToast({ ...options, sound: 'error', variant: 'destructive' }),
      warning: (options: Omit<SoundToastOptions, 'sound' | 'variant'>) => 
        soundToast({ ...options, sound: 'notification', variant: 'default' }),
      info: (options: Omit<SoundToastOptions, 'sound'>) => 
        soundToast({ ...options, sound: 'notification' }),
    }
  );

  return {
    toast: soundToastWithHelpers
  };
}
