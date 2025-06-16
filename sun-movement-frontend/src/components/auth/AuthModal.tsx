'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import CustomerLogin from './CustomerLogin';
import CustomerRegister from './CustomerRegister';

interface AuthModalProps {
  children: React.ReactNode;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export default function AuthModal({ children, defaultMode = 'login', onSuccess }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccess?.();
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 border-0">
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
  );
}
