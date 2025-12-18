import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
interface ModuleHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}
export function ModuleHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction
}: ModuleHeaderProps) {
  return <div className="flex justify-between items-center mb-6">
      <div>
        <motion.h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent" initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }}>
          {title}
        </motion.h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      {actionLabel && <motion.div initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      delay: 0.3
    }}>
          
        </motion.div>}
    </div>;
}