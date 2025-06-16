'use client';

import { useState } from 'react';
import CustomerLogin from '@/components/auth/CustomerLogin';
import CustomerRegister from '@/components/auth/CustomerRegister';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to home page or dashboard after successful auth
    router.push('/');
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">SM</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Sun Movement</h2>
          <p className="mt-2 text-gray-600">
            {mode === 'login' 
              ? 'Đăng nhập vào tài khoản của bạn' 
              : 'Tạo tài khoản mới để bắt đầu'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="mt-8">
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
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="text-sm text-gray-500">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Điều khoản dịch vụ
            </a>
            {' '}và{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Chính sách bảo mật
            </a>
            {' '}của chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}
