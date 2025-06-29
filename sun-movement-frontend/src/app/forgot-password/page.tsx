'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validate email
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Địa chỉ email không hợp lệ');
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
          email: email.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message || 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
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
              Kiểm tra hộp thư của bạn để nhận hướng dẫn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Những việc cần làm tiếp theo:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Kiểm tra hộp thư email của bạn</li>
                <li>Tìm email từ Sun Movement</li>
                <li>Click vào liên kết trong email</li>
                <li>Tạo mật khẩu mới</li>
              </ol>
            </div>

            <div className="border-t pt-4 text-center text-sm text-gray-500">
              <p>Không nhận được email?</p>
              <div className="mt-2 space-x-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setIsSuccess(false);
                    setMessage('');
                    setEmail('');
                  }}
                  className="p-0 h-auto"
                >
                  Thử lại
                </Button>
                <span>•</span>
                <Button variant="link" size="sm" asChild className="p-0 h-auto">
                  <Link href="/auth">
                    Quay lại đăng nhập
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Quên mật khẩu?
          </CardTitle>
          <CardDescription>
            Nhập email để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Địa chỉ email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
              <div className="text-xs text-gray-500">
                Nhập email bạn đã sử dụng để đăng ký tài khoản
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? 'Đang gửi...' : 'Gửi hướng dẫn đặt lại'}
            </Button>

            <div className="text-center pt-4">
              <Button variant="link" asChild>
                <Link href="/auth">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            </div>
          </form>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Lưu ý quan trọng</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Liên kết đặt lại mật khẩu có hiệu lực trong 30 phút</li>
              <li>• Kiểm tra cả thư mục spam nếu không thấy email</li>
              <li>• Chỉ email đã đăng ký mới nhận được hướng dẫn</li>
              <li>• Liên hệ hỗ trợ nếu vẫn gặp vấn đề</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Cần hỗ trợ?{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Liên hệ với chúng tôi
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
