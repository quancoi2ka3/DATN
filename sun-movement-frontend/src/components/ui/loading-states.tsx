"use client";

import { LoadingSpinner } from "./enhanced-animations";

export function ProductCardSkeleton() {
  return (
    <div className="card-enhanced p-4 rounded-lg animate-pulse">
      <div className="loading-skeleton w-full h-48 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="loading-skeleton h-4 w-3/4 rounded"></div>
        <div className="loading-skeleton h-3 w-full rounded"></div>
        <div className="loading-skeleton h-3 w-2/3 rounded"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="loading-skeleton h-5 w-20 rounded"></div>
          <div className="loading-skeleton h-8 w-24 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Đang tải..." }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Đã xảy ra lỗi",
  message = "Không thể tải dữ liệu. Vui lòng thử lại.",
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary-enhanced px-6 py-2 text-white rounded-lg hover-lift"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Không có dữ liệu",
  message = "Không tìm thấy sản phẩm nào.",
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m-4 4v8m0 0V9a2 2 0 012-2h2m-4 4h8m0 0V9a2 2 0 00-2-2H8a2 2 0 00-2 2v4h8z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary-enhanced px-6 py-2 text-white rounded-lg hover-lift"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
