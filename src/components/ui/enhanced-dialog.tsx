
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SoundBus } from "@/services/SoundService";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const EnhancedDialog = (props: React.ComponentProps<typeof BaseDialog>) => {
  const handleOpenChange = (open: boolean) => {
    // Play appropriate sound effect
    SoundBus.play(open ? 'notification' : 'click');
    
    // Call original onOpenChange if provided
    if (props.onOpenChange) {
      props.onOpenChange(open);
    }
  };
  
  return <BaseDialog {...props} onOpenChange={handleOpenChange} />;
};

export {
  EnhancedDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
};
