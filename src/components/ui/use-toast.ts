
// This file properly exports toast and useToast from the hook for other components to use
import { useToast, toast } from "@/hooks/use-toast";
import type { ToastActionElement } from "@/hooks/use-toast";

export { useToast, toast };
export type { ToastActionElement };
