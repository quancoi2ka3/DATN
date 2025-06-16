'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Bell, Lock, User, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
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
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang thông tin
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
          <p className="text-gray-600 mt-2">Tùy chỉnh tài khoản và sở thích của bạn</p>
        </div>

        <div className="grid gap-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin tài khoản
              </CardTitle>
              <CardDescription>
                Quản lý thông tin cá nhân và tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Thông tin cá nhân</div>
                    <div className="text-sm text-gray-500">Cập nhật tên, địa chỉ, số điện thoại</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Chỉnh sửa</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-500">Thay đổi địa chỉ email</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Thay đổi</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Bảo mật
              </CardTitle>
              <CardDescription>
                Quản lý mật khẩu và bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Mật khẩu</div>
                    <div className="text-sm text-gray-500">Thay đổi mật khẩu đăng nhập</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Đổi mật khẩu</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Thông báo
              </CardTitle>
              <CardDescription>
                Cài đặt thông báo email và push notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Thông báo email</div>
                    <div className="text-sm text-gray-500">Nhận thông báo về đơn hàng, sự kiện</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Cài đặt</Button>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Features */}
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tính năng sắp ra mắt
              </CardTitle>
              <CardDescription>
                Các tính năng đang được phát triển
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">Đang phát triển</p>
                <p className="text-sm">Các tính năng cài đặt nâng cao sẽ sớm được cập nhật</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
