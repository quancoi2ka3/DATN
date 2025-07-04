'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import LoginErrorHelper from './LoginErrorHelper';

interface CustomerLoginProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export default function CustomerLogin({ onSuccess, onSwitchToRegister }: CustomerLoginProps) {
  const { login, redirectAfterLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorHelper, setShowErrorHelper] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error when user types
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    return true;
  };  const checkUserStatus = async (email: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/check-user-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        // Store remember me preference if needed
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Call success callback first
        onSuccess?.();
        
        // Only redirect if no success callback is provided (standalone login page)
        // If callback exists, it means we're in a dialog/modal and should not redirect
        if (!onSuccess) {
          redirectAfterLogin('/');
        }
      } else {
        // Check user status to provide more specific error message
        const userStatus = await checkUserStatus(formData.email);
          if (userStatus) {
          if (!userStatus.userExists) {
            if (userStatus.hasVerificationPending) {
              setUserEmail(formData.email);
              setShowErrorHelper(true);
              setError('');
            } else {
              setError('Email chưa được đăng ký. Vui lòng đăng ký tài khoản trước.');
            }
          } else if (!userStatus.emailConfirmed) {
            setUserEmail(formData.email);
            setShowErrorHelper(true);
            setError('');
          } else {
            setError('Mật khẩu không đúng. Vui lòng thử lại.');
          }
        } else {
          setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }  };

  // Show error helper if needed
  if (showErrorHelper && userEmail) {
    return (
      <LoginErrorHelper 
        email={userEmail}
        onResendVerification={() => {
          // Could add success callback here
        }}
        onSwitchToRegister={onSwitchToRegister}
        onClose={() => {
          setShowErrorHelper(false);
          setUserEmail('');
        }}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
        <CardDescription className="text-center">
          Đăng nhập để trải nghiệm đầy đủ dịch vụ của chúng tôi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nhap@email.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, rememberMe: !!checked }))
                }
              />
              <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                Ghi nhớ đăng nhập
              </Label>
            </div>
            
            <a 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Quên mật khẩu?
            </a>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>

          {onSwitchToRegister && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
