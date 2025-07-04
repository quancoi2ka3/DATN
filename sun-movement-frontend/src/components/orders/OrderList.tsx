"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Calendar,
  Hash,
  DollarSign
} from 'lucide-react';
import { useNotification } from '@/lib/notification-context';

interface OrderItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  size?: string;
  color?: string;
}

interface Order {
  orderId: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  email: string;
  phoneNumber: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  orderItems: OrderItem[];
  trackingNumber?: string;
  notes?: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  error?: string;
}

const statusConfig = {
  'pending': { 
    label: 'Chờ xử lý', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Clock 
  },
  'confirmed': { 
    label: 'Đã xác nhận', 
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: CheckCircle 
  },
  'processing': { 
    label: 'Đang xử lý', 
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: Package 
  },
  'shipped': { 
    label: 'Đã giao vận', 
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: Truck 
  },
  'delivered': { 
    label: 'Đã giao hàng', 
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle 
  },
  'cancelled': { 
    label: 'Đã hủy', 
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle 
  }
};

const paymentStatusConfig = {
  'paid': { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
  'pending': { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
  'failed': { label: 'Thanh toán thất bại', color: 'bg-red-100 text-red-800' }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrderList() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showError } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Allow both authenticated and guest users to view orders
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    setShouldFetch(true);
  }, [authLoading]);

  useEffect(() => {
    if (shouldFetch) {
      // Debounce the fetch to avoid unnecessary calls
      const timeoutId = setTimeout(() => {
        fetchOrders();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldFetch]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[ORDER LIST] Fetching orders...');

      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Prevent caching
      });

      console.log('[ORDER LIST] Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OrdersResponse = await response.json();
      console.log('[ORDER LIST] Data received:', data);

      if (data.success) {
        setOrders(data.orders || []);
        console.log('[ORDER LIST] Orders set:', data.orders?.length || 0);
      } else {
        setError(data.error || 'Không thể tải danh sách đơn hàng');
      }
    } catch (err) {
      console.error('[ORDER LIST] Error fetching orders:', err);
      setError('Có lỗi xảy ra khi tải danh sách đơn hàng');
      showError("Không thể tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <XCircle className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-500 text-center mb-4">
            {error}
          </p>
          <div className="flex gap-2">
            <Button onClick={fetchOrders} variant="outline">
              Thử lại
            </Button>
            {!isAuthenticated && (
              <Button asChild>
                <Link href="/auth/login">
                  Đăng nhập
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
          </p>
          <Button asChild>
            <Link href="/store/sportswear">
              Bắt đầu mua sắm
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Tìm thấy {orders.length} đơn hàng
        </div>
        <Button 
          onClick={fetchOrders} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      {orders.map((order) => {
        const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
        const paymentInfo = paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig] || paymentStatusConfig.pending;
        const StatusIcon = statusInfo.icon;

        return (
          <Card key={order.orderId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="font-mono text-sm font-medium">
                      #{order.orderId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(order.orderDate)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`${statusInfo.color} flex items-center gap-1`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={paymentInfo.color}
                  >
                    {paymentInfo.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Order Items Summary */}
                <div>
                  <h4 className="font-medium mb-2">Sản phẩm ({order.orderItems.length} món):</h4>
                  <div className="space-y-2">
                    {order.orderItems.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.productName} 
                          {item.size && ` - ${item.size}`}
                          {item.color && ` - ${item.color}`}
                          {` x${item.quantity}`}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    {order.orderItems.length > 2 && (
                      <div className="text-sm text-gray-500">
                        ... và {order.orderItems.length - 2} sản phẩm khác
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Total and Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-lg font-semibold">
                      Tổng cộng: {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link href={`/orders/${order.orderId}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Xem chi tiết
                      </Link>
                    </Button>
                    
                    {order.trackingNumber && (
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Theo dõi
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
