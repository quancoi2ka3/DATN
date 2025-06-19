"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, CreditCard, Calendar, Hash, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    paymentMethod: string;
    transactionId?: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const paymentMethod = searchParams.get('paymentMethod');
    const transactionId = searchParams.get('transactionId') || searchParams.get('vnp_TransactionNo');
    
    if (orderId) {
      setOrderInfo({
        orderId,
        paymentMethod: paymentMethod || 'unknown',
        transactionId: transactionId || undefined,
        message: getSuccessMessage(paymentMethod)
      });
    }
  }, [searchParams]);

  const getSuccessMessage = (paymentMethod: string | null) => {
    switch (paymentMethod) {
      case 'vnpay':
        return 'Thanh toán VNPay thành công! Đơn hàng của bạn đã được xác nhận và thanh toán.';
      case 'cash_on_delivery':
        return 'Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.';
      case 'bank_transfer':
        return 'Đặt hàng thành công! Vui lòng chuyển khoản theo thông tin đã gửi.';
      default:
        return 'Đặt hàng thành công!';
    }
  };

  if (!orderInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Alert */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-green-800">Đặt hàng thành công!</h1>
              <p className="text-green-700">{orderInfo.message}</p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Chi tiết đơn hàng
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center text-gray-600">
                <Hash className="h-4 w-4 mr-2" />
                <span>Mã đơn hàng:</span>
              </div>
              <span className="font-mono text-lg text-blue-600">#{orderInfo.orderId}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center text-gray-600">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Phương thức thanh toán:</span>
              </div>
              <span className="capitalize font-medium">
                {orderInfo.paymentMethod === 'vnpay' ? 'VNPay' : 
                 orderInfo.paymentMethod === 'cash_on_delivery' ? 'COD' :
                 orderInfo.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' :
                 orderInfo.paymentMethod}
              </span>
            </div>

            {orderInfo.transactionId && (
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center text-gray-600">
                  <Hash className="h-4 w-4 mr-2" />
                  <span>Mã giao dịch:</span>
                </div>
                <span className="font-mono text-sm">{orderInfo.transactionId}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Thời gian đặt hàng:</span>
              </div>
              <span>{new Date().toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Thông tin quan trọng:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Email xác nhận đơn hàng sẽ được gửi đến địa chỉ email của bạn</li>
            <li>• Đơn hàng sẽ được xử lý trong vòng 1-2 ngày làm việc</li>
            <li>• Bạn có thể theo dõi trạng thái đơn hàng trong phần "Đơn hàng của tôi"</li>
            <li>• Liên hệ hotline 08999 139 393 nếu cần hỗ trợ</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => router.push('/')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
          <button 
            onClick={() => router.push('/account/orders')}            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors border"
          >
            Xem đơn hàng của tôi
          </button>
        </div>
      </div>
    </div>
  );
}
