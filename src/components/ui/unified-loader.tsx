import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UnifiedLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gauge' | 'minimal' | 'button' | 'fullscreen';
  progress?: number; // 0-100 for determinate loading
  showProgress?: boolean;
  className?: string;
  message?: string;
}

export function UnifiedLoader({
  size = 'md',
  variant = 'gauge',
  progress,
  showProgress = false,
  className,
  message
}: UnifiedLoaderProps) {
  // Size configurations
  const sizeConfig = {
    xs: { diameter: 16, strokeWidth: 2, fontSize: 'text-xs' },
    sm: { diameter: 24, strokeWidth: 3, fontSize: 'text-sm' },
    md: { diameter: 40, strokeWidth: 4, fontSize: 'text-base' },
    lg: { diameter: 64, strokeWidth: 6, fontSize: 'text-lg' },
    xl: { diameter: 96, strokeWidth: 8, fontSize: 'text-xl' }
  };

  const config = sizeConfig[size];

  if (variant === 'gauge' && (progress !== undefined || showProgress)) {
    return <GaugeLoader {...{ progress, size, className, message }} />;
  }

  if (variant === 'minimal') {
    return <MinimalLoader {...{ size, className }} />;
  }

  if (variant === 'button') {
    return <ButtonLoader {...{ size, className }} />;
  }

  if (variant === 'fullscreen') {
    return <FullscreenLoader {...{ progress, message, className }} />;
  }

  // Default gauge without progress
  return <GaugeLoader {...{ size, className, message }} />;
}

// Gauge-style loader (primary style)
function GaugeLoader({ 
  progress, 
  size = 'md', 
  className, 
  message 
}: { 
  progress?: number; 
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; 
  className?: string; 
  message?: string; 
}) {
  const sizeMap = { xs: 32, sm: 48, md: 64, lg: 96, xl: 128 };
  const diameter = sizeMap[size];
  const radius = (diameter - 8) / 2;
  const circumference = Math.PI * radius; // Half circle
  
  // If no progress provided, use infinite animation
  const isIndeterminate = progress === undefined;
  const strokeDashoffset = isIndeterminate 
    ? circumference * 0.7 // Show partial arc for spinning
    : circumference - (progress / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative" style={{ width: diameter, height: diameter / 2 + 20 }}>
        <svg
          width={diameter}
          height={diameter / 2 + 20}
          className="transform"
          style={{ overflow: 'visible' }}
        >
          {/* Background arc */}
          <path
            d={`M 4 ${diameter / 2} A ${radius} ${radius} 0 0 1 ${diameter - 4} ${diameter / 2}`}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Animated arc */}
          <path
            d={`M 4 ${diameter / 2} A ${radius} ${radius} 0 0 1 ${diameter - 4} ${diameter / 2}`}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(180 ${diameter / 2} ${diameter / 2})`}
            className={isIndeterminate 
              ? 'animate-spin origin-center' 
              : 'transition-all duration-1000 ease-out'
            }
            style={isIndeterminate ? {
              animation: 'spin 2s linear infinite',
              transformOrigin: `${diameter / 2}px ${diameter / 2}px`
            } : undefined}
          />
        </svg>
        
        {/* Center display */}
        {(progress !== undefined || message) && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
            {progress !== undefined && (
              <div className="text-sm font-bold text-foreground">
                {Math.round(progress)}%
              </div>
            )}
            {message && (
              <div className="text-xs text-muted-foreground mt-1">
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Minimal spinner for small spaces
function MinimalLoader({ 
  size = 'md', 
  className 
}: { 
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; 
  className?: string; 
}) {
  const sizeMap = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 };
  const diameter = sizeMap[size];

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div 
        className="border-2 border-primary border-t-transparent rounded-full animate-spin"
        style={{ width: diameter, height: diameter }}
      />
    </div>
  );
}

// Button loader for form submissions
function ButtonLoader({ 
  size = 'sm', 
  className 
}: { 
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; 
  className?: string; 
}) {
  const sizeMap = { xs: 10, sm: 12, md: 16, lg: 20, xl: 24 };
  const diameter = sizeMap[size];

  return (
    <div className={cn('inline-flex items-center', className)}>
      <div 
        className="border-2 border-current border-t-transparent rounded-full animate-spin"
        style={{ width: diameter, height: diameter }}
      />
    </div>
  );
}

// Fullscreen overlay loader
function FullscreenLoader({ 
  progress, 
  message, 
  className 
}: { 
  progress?: number; 
  message?: string; 
  className?: string; 
}) {
  return (
    <div className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
      className
    )}>
      <div className="text-center">
        <GaugeLoader 
          progress={progress} 
          size="xl" 
          className="mb-4"
        />
        <motion.p 
          className="text-lg font-medium text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {message || 'Loading...'}
        </motion.p>
      </div>
    </div>
  );
}

// Export individual components for specific use cases
export { GaugeLoader, MinimalLoader, ButtonLoader, FullscreenLoader };