"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toastData: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastMessage = {
      ...toastData,
      id,
      duration: toastData.duration || 5000,
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }, [removeToast]);

  const showSuccess = useCallback((message: string, title = "Thành công") => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showError = useCallback((message: string, title = "Lỗi") => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const showWarning = useCallback((message: string, title = "Cảnh báo") => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showInfo = useCallback((message: string, title = "Thông tin") => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const getToastIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getToastStyles = (type: ToastMessage['type']) => {
    const baseStyles = "fixed top-4 right-4 z-[9999] max-w-sm w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500 bg-green-50 dark:bg-green-900/20`;
      case 'error':
        return `${baseStyles} border-red-500 bg-red-50 dark:bg-red-900/20`;
      case 'warning':
        return `${baseStyles} border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20`;
      case 'info':
        return `${baseStyles} border-blue-500 bg-blue-50 dark:bg-blue-900/20`;
      default:
        return baseStyles;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={getToastStyles(toast.type)}
            style={{
              top: `${16 + index * 80}px`,
              animation: 'slideInRight 0.3s ease-out',
            }}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex items-start gap-3">
              {getToastIcon(toast.type)}
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {toast.title}
                  </h4>
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Đóng thông báo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .toast-container {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 9999;
          pointer-events: none;
        }
        
        .toast-container > div {
          pointer-events: auto;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
