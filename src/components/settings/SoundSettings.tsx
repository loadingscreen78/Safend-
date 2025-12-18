
import { useState, useEffect } from "react";
import { SoundBus } from "@/services/SoundService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, Volume1, VolumeX } from "lucide-react";

export function SoundSettings() {
  const [enabled, setEnabled] = useState(SoundBus.isEnabled());
  const [volume, setVolume] = useState(SoundBus.getVolume() * 100);

  useEffect(() => {
    // Update component state if settings change elsewhere
    setEnabled(SoundBus.isEnabled());
    setVolume(SoundBus.getVolume() * 100);
  }, []);

  const handleToggleSound = (checked: boolean) => {
    SoundBus.setEnabled(checked);
    setEnabled(checked);
    if (checked) {
      SoundBus.play('click');
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    SoundBus.setVolume(newVolume);
    setVolume(value[0]);
    
    // Play a sample sound when adjusting volume (if enabled)
    if (enabled) {
      SoundBus.play('click');
    }
  };

  const VolumeIcon = () => {
    if (volume === 0 || !enabled) return <VolumeX className="h-4 w-4" />;
    if (volume < 50) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  const handleTestSounds = () => {
    if (!enabled) return;
    
    // Play a sequence of test sounds with a delay between each
    const sounds = ['click', 'add', 'success', 'delete', 'error', 'notification', 'download'];
    
    sounds.forEach((sound, index) => {
      setTimeout(() => {
        SoundBus.play(sound as any);
      }, index * 800); // 800ms delay between sounds
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Sound Effects</Label>
          <p className="text-sm text-muted-foreground">
            Enable sound effects for interactions
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggleSound} />
      </div>
      
      <div className={`space-y-2 ${!enabled ? 'opacity-50' : ''}`}>
        <div className="flex justify-between">
          <Label className="text-base">Volume</Label>
          <span className="flex items-center gap-2">
            <VolumeIcon /> {Math.round(volume)}%
          </span>
        </div>
        <Slider 
          defaultValue={[volume]} 
          max={100} 
          step={1} 
          disabled={!enabled}
          onValueChange={handleVolumeChange} 
        />
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        disabled={!enabled}
        onClick={handleTestSounds}
        className="w-full"
      >
        Test Sound Effects
      </Button>
    </div>
  );
}
