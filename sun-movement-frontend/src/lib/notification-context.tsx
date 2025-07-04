"use client";

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useToast } from '@/components/ui/simple-toast';

interface NotificationContextType {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
