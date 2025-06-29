'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, User, CheckCircle, AlertCircle, Save } from 'lucide-react';
import Link from 'next/link';
import TokenDebugInfo from '@/components/debug/TokenDebugInfo';

export default function EditProfilePage() {
  const { isAuthenticated, user, token, refreshUserProfile } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Load current user profile
    loadUserProfile();
  }, [isAuthenticated, router]);  const loadUserProfile = async () => {
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      console.log('Loading profile from:', `${apiUrl}/api/user/profile`);
      
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Profile response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Profile data loaded:', userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || ''
        });
      } else if (response.status === 401) {
        console.error('Token expired or invalid');
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      } else {
        const errorData = await response.text();
        console.error('Failed to load user profile:', response.status, errorData);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('Họ không được để trống');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Tên không được để trống');
      return false;
    }
    if (formData.phoneNumber && !/^[0-9+\-\s()]{8,15}$/.test(formData.phoneNumber.trim())) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validate form
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      console.log('Updating profile to:', `${apiUrl}/api/user/profile`);
      console.log('Profile data being sent:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
      });
      
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
        }),
      });

      console.log('Update response status:', response.status);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.log('Non-JSON response:', textResponse);
        data = { message: textResponse || 'Có lỗi xảy ra' };
      }
      
      console.log('Update response data:', data);      if (response.ok) {
        setMessage(data.message || 'Thông tin cá nhân đã được cập nhật thành công!');
        // Refresh user data in auth context
        await refreshUserProfile();
        // Redirect after success
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else if (response.status === 401) {
        console.error('Token expired or invalid');
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
      }
    } catch (error) {
      console.error('Update profile error:', error);
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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
          <p>Vui lòng đăng nhập để xem trang này.</p>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa thông tin cá nhân</h1>
          <p className="text-gray-600 mt-2">Cập nhật thông tin cá nhân của bạn</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân. Email không thể thay đổi từ trang này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email (không thể thay đổi)</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ *</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Nhập họ"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên *</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Nhập tên"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  disabled={isLoading}
                />
              </div>

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
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
                <Button type="button" variant="outline" asChild className="flex-1">
                  <Link href="/profile">
                    Hủy
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Debug info - remove in production */}
      <TokenDebugInfo />
    </div>
  );
}
