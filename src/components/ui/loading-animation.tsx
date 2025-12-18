
import { motion } from "framer-motion";
import { UnifiedLoader } from "./unified-loader";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "red" | "white";
  showPercentage?: boolean;
  percentageValue?: number;
  className?: string;
}

export function LoadingAnimation({ 
  size = "md", 
  color = "primary",
  showPercentage = false,
  percentageValue,
  className
}: LoadingAnimationProps) {
  return (
    <UnifiedLoader
      size={size}
      variant="gauge"
      progress={showPercentage ? percentageValue : undefined}
      showProgress={showPercentage}
      className={className}
    />
  );
}

export function FullPageLoading({ percentageValue }: { percentageValue?: number }) {
  return (
    <UnifiedLoader
      variant="fullscreen"
      progress={percentageValue}
      message="Loading..."
    />
  );
}
