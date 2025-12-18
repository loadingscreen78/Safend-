
import { Howl, Howler } from 'howler';
import { playFallbackSound } from './DefaultSoundService';

// Define the possible sound events
export type SoundEvent = 'welcome' | 'click' | 'success' | 'add' | 'delete' | 'error' | 'download' | 'notification';

// Sound configuration
interface SoundConfig {
  src: string[];
  volume: number;
  preload: boolean;
}

// Singleton class to manage sounds across the application
class SoundBusService {
  private sounds: Record<SoundEvent, Howl> = {} as Record<SoundEvent, Howl>;
  private enabled: boolean = true;
  private volume: number = 0.4; // Default to 40%
  private baseVolumes: Record<SoundEvent, number> = {} as Record<SoundEvent, number>;
  private soundsLoaded: Record<SoundEvent, boolean> = {} as Record<SoundEvent, boolean>;
  
  constructor() {
    // Initialize with default settings from localStorage or defaults
    this.loadSettings();
    this.initializeSounds();
    
    // Log initialization for debugging
    console.log("SoundBus initialized with settings:", { 
      enabled: this.enabled, 
      volume: this.volume 
    });
  }
  
  private loadSettings(): void {
    try {
      const storedSettings = localStorage.getItem('soundSettings');
      if (storedSettings) {
        const { enabled, volume } = JSON.parse(storedSettings);
        this.enabled = enabled !== undefined ? enabled : true;
        this.volume = volume !== undefined ? volume : 0.4;
      }
    } catch (error) {
      console.error("Failed to load sound settings", error);
      // Fall back to defaults
      this.enabled = true;
      this.volume = 0.4;
    }
  }
  
  private saveSettings(): void {
    try {
      localStorage.setItem('soundSettings', JSON.stringify({
        enabled: this.enabled,
        volume: this.volume
      }));
    } catch (error) {
      console.error("Failed to save sound settings", error);
    }
  }
  
  private initializeSounds(): void {
    // Define sound configurations
    const soundConfigs: Record<SoundEvent, SoundConfig> = {
      welcome: { 
        src: ['/sfx/welcome_chime.mp3', '/sfx/welcome_chime.ogg'], 
        volume: 0.5,
        preload: true
      },
      click: { 
        src: ['/sfx/ui_click.mp3', '/sfx/ui_click.ogg'], 
        volume: 0.4,
        preload: true
      },
      success: { 
        src: ['/sfx/positive_tick.mp3', '/sfx/positive_tick.ogg'], 
        volume: 0.5,
        preload: true
      },
      add: { 
        src: ['/sfx/positive_tick.mp3', '/sfx/positive_tick.ogg'], 
        volume: 0.5,
        preload: true
      },
      delete: { 
        src: ['/sfx/trash_swipe.mp3', '/sfx/trash_swipe.ogg'], 
        volume: 0.4,
        preload: true
      },
      error: { 
        src: ['/sfx/error_buzz.mp3', '/sfx/error_buzz.ogg'], 
        volume: 0.4,
        preload: true
      },
      download: { 
        src: ['/sfx/download_done.mp3', '/sfx/download_done.ogg'], 
        volume: 0.5,
        preload: false // Lazy load
      },
      notification: { 
        src: ['/sfx/notification.mp3', '/sfx/notification.ogg'], 
        volume: 0.5,
        preload: false // Lazy load
      }
    };
    
    // Initialize Howl instances for each sound
    Object.entries(soundConfigs).forEach(([event, config]) => {
      const adjustedVolume = config.volume * this.volume;
      this.baseVolumes[event as SoundEvent] = config.volume;
      this.soundsLoaded[event as SoundEvent] = false;
      
      this.sounds[event as SoundEvent] = new Howl({
        src: config.src,
        volume: adjustedVolume,
        preload: config.preload,
        onload: () => {
          this.soundsLoaded[event as SoundEvent] = true;
          console.log(`Sound loaded: ${event}`);
        },
        onloaderror: (id, error) => {
          console.warn(`Error loading sound ${event}:`, error);
          this.soundsLoaded[event as SoundEvent] = false;
        }
      });
    });
  }
  
  // Public methods
  
  play(event: SoundEvent): void {
    if (!this.enabled) return;
    
    const sound = this.sounds[event];
    if (sound) {
      // Check if the sound is loaded properly
      if (this.soundsLoaded[event]) {
        sound.volume(this.baseVolumes[event] * this.volume);
        sound.play();
      } else {
        // Use fallback sound if the real sound didn't load
        playFallbackSound(event);
      }
    } else {
      console.warn(`Sound for event "${event}" not found`);
      playFallbackSound('default');
    }
  }
  
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
    
    // Log for debugging
    console.log(`Sound effects ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
      // Play a subtle click to confirm the change
      this.play('click');
    }
  }
  
  isEnabled(): boolean {
    return this.enabled;
  }
  
  setVolume(volume: number): void {
    // Clamp volume between 0 and 1
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update all sound volumes
    Object.entries(this.sounds).forEach(([event, sound]) => {
      sound.volume(this.baseVolumes[event as SoundEvent] * this.volume);
    });
    
    this.saveSettings();
    
    // Log for debugging
    console.log(`Sound volume set to ${this.volume * 100}%`);
    
    // Play a test sound if enabled
    if (this.enabled && this.volume > 0) {
      this.play('click');
    }
  }
  
  getVolume(): number {
    return this.volume;
  }
}

// Export a singleton instance
export const SoundBus = new SoundBusService();
