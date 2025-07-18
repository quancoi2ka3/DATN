"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEnhancedCart } from '@/lib/enhanced-cart-context';

interface LoginRedirectProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Higher-order component that handles authentication redirects for e-commerce flows
 * Features:
 * - Protects routes that require authentication
 * - Preserves shopping cart during authentication
 * - Handles return URL after login
 * - Redirects authenticated users away from auth pages
 */
export default function LoginRedirect({ 
  children, 
  requireAuth = false, 
  redirectTo = '/auth/login' 
}: LoginRedirectProps) {
  const { isAuthenticated, setReturnUrl } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      
      // Store current URL as return URL
      setReturnUrl(window.location.pathname + window.location.search);
      
      // Redirect to login page
      router.push(redirectTo);
      return;
    }

    // If user is authenticated and on auth pages, redirect to home
    if (isAuthenticated && window.location.pathname.startsWith('/auth')) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, requireAuth, redirectTo, setReturnUrl, router]);

  // Show loading state while redirecting
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600">
            Đang chuyển hướng đến trang đăng nhập...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Giỏ hàng của bạn sẽ được bảo toàn
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
