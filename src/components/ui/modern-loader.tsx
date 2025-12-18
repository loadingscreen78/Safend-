import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'dual-ring' | 'skeleton' | 'pulse';
  className?: string;
  message?: string;
}

export function ModernLoader({
  size = 'md',
  variant = 'dual-ring',
  className,
  message
}: ModernLoaderProps) {
  const sizeConfig = {
    xs: { size: 16, strokeWidth: 2 },
    sm: { size: 24, strokeWidth: 3 },
    md: { size: 32, strokeWidth: 4 },
    lg: { size: 48, strokeWidth: 6 }
  };

  const config = sizeConfig[size];

  if (variant === 'dual-ring') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <div className="relative" style={{ width: config.size, height: config.size }}>
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-2 border-primary/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ borderTopColor: 'hsl(var(--primary))' }}
          />
          {/* Inner ring */}
          <motion.div
            className="absolute inset-1 border-2 border-accent/50 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ borderBottomColor: 'hsl(var(--accent))' }}
          />
        </div>
        {message && (
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        <SkeletonLoader />
        {message && (
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <motion.div
          className="w-8 h-8 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  return null;
}

function SkeletonLoader() {
  return (
    <div className="space-y-3">
      <motion.div
        className="h-4 bg-muted rounded animate-pulse"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="h-4 bg-muted rounded animate-pulse w-3/4"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="h-4 bg-muted rounded animate-pulse w-1/2"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

// Centered loader for content areas
export function CenteredLoader({
  size = 'md',
  variant = 'dual-ring',
  message = 'Loading...',
  className
}: ModernLoaderProps) {
  return (
    <div className={cn(
      'flex items-center justify-center min-h-[200px] w-full',
      className
    )}>
      <ModernLoader size={size} variant={variant} message={message} />
    </div>
  );
}