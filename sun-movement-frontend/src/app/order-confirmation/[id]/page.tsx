"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrderById, CheckoutResponse } from "@/lib/checkout-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<CheckoutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [orderId, setOrderId] = useState<string>("");
  
  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
    };
    
    initializeParams();
  }, [params]);
  
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      setLoading(true);
      const response = await getOrderById(orderId);
      
      if (response.success && response.order) {
        setOrder(response.order);
      } else {
        setError(response.error || "Failed to load order details");
      }
      
      setLoading(false);    };
    
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full text-primary">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-lg">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-10 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push('/')}>Quay về trang chủ</Button>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto py-10 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không tìm thấy đơn hàng</AlertTitle>
          <AlertDescription>Không thể tìm thấy thông tin đơn hàng này.</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push('/')}>Quay về trang chủ</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Alert className="bg-green-50 border-green-200 mb-6">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Đặt hàng thành công!</AlertTitle>
        <AlertDescription className="text-green-700">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý thành công.
        </AlertDescription>
      </Alert>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Mã đơn hàng:</span>
            <span>{order.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Ngày đặt hàng:</span>
            <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Trạng thái:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {order.status === 'pending' && 'Chờ xử lý'}
              {order.status === 'processing' && 'Đang xử lý'}
              {order.status === 'shipped' && 'Đang giao hàng'}
              {order.status === 'delivered' && 'Đã giao hàng'}
              {order.status === 'cancelled' && 'Đã hủy'}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Tổng giá trị:</span>
            <span className="font-bold">{order.totalAmount.toLocaleString()} VNĐ</span>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={() => router.push('/')}
          className="mr-4"
        >
          Tiếp tục mua sắm
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push('/account/orders')}
        >
          Xem tất cả đơn hàng
        </Button>
      </div>
    </div>
  );
}
