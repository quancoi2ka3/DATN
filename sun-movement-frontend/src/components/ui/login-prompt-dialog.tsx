"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserRoundIcon, ArrowRight, LogIn, UserPlus } from "lucide-react";
import CustomerLogin from "@/components/auth/CustomerLogin";
import CustomerRegister from "@/components/auth/CustomerRegister";

interface LoginPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
  returnUrl?: string;
}

export function LoginPromptDialog({
  isOpen,
  onOpenChange,
  message = "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
  returnUrl = window.location.pathname
}: LoginPromptDialogProps) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenLogin = () => {
    setAuthMode('login');
    setShowAuthForm(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setShowAuthForm(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthForm(false);
    onOpenChange(false);
    // Don't reload or redirect - just close the dialog
    // The user will stay on the current page (sportswear/supplements)
    // and can continue their actions (add to cart, view details, etc.)
  };

  const handleBackToPrompt = () => {
    setShowAuthForm(false);
  };

  if (showAuthForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] border-2 border-primary/10 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {authMode === 'login' ? (
              <CustomerLogin
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <CustomerRegister
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={handleBackToPrompt}
              className="w-full sm:w-auto"
            >
              ← Quay lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-2 border-primary/10 shadow-lg">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <UserRoundIcon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center">Đăng nhập để tiếp tục</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Button 
            onClick={handleOpenLogin} 
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90" 
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập ngay
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleOpenRegister} 
            className="flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Tạo tài khoản mới
          </Button>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Để sau
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
