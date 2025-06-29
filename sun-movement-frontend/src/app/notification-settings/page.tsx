'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bell, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotificationSettingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newProducts: false,
    systemUpdates: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Simulate API call - replace with actual API endpoint later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally save to backend:
      // const response = await fetch('/api/user/notification-settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });

      setMessage('Cài đặt thông báo đã được lưu thành công!');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (error) {
      console.error('Save notification settings error:', error);
      setError('Không thể lưu cài đặt. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt thông báo</h1>
          <p className="text-gray-600 mt-2">Tùy chỉnh cách thức nhận thông báo từ Sun Movement</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Thông báo qua Email
              </CardTitle>
              <CardDescription>
                Nhận thông báo qua địa chỉ email của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="emailNotifications">Kích hoạt email thông báo</Label>
                  <p className="text-sm text-gray-500">Nhận tất cả thông báo qua email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked: boolean) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="orderUpdates">Cập nhật đơn hàng</Label>
                  <p className="text-sm text-gray-500">Thông báo về trạng thái đơn hàng</p>
                </div>
                <Switch
                  id="orderUpdates"
                  checked={settings.orderUpdates}
                  onCheckedChange={(checked: boolean) => handleSettingChange('orderUpdates', checked)}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="promotions">Khuyến mãi và ưu đãi</Label>
                  <p className="text-sm text-gray-500">Nhận thông báo về các chương trình giảm giá</p>
                </div>
                <Switch
                  id="promotions"
                  checked={settings.promotions}
                  onCheckedChange={(checked: boolean) => handleSettingChange('promotions', checked)}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="newProducts">Sản phẩm mới</Label>
                  <p className="text-sm text-gray-500">Thông báo khi có sản phẩm mới</p>
                </div>
                <Switch
                  id="newProducts"
                  checked={settings.newProducts}
                  onCheckedChange={(checked: boolean) => handleSettingChange('newProducts', checked)}
                  disabled={!settings.emailNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Thông báo hệ thống
              </CardTitle>
              <CardDescription>
                Thông báo về cập nhật hệ thống và bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="systemUpdates">Cập nhật hệ thống</Label>
                  <p className="text-sm text-gray-500">Thông báo về bảo trì và cập nhật</p>
                </div>
                <Switch
                  id="systemUpdates"
                  checked={settings.systemUpdates}
                  onCheckedChange={(checked: boolean) => handleSettingChange('systemUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="pushNotifications">Thông báo đẩy</Label>
                  <p className="text-sm text-gray-500">Nhận thông báo trên trình duyệt</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked: boolean) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Thông báo SMS
              </CardTitle>
              <CardDescription>
                Nhận thông báo qua tin nhắn điện thoại (tính phí)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="smsNotifications">Kích hoạt SMS</Label>
                  <p className="text-sm text-gray-500">Chỉ cho các thông báo quan trọng</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked: boolean) => handleSettingChange('smsNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

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
              <Bell className="mr-2 h-4 w-4" />
              {isLoading ? 'Đang lưu...' : 'Lưu cài đặt'}
            </Button>
            <Button type="button" variant="outline" asChild className="flex-1">
              <Link href="/profile">
                Hủy
              </Link>
            </Button>
          </div>

          {/* Info */}
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">Lưu ý:</div>
                <ul className="text-sm space-y-1">
                  <li>• Bạn có thể thay đổi cài đặt này bất cứ lúc nào</li>
                  <li>• Một số thông báo bắt buộc không thể tắt (bảo mật, pháp lý)</li>
                  <li>• SMS có thể phát sinh chi phí theo nhà mạng</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </form>
      </div>
    </div>
  );
}
