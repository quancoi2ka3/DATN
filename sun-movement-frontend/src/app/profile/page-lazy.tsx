'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LazySection } from '@/components/ui/lazy-sections';
import { CriticalRoutesPrefetch } from '@/components/ui/strategic-prefetch';
import { User, Mail, Phone, MapPin, Calendar, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy load components
const ProfileStats = dynamic(() => import('@/components/profile/profile-stats'), {
  loading: () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </CardContent>
    </Card>
  )
});

const ActivityHistory = dynamic(() => import('@/components/profile/activity-history'), {
  loading: () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </CardContent>
    </Card>
  )
});

const UserPreferences = dynamic(() => import('@/components/profile/user-preferences'), {
  loading: () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </CardContent>
    </Card>
  )
});

// Loading skeleton for profile info
const ProfileInfoSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </CardContent>
  </Card>
);

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
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      <CriticalRoutesPrefetch />
      
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
            <LazySection>
              <Suspense fallback={<ProfileInfoSkeleton />}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                        </CardTitle>
                        <CardDescription>Thành viên Sun Movement</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Mail className="h-5 w-5" />
                      <span>{user.email}</span>
                    </div>
                    {user.phoneNumber && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Phone className="h-5 w-5" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <MapPin className="h-5 w-5" />
                        <span>{user.address}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="h-5 w-5" />
                      <span>Tham gia: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Đã xác thực
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Suspense>
            </LazySection>

            {/* Account Statistics */}
            <LazySection>
              <Suspense fallback={<ProfileInfoSkeleton />}>
                <ProfileStats />
              </Suspense>
            </LazySection>

            {/* Activity History */}
            <LazySection className="md:col-span-2">
              <Suspense fallback={<ProfileInfoSkeleton />}>
                <ActivityHistory />
              </Suspense>
            </LazySection>

            {/* User Preferences */}
            <LazySection className="md:col-span-2">
              <Suspense fallback={<ProfileInfoSkeleton />}>
                <UserPreferences />
              </Suspense>
            </LazySection>

            {/* Quick Actions */}
            <LazySection className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Hành động nhanh</CardTitle>
                  <CardDescription>Các tính năng thường dùng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button variant="outline" asChild>
                      <Link href="/edit-profile">
                        <User className="mr-2 h-4 w-4" />
                        Chỉnh sửa thông tin
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/change-password">
                        <Shield className="mr-2 h-4 w-4" />
                        Đổi mật khẩu
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/settings">
                        Cài đặt tài khoản
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </LazySection>
          </div>
        </div>
      </div>
    </>
  );
}
