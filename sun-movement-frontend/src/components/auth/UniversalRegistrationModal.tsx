'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import CustomerLogin from './CustomerLogin';
import CustomerRegister from './CustomerRegister';
import { Button } from '@/components/ui/button';
import { UserPlus, Mail, X } from 'lucide-react';

// Context for controlling registration modal globally
interface RegistrationModalContextType {
  openRegistrationModal: () => void;
  closeRegistrationModal: () => void;
  isOpen: boolean;
}

const RegistrationModalContext = createContext<RegistrationModalContextType>({
  openRegistrationModal: () => {},
  closeRegistrationModal: () => {},
  isOpen: false,
});

// Provider component
interface UniversalRegistrationProviderProps {
  children: ReactNode;
}

export const UniversalRegistrationProvider: React.FC<UniversalRegistrationProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('register');

  const openRegistrationModal = () => {
    setMode('register');
    setIsOpen(true);
  };

  const closeRegistrationModal = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    // Could trigger success callback here if needed
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');

  const contextValue: RegistrationModalContextType = {
    openRegistrationModal,
    closeRegistrationModal,
    isOpen,
  };

  return (
    <RegistrationModalContext.Provider value={contextValue}>
      {children}
      
      {/* Global Registration Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0 border-0 relative">
          {/* Custom close button */}
          <button
            onClick={closeRegistrationModal}
            className="absolute top-4 right-4 z-50 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
          
          <VisuallyHidden>
            <DialogTitle>
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            </DialogTitle>
          </VisuallyHidden>
          
          {mode === 'login' ? (
            <CustomerLogin
              onSuccess={handleSuccess}
              onSwitchToRegister={switchToRegister}
            />
          ) : (
            <CustomerRegister
              onSuccess={handleSuccess}
              onSwitchToLogin={switchToLogin}
            />
          )}
        </DialogContent>
      </Dialog>
    </RegistrationModalContext.Provider>
  );
};

// Hook to use the registration modal
export const useRegistrationModal = () => {
  const context = useContext(RegistrationModalContext);
  if (!context) {
    throw new Error('useRegistrationModal must be used within UniversalRegistrationProvider');
  }
  return context;
};

// Universal Registration Button component
interface UniversalRegistrationButtonProps {
  children?: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  iconType?: 'user' | 'mail';
  disabled?: boolean;
}

export const UniversalRegistrationButton: React.FC<UniversalRegistrationButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  iconType = 'user',
  disabled = false,
}) => {
  const { openRegistrationModal } = useRegistrationModal();

  const defaultText = children || 'Đăng ký';
  const icon = iconType === 'mail' ? <Mail className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />;

  return (
    <Button
      onClick={openRegistrationModal}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
    >
      {showIcon && (
        <span className="mr-2">
          {icon}
        </span>
      )}
      {defaultText}
    </Button>
  );
};

// Newsletter Registration Button - specifically for newsletter contexts
interface NewsletterRegistrationButtonProps {
  className?: string;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const NewsletterRegistrationButton: React.FC<NewsletterRegistrationButtonProps> = ({
  className = '',
  fullWidth = false,
  children,
}) => {
  const { openRegistrationModal } = useRegistrationModal();

  const buttonText = children || 'Đăng ký';

  return (
    <Button
      onClick={openRegistrationModal}
      className={`bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-none ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <Mail className="h-4 w-4 mr-2" />
      {buttonText}
    </Button>
  );
};

// CTA Registration Button - specifically for call-to-action sections
interface CTARegistrationButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  children?: ReactNode;
}

export const CTARegistrationButton: React.FC<CTARegistrationButtonProps> = ({
  className = '',
  size = 'lg',
  children,
}) => {
  const { openRegistrationModal } = useRegistrationModal();

  const buttonText = children || 'Đăng ký ngay';

  return (
    <Button
      onClick={openRegistrationModal}
      size={size}
      className={`bg-red-500 hover:bg-red-600 text-white font-medium ${className}`}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      {buttonText}
    </Button>
  );
};

// Header Registration Button - for header/navigation
interface HeaderRegistrationButtonProps {
  isMobile?: boolean;
  className?: string;
}

export const HeaderRegistrationButton: React.FC<HeaderRegistrationButtonProps> = ({
  isMobile = false,
  className = '',
}) => {
  const { openRegistrationModal } = useRegistrationModal();

  if (isMobile) {
    return (
      <Button 
        onClick={openRegistrationModal}
        size="sm" 
        className={`bg-red-600 hover:bg-red-700 text-white ${className}`}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Đăng ký
      </Button>
    );
  }

  return (
    <Button 
      onClick={openRegistrationModal}
      size="sm" 
      className={`bg-red-600 hover:bg-red-700 text-white ${className}`}
    >
      Đăng ký
    </Button>
  );
};

// Export the main components
export default UniversalRegistrationButton;
