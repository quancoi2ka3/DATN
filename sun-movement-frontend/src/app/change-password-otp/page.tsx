'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Lock, Shield, Mail, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordOtpPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP & Change Password
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otpCode: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const validatePasswords = (): boolean => {
    if (!formData.currentPassword.trim()) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return false;
    }
    if (!formData.newPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/.test(formData.newPassword)) {
      setError('Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/user/send-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purpose: 'change-password'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Mã OTP đã được gửi đến email của bạn');
        setOtpSent(true);
        setStep(2);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi gửi mã OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    if (!formData.otpCode.trim()) {
      setError('Vui lòng nhập mã OTP');
      setIsLoading(false);
      return;
    }

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/user/change-password-with-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
          otpCode: formData.otpCode
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Mật khẩu đã được thay đổi thành công!');
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi thay đổi mật khẩu');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const resendOtp = async () => {
    await handleSendOtp();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <p>Bạn cần đăng nhập để thay đổi mật khẩu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container max-w-md mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại hồ sơ
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Đổi mật khẩu bảo mật
          </h1>
          <p className="text-gray-600 mt-2">
            Xác thực qua email để đảm bảo an toàn tài khoản
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 ? (
                <>
                  <Lock className="w-5 h-5" />
                  Bước 1: Nhập mật khẩu mới
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Bước 2: Xác thực OTP
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Nhập mật khẩu hiện tại và mật khẩu mới, sau đó chúng tôi sẽ gửi mã OTP đến email của bạn'
                : `Nhập mã OTP đã được gửi đến ${user.email}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Messages */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Password Form */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleChange('currentPassword', e.target.value)}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleChange('newPassword', e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang gửi OTP...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Gửi mã OTP
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otpCode">Mã OTP</Label>
                  <Input
                    id="otpCode"
                    type="text"
                    value={formData.otpCode}
                    onChange={(e) => handleChange('otpCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Nhập mã OTP 6 số"
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Vui lòng kiểm tra email và nhập mã OTP 6 số
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={resendOtp}
                    disabled={isLoading}
                  >
                    Gửi lại
                  </Button>
                </div>

                <Button 
                  variant="ghost"
                  onClick={() => {
                    setStep(1);
                    setFormData(prev => ({ ...prev, otpCode: '' }));
                    setOtpSent(false);
                    setError('');
                    setMessage('');
                  }}
                  className="w-full"
                >
                  Quay lại bước 1
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Bảo mật cao</h3>
              <p className="text-sm text-blue-700 mt-1">
                Mã OTP chỉ có hiệu lực trong 10 phút và chỉ sử dụng được một lần để đảm bảo tính bảo mật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
