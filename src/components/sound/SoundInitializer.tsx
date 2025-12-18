
import { useEffect, useState } from "react";
import { SoundBus } from "@/services/SoundService";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

export function SoundInitializer() {
  const [soundsReady, setSoundsReady] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Create dummy audio elements to check if sound files exist
    const soundFiles = [
      '/sfx/ui_click.mp3',
      '/sfx/success.mp3',
      '/sfx/error_buzz.mp3',
      '/sfx/notification.mp3'
    ];
    
    // Create temp audio elements to check if sound files exist
    Promise.all(
      soundFiles.map(file => {
        return new Promise((resolve) => {
          const audio = new Audio(file);
          audio.addEventListener('canplaythrough', () => {
            resolve(true);
          });
          audio.addEventListener('error', () => {
            resolve(false);
          });
          // Just load metadata, don't play
          audio.load();
          // Set a timeout in case the file doesn't exist
          setTimeout(() => resolve(false), 2000);
        });
      })
    ).then((results) => {
      const allFilesExist = results.every(result => result === true);
      setSoundsReady(allFilesExist);
      
      if (!allFilesExist) {
        toast({
          title: "Sound Effects",
          description: "Some sound effects couldn't be loaded. Sound features may be limited.",
          variant: "default",
          action: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        });
        
        console.warn("Some sound files couldn't be loaded. Sound functionality may be limited.");
      } else {
        // Initialize with a welcome sound (but delayed so it doesn't play immediately on page load)
        setTimeout(() => {
          SoundBus.play('welcome');
        }, 1000);
      }
    });
  }, [toast]);
  
  // This component doesn't render anything
  return null;
}
