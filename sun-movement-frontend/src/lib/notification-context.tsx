"use client";

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { toast as hookToast } from '@/hooks/use-toast';

interface NotificationContextType {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const showSuccess = useCallback((message: string, title = "Thành công") => {
    hookToast({
      variant: "success",
      title,
      description: message,
    });
  }, []);

  const showError = useCallback((message: string, title = "Lỗi") => {
    hookToast({
      variant: "destructive",
      title,
      description: message,
    });
  }, []);

  const showWarning = useCallback((message: string, title = "Cảnh báo") => {
    hookToast({
      variant: "warning",
      title,
      description: message,
    });
  }, []);

  const showInfo = useCallback((message: string, title = "Thông tin") => {
    hookToast({
      variant: "info",
      title,
      description: message,
    });
  }, []);

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
