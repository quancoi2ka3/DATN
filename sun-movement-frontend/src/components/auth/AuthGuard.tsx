"use client";

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  adminOnly = false,
  redirectTo = '/auth/login'
}: AuthGuardProps) {
  const { isAuthenticated, isAdmin, setReturnUrl } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      // Store current URL as return URL for after login
      setReturnUrl(pathname);
      router.push(redirectTo);
      return;
    }

    // If admin access is required and user is not admin
    if (adminOnly && !isAdmin()) {
      // Redirect to homepage for non-admin users
      router.push('/');
      return;
    }

    // If user is authenticated and trying to access auth pages
    if (isAuthenticated && pathname.startsWith('/auth/')) {
      // Redirect authenticated users away from auth pages
      router.push('/');
      return;
    }
  }, [isAuthenticated, requireAuth, adminOnly, pathname, setReturnUrl, router, redirectTo, isAdmin]);

  // Show loading or return children based on auth state
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang chuyển hướng đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Bạn không có quyền truy cập trang này...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
