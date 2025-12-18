
import * as React from "react";
import { Button as BaseButton, ButtonProps } from "@/components/ui/button";
import { SoundBus } from "@/services/SoundService";

export interface EnhancedButtonProps extends ButtonProps {
  soundEffect?: 'click' | 'add' | 'success' | 'delete' | 'error' | 'download' | 'notification' | null;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ soundEffect = 'click', onClick, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Play sound if specified
      if (soundEffect) {
        SoundBus.play(soundEffect);
      }
      
      // Call original onClick if provided
      if (onClick) {
        onClick(event);
      }
    };

    return <BaseButton ref={ref} onClick={handleClick} {...props} />;
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
