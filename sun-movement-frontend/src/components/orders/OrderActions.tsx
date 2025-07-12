"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  XCircle, 
  RotateCcw, 
  Star, 
  Truck, 
  AlertTriangle,
  MessageCircle,
  CheckCircle2
} from "lucide-react";
import { getOrderStatus } from "@/lib/order-utils";
import { useNotification } from "@/lib/notification-context";
// Using simple confirm dialog for now

interface OrderActionsProps {
  orderId: string;
  status: string;
  trackingNumber?: string;
  onOrderUpdated?: () => void;
}

export function OrderActions({ 
  orderId, 
  status, 
  trackingNumber,
  onOrderUpdated 
}: OrderActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  const orderStatus = getOrderStatus(status);

  const handleConfirmReceived = async () => {
    const confirmed = confirm(`
🎉 Xác nhận đã nhận hàng

Bạn xác nhận đã nhận được đơn hàng này chưa?

Sau khi xác nhận:
✅ Đơn hàng sẽ chuyển sang trạng thái "Hoàn thành"
✅ Thanh toán sẽ được xác nhận
✅ Tồn kho sản phẩm sẽ được cập nhật

Lưu ý: Hành động này không thể hoàn tác!
    `.trim());
    
    if (!confirmed) return;

    setIsLoading(true);
    try {
      console.log('[ORDER ACTIONS] Confirming order received:', orderId);
      // Lấy JWT từ localStorage
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
      }
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/orders/${orderId}/confirm-received`, {
        method: 'POST',
        headers,
      });

      console.log('[ORDER ACTIONS] Confirm received response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('[ORDER ACTIONS] Confirm received result:', result);
        showSuccess('🎉 Cảm ơn bạn đã xác nhận nhận hàng! Đơn hàng đã hoàn thành và thanh toán đã được xác nhận.');
        // Log before calling onOrderUpdated
        console.log('[ORDER ACTIONS] Calling onOrderUpdated to refresh order details');
        // Wait a bit for backend to complete transaction
        setTimeout(async () => {
          console.log('[ORDER ACTIONS] Refreshing order details after confirm');
          onOrderUpdated?.();
          // Check if order still exists after a delay
          setTimeout(async () => {
            try {
              const checkHeaders: Record<string, string> = {};
              if (token) {
                checkHeaders['Authorization'] = `Bearer ${token}`;
              }
              const checkResponse = await fetch(`/api/order?id=${orderId}&_t=${Date.now()}`, {
                cache: 'no-store',
                headers: checkHeaders,
              });
              if (!checkResponse.ok) {
                console.warn('[ORDER ACTIONS] Order not accessible after confirm - forcing page reload');
                window.location.reload();
              }
            } catch (error) {
              console.error('[ORDER ACTIONS] Error checking order after confirm:', error);
            }
          }, 3000);
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error('[ORDER ACTIONS] Confirm received error:', errorData);
        throw new Error(errorData.error || 'Không thể xác nhận nhận hàng');
      }
    } catch (error) {
      console.error('[ORDER ACTIONS] Error confirming received:', error);
      showError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xác nhận nhận hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = confirm('Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.');
    if (!confirmed) return;

    setIsLoading(true);
    try {
      // Lấy JWT từ localStorage
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
      }
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        showSuccess('Đơn hàng đã được hủy thành công');
        onOrderUpdated?.();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = () => {
    // Redirect to cart with items from this order
    window.location.href = `/reorder/${orderId}`;
  };

  const handleReview = () => {
    // Redirect to review page
    window.location.href = `/orders/${orderId}/review`;
  };

  const handleTrackOrder = () => {
    if (trackingNumber) {
      // Open tracking page in new window
      window.open(`/tracking/${trackingNumber}`, '_blank');
    } else {
      showError('Mã vận đơn chưa có sẵn');
    }
  };

  const handleContactSupport = () => {
    // Redirect to support page with order context
    window.location.href = `/support?orderId=${orderId}`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Hành động</h3>
      
      <div className="space-y-2">
        {/* Confirm Received Order - Hiện khi đơn hàng đã delivered */}
        {status === 'delivered' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Đã nhận được hàng?</span>
            </div>
            <p className="text-xs text-green-600 mb-3">
              Xác nhận đã nhận hàng để hoàn thành đơn hàng
            </p>
            <Button 
              variant="default" 
              size="sm" 
              className="w-full justify-center bg-green-600 hover:bg-green-700 text-white font-medium"
              disabled={isLoading}
              onClick={handleConfirmReceived}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xác nhận...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Xác nhận đã nhận hàng
                </>
              )}
            </Button>
          </div>
        )}

        {/* Cancel Order */}
        {orderStatus.allowCancel && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full justify-start"
            disabled={isLoading}
            onClick={handleCancelOrder}
          >
            <XCircle className="w-4 h-4 mr-2" />
            {isLoading ? 'Đang hủy...' : 'Hủy đơn hàng'}
          </Button>
        )}

        {/* Track Order */}
        {orderStatus.allowTracking && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleTrackOrder}
            disabled={!trackingNumber}
          >
            <Truck className="w-4 h-4 mr-2" />
            {trackingNumber ? 'Theo dõi vận chuyển' : 'Chưa có mã vận đơn'}
          </Button>
        )}

        {/* Review Products */}
        {orderStatus.allowReview && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleReview}
          >
            <Star className="w-4 h-4 mr-2" />
            Đánh giá sản phẩm
          </Button>
        )}

        {/* Reorder */}
        {orderStatus.allowReorder && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleReorder}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Mua lại
          </Button>
        )}

        {/* Contact Support */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={handleContactSupport}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Liên hệ hỗ trợ
        </Button>

        {/* Report Problem */}
        {(status === 'delivered' || status === 'completed') && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => window.location.href = `/orders/${orderId}/report`}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Báo cáo vấn đề
          </Button>
        )}
      </div>
    </div>
  );
}
