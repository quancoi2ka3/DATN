"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useNotification } from '@/lib/notification-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderActions } from '@/components/orders/OrderActions';
import { 
  getOrderStatus, 
  getPaymentStatus, 
  formatOrderDate, 
  formatCurrency, 
  generateOrderCode,
  getOrderTimeline 
} from '@/lib/order-utils';
import { 
  ArrowLeft,
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Calendar,
  Hash,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  User,
  ShoppingBag,
  FileText,
  Loader2
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  size?: string;
  color?: string;
  imageUrl?: string;
}

interface Order {
  orderId: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  subtotalAmount?: number;
  shippingAmount?: number;
  discountAmount?: number;
  taxAmount?: number;
  email: string;
  phoneNumber: string;
  shippingAddress: string;
  billingAddress?: string;
  customerName?: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  shippingMethod?: string;
  notes?: string;
  couponCode?: string;
  estimatedDeliveryDate?: string;
  orderItems: OrderItem[];
}

interface OrderDetailResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useNotification();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const orderId = params?.orderId as string;

  const fetchOrderDetail = async () => {
    if (!orderId) {
      setError('Order ID not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[ORDER DETAIL PAGE] Fetching order:', orderId);
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('[ORDER DETAIL PAGE] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: OrderDetailResponse = await response.json();
      
      if (data.success && data.order) {
        setOrder(data.order);
        console.log('[ORDER DETAIL PAGE] Order loaded successfully');
      } else {
        throw new Error(data.error || 'Failed to load order details');
      }

    } catch (error) {
      console.error('[ORDER DETAIL PAGE] Error fetching order detail:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải chi tiết đơn hàng';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchOrderDetail();
  }, [isAuthenticated, orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Không thể tải chi tiết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {error || 'Đơn hàng không tồn tại hoặc bạn không có quyền xem đơn hàng này.'}
              </p>
              <div className="flex gap-4">
                <Button onClick={fetchOrderDetail} variant="outline">
                  Thử lại
                </Button>
                <Button asChild>
                  <Link href="/orders">
                    Về danh sách đơn hàng
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const orderStatus = getOrderStatus(order.status);
  const paymentStatus = getPaymentStatus(order.paymentStatus);
  const orderCode = generateOrderCode(order.orderId);
  const timeline = getOrderTimeline(order.status, order.orderDate);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết đơn hàng
              </h1>
              <div className="flex items-center gap-4 text-lg mb-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-gray-500" />
                  <span className="font-mono font-medium">{orderCode}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatOrderDate(order.orderDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Badge 
                variant={orderStatus.color}
                className="flex items-center gap-1 text-sm px-3 py-1"
              >
                {orderStatus.label}
              </Badge>
              <Badge 
                variant={paymentStatus.color}
                className="text-sm px-3 py-1"
              >
                {paymentStatus.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardContent className="p-6">
                <OrderTimeline timeline={timeline} />
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Sản phẩm đã đặt ({order.orderItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        {/* Product Image Placeholder */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.productName}
                          </h4>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span> • </span>}
                            {item.color && <span>Màu: {item.color}</span>}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {formatCurrency(item.unitPrice)} × {item.quantity}
                          </div>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <div className="font-medium text-lg">
                            {formatCurrency(item.subtotal)}
                          </div>
                        </div>
                      </div>
                      {index < order.orderItems.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ghi chú đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-wrap">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Actions */}
            <Card>
              <CardContent className="p-6">
                <OrderActions 
                  orderId={order.orderId}
                  status={order.status}
                  trackingNumber={order.trackingNumber}
                  onOrderUpdated={fetchOrderDetail}
                />
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tổng kết đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.subtotalAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatCurrency(order.subtotalAmount)}</span>
                  </div>
                )}
                
                {order.shippingAmount && order.shippingAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{formatCurrency(order.shippingAmount)}</span>
                  </div>
                )}
                
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                
                {order.couponCode && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Mã giảm giá:</span>
                    <span className="font-mono">{order.couponCode}</span>
                  </div>
                )}
                
                {order.taxAmount && order.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thuế:</span>
                    <span>{formatCurrency(order.taxAmount)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.customerName && (
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 mt-1 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 mt-1 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm font-medium">{order.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-1 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p className="text-sm font-medium">{order.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Địa chỉ giao hàng</p>
                  <p className="text-sm font-medium">{order.shippingAddress}</p>
                </div>
                
                {order.shippingMethod && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phương thức vận chuyển</p>
                    <p className="text-sm font-medium">{order.shippingMethod}</p>
                  </div>
                )}
                
                {order.trackingNumber && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Mã vận đơn</p>
                    <p className="text-sm font-mono text-blue-800">{order.trackingNumber}</p>
                  </div>
                )}
                
                {order.estimatedDeliveryDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dự kiến giao hàng</p>
                    <p className="text-sm font-medium text-green-600">
                      {formatOrderDate(order.estimatedDeliveryDate)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Thông tin thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                     order.paymentMethod === 'vnpay' ? 'VNPay' :
                     order.paymentMethod === 'momo' ? 'MoMo' :
                     order.paymentMethod}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge variant={paymentStatus.color} className="text-xs">
                    {paymentStatus.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
