"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function VNPayReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading');
  const [orderInfo, setOrderInfo] = useState<{
    orderId?: string;
    transactionId?: string;
    amount?: string;
    message?: string;
  }>({});

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    const orderId = searchParams.get('vnp_TxnRef');
    const transactionId = searchParams.get('vnp_TransactionNo');
    const amount = searchParams.get('vnp_Amount');
    const message = searchParams.get('vnp_OrderInfo');    setOrderInfo({
      orderId: orderId || undefined,
      transactionId: transactionId || undefined,
      amount: amount ? (parseInt(amount) / 100).toString() : undefined,
      message: message || undefined
    });

    if (responseCode === '00') {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleViewOrders = () => {
    router.push('/account/orders');
  };

  const handleRetry = () => {
    router.push('/checkout');
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-20 max-w-2xl">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Đang xử lý thanh toán...</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      {status === 'success' && (
        <>
          <Alert className="bg-green-50 border-green-200 mb-6">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Thanh toán thành công!</AlertTitle>
            <AlertDescription className="text-green-700">
              Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xác nhận.
            </AlertDescription>
          </Alert>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>
            <div className="space-y-2">
              {orderInfo.orderId && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Mã đơn hàng:</span>
                  <span>#{orderInfo.orderId}</span>
                </div>
              )}
              {orderInfo.transactionId && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Mã giao dịch:</span>
                  <span>{orderInfo.transactionId}</span>
                </div>
              )}
              {orderInfo.amount && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Số tiền:</span>
                  <span className="font-bold">{parseInt(orderInfo.amount).toLocaleString()} VNĐ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Trạng thái:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Đã thanh toán
                </span>
              </div>
            </div>
          </Card>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={handleContinueShopping}>
              Tiếp tục mua sắm
            </Button>
            <Button variant="outline" onClick={handleViewOrders}>
              Xem đơn hàng
            </Button>
          </div>
        </>
      )}

      {status === 'failed' && (
        <>
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Thanh toán thất bại!</AlertTitle>
            <AlertDescription>
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
            </AlertDescription>
          </Alert>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Thông tin giao dịch</h2>
            <div className="space-y-2">
              {orderInfo.orderId && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Mã đơn hàng:</span>
                  <span>#{orderInfo.orderId}</span>
                </div>
              )}
              {orderInfo.message && (
                <div className="flex justify-between">
                  <span className="font-medium">Lý do:</span>
                  <span className="text-red-600">{orderInfo.message}</span>
                </div>
              )}
            </div>
          </Card>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRetry}>
              Thử lại
            </Button>
            <Button variant="outline" onClick={handleContinueShopping}>
              Quay về trang chủ
            </Button>
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Có lỗi xảy ra!</AlertTitle>
            <AlertDescription>
              Không thể xử lý kết quả thanh toán. Vui lòng liên hệ hỗ trợ khách hàng.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={handleContinueShopping}>
              Quay về trang chủ
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
