"use client";

import { useState, useCallback, Suspense } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './dialog';

// Modal skeleton component  
export const ModalSkeleton = () => (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4 p-6">
      <div className="space-y-4">
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
        <div className="flex justify-end space-x-2 mt-6">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

// Generic lazy modal wrapper
interface LazyModalProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  showSkeleton?: boolean;
}

export const LazyModal = ({ 
  children, 
  trigger, 
  className, 
  onOpenChange,
  showSkeleton = true 
}: LazyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open && !shouldRender) {
      setShouldRender(true);
    }
    onOpenChange?.(open);
  }, [shouldRender, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      {shouldRender && (
        <DialogContent className={className}>
          {showSkeleton ? (
            <Suspense fallback={<ModalSkeleton />}>
              {children}
            </Suspense>
          ) : (
            children
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

// Lazy modal with dynamic import support
interface LazyDynamicModalProps {
  importComponent: () => Promise<{ default: React.ComponentType<any> }>;
  trigger: React.ReactNode;
  componentProps?: any;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export const LazyDynamicModal = ({ 
  importComponent, 
  trigger, 
  componentProps, 
  className,
  onOpenChange 
}: LazyDynamicModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = useCallback(async (open: boolean) => {
    setIsOpen(open);
    
    if (open && !Component && !isLoading) {
      setIsLoading(true);
      try {
        const module = await importComponent();
        setComponent(() => module.default);
      } catch (error) {
        console.error('Failed to load modal component:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    onOpenChange?.(open);
  }, [Component, isLoading, importComponent, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      {(isLoading || Component) && (
        <DialogContent className={className}>
          {isLoading ? (
            <ModalSkeleton />
          ) : Component ? (
            <Component {...componentProps} />
          ) : null}
        </DialogContent>
      )}
    </Dialog>
  );
};
