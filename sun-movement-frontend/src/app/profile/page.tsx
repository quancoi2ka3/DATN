'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

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
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Thông tin tài khoản</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Thông tin cơ bản về tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">Thành viên Sun Movement</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Vai trò:</span>
                  <div className="flex gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role === 'Customer' ? 'Khách hàng' : 
                         role === 'Admin' ? 'Quản trị viên' : 
                         role === 'Staff' ? 'Nhân viên' : role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cài đặt tài khoản
              </CardTitle>
              <CardDescription>
                Quản lý bảo mật và tùy chỉnh tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Chỉnh sửa thông tin cá nhân
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Đổi mật khẩu
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Cài đặt thông báo
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Truy cập nhanh</CardTitle>
              <CardDescription>
                Các chức năng thường sử dụng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" asChild>
                  <Link href="/store">
                    <div className="text-center">
                      <div className="text-sm font-medium">Cửa hàng</div>
                      <div className="text-xs text-gray-500">Mua sắm</div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <Link href="/dich-vu">
                    <div className="text-center">
                      <div className="text-sm font-medium">Dịch vụ</div>
                      <div className="text-xs text-gray-500">Đăng ký lớp</div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <Link href="/su-kien">
                    <div className="text-center">
                      <div className="text-sm font-medium">Sự kiện</div>
                      <div className="text-xs text-gray-500">Hoạt động</div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <Link href="/lien-he">
                    <div className="text-center">
                      <div className="text-sm font-medium">Liên hệ</div>
                      <div className="text-xs text-gray-500">Hỗ trợ</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
