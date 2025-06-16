'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Lock, Phone, MapPin, Calendar } from 'lucide-react';
import { EmailVerificationModal } from './EmailVerificationModal';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}

interface CustomerRegisterProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function CustomerRegister({ onSuccess, onSwitchToLogin }: CustomerRegisterProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: ''
  });
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('Vui lòng nhập tên');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Vui lòng nhập họ');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('Vui lòng chọn ngày sinh');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth
      };      // Use explicit URL to ensure we hit the correct backend port
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const endpoint = `${apiUrl}/api/auth/register`;
      
      console.log('Registration attempt to:', endpoint);
      console.log('Registration data:', registerData);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));      if (!response.ok) {
        let errorMessage = 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
        
        try {
          // Always try to parse as JSON first since ASP.NET Core returns JSON errors
          let errorData;
          try {
            errorData = await response.json();
            console.log('✅ Successfully parsed JSON error response:', errorData);
          } catch (jsonError) {
            // If JSON parsing fails, get the raw text
            console.log('❌ JSON parsing failed, getting text response:', jsonError);
            const errorText = await response.text();
            console.error('Non-JSON error response:', errorText);
            errorData = { message: errorText };
          }
          
          // Extract error messages from the parsed data
          if (errorData.errors) {
            console.log('📋 Extracting validation errors:', errorData.errors);
            
            // Handle ASP.NET Core ModelState validation errors
            if (Array.isArray(errorData.errors)) {
              // Array format: [{ Field: "Password", Errors: ["message1", "message2"] }]
              const allErrors: string[] = [];
              errorData.errors.forEach((errorObj: any) => {
                if (errorObj.Errors && Array.isArray(errorObj.Errors)) {
                  allErrors.push(...errorObj.Errors);
                } else if (typeof errorObj === 'string') {
                  allErrors.push(errorObj);
                }
              });
              errorMessage = allErrors.join('\n');
            } else if (typeof errorData.errors === 'object') {
              // Object format: { "Password": ["message1", "message2"] }
              const allErrors: string[] = [];
              for (const [field, messages] of Object.entries(errorData.errors)) {
                if (Array.isArray(messages)) {
                  allErrors.push(...messages as string[]);
                } else if (typeof messages === 'string') {
                  allErrors.push(messages);
                }
              }
              errorMessage = allErrors.join('\n');
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
          
          // Log the final error message for debugging
          console.log('🎯 Final error message to display:', errorMessage);
          
        } catch (parseError) {
          console.error('❌ Error parsing response:', parseError);
          
          // Fallback error messages based on status code
          if (response.status === 400) {
            errorMessage = 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.';
          } else if (response.status === 500) {
            errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
          } else if (response.status === 404) {
            errorMessage = 'Không tìm thấy dịch vụ đăng ký. Vui lòng kiểm tra cấu hình.';
          } else {
            errorMessage = `Lỗi kết nối (${response.status}). Vui lòng thử lại.`;
          }
        }
        
        setError(errorMessage);
        return;
      }// If registration returns a verification requirement, show the verification modal
      const responseData = await response.json();
      console.log('Registration response data:', responseData);
      
      if (responseData.requiresVerification || responseData.verificationCode || responseData.message?.includes('verification')) {
        setRegisteredEmail(formData.email);
        setShowVerificationModal(true);
        setSuccess('Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (hoặc xem console để lấy mã testing).');
      } else {
        // Old flow - direct registration success
        setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phoneNumber: '',
          address: '',
          dateOfBirth: ''
        });

        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }    } catch (error: any) {
      console.error('Registration error:', error);
      setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setSuccess('Đăng ký thành công! Tài khoản của bạn đã được kích hoạt.');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: ''
    });

    // Call success callback after a short delay
    setTimeout(() => {
      onSuccess?.();
    }, 2000);
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
  };
  return (
    <Card className="w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden flex flex-col">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl text-center">Đăng ký tài khoản</CardTitle>
        <CardDescription className="text-center">
          Tạo tài khoản mới để trải nghiệm dịch vụ của chúng tôi
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-1 px-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-sm">Tên *</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Nhập tên"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-10 h-9"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-sm">Họ *</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Nhập họ"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="pl-10 h-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nhap@email.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-9"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">Mật khẩu *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Tối thiểu 8 ký tự"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm">Xác nhận *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 h-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="phoneNumber" className="text-sm">Số điện thoại *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="0123456789"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="pl-10 h-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address" className="text-sm">Địa chỉ *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Nhập địa chỉ"
                value={formData.address}
                onChange={handleChange}
                className="pl-10 h-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="dateOfBirth" className="text-sm">Ngày sinh *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="pl-10 h-9"
                required
              />
            </div>
          </div>

          <div className="pt-2 pb-4">
            <Button type="submit" className="w-full h-10" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </Button>

            {onSwitchToLogin && (
              <div className="text-center mt-3">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={handleVerificationClose}
        email={registeredEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </Card>
  );
}
