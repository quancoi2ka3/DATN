"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutFailedPage() {
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState<{
    error: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error) {
      setErrorInfo({
        error: decodeURIComponent(error),
        message: getErrorMessage(error)
      });
    } else {
      setErrorInfo({
        error: 'Thanh toán thất bại',
        message: 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.'
      });
    }
  }, [searchParams]);

  const getErrorMessage = (error: string) => {
    const decodedError = decodeURIComponent(error).toLowerCase();
    
    if (decodedError.includes('cancel')) {
      return 'Bạn đã hủy giao dịch thanh toán.';
    } else if (decodedError.includes('insufficient')) {
      return 'Tài khoản không đủ số dư để thực hiện giao dịch.';
    } else if (decodedError.includes('timeout')) {
      return 'Giao dịch đã hết hạn. Vui lòng thử lại.';
    } else if (decodedError.includes('invalid')) {
      return 'Thông tin thanh toán không hợp lệ.';
    } else {
      return 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.';
    }
  };

  if (!errorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Thanh toán thất bại
          </h1>
          
          <p className="text-gray-600 mb-6">
            {errorInfo.message}
          </p>
          
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-red-700">
              <p><strong>Lỗi:</strong> {errorInfo.error}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Thử lại thanh toán
            </Link>
            
            <Link
              href="/store"
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors inline-block"
            >
              Quay lại cửa hàng
            </Link>
            
            <a
              href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors inline-block"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
