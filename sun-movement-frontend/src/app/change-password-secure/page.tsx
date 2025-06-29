'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Shield, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordSecurePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validate email matches user's email
    if (email !== user?.email) {
      setError('Email không khớp với email tài khoản của bạn');
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.');
        setIsSuccess(true);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu.');
      }
    } catch (error) {
      console.error('Secure change password error:', error);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Email đã được gửi!
            </CardTitle>
            <CardDescription>
              Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/profile">
                  Quay lại thông tin cá nhân
                </Link>
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Chưa nhận được email?{' '}
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setIsSuccess(false)}
                  className="p-0 h-auto"
                >
                  Gửi lại
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại thông tin cá nhân
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Đổi mật khẩu bảo mật</h1>
          <p className="text-gray-600 mt-2">Đổi mật khẩu qua email để đảm bảo bảo mật tối đa</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Xác thực qua Email
            </CardTitle>
            <CardDescription>
              Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email của bạn để đảm bảo bảo mật.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="email">Xác nhận email của bạn *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email để xác nhận"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="text-sm text-gray-500">
                  Email hiện tại: <strong>{user?.email}</strong>
                </div>
              </div>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Lưu ý bảo mật:</div>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Email đặt lại mật khẩu có hiệu lực trong 15 phút</li>
                      <li>• Link đặt lại chỉ sử dụng được 1 lần</li>
                      <li>• Đăng xuất khỏi tất cả thiết bị sau khi đổi mật khẩu</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Success/Error Messages */}
              {message && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  {isLoading ? 'Đang gửi email...' : 'Gửi email đặt lại mật khẩu'}
                </Button>
                <Button type="button" variant="outline" asChild className="flex-1">
                  <Link href="/change-password">
                    Đổi mật khẩu thường
                  </Link>
                </Button>
              </div>

              {/* Alternative Options */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tùy chọn khác</h3>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <span className="font-medium">Biết mật khẩu hiện tại?</span>{' '}
                    <Link href="/change-password" className="text-blue-600 hover:underline">
                      Đổi mật khẩu trực tiếp
                    </Link>
                  </p>
                  <p>
                    <span className="font-medium">Gặp vấn đề?</span>{' '}
                    <Link href="/lien-he" className="text-blue-600 hover:underline">
                      Liên hệ hỗ trợ
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
