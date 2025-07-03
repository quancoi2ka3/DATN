"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  User
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  customerName?: string;
  estimatedDelivery?: string;
}

interface OrderDetailResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

const statusConfig = {
  'pending': { 
    label: 'Chờ xử lý', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Clock,
    description: 'Đơn hàng đang chờ được xử lý'
  },
  'confirmed': { 
    label: 'Đã xác nhận', 
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: CheckCircle,
    description: 'Đơn hàng đã được xác nhận và đang chuẩn bị'
  },
  'processing': { 
    label: 'Đang xử lý', 
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: Package,
    description: 'Đơn hàng đang được chuẩn bị và đóng gói'
  },
  'shipped': { 
    label: 'Đã giao vận', 
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: Truck,
    description: 'Đơn hàng đã được giao cho đơn vị vận chuyển'
  },
  'delivered': { 
    label: 'Đã giao hàng', 
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle,
    description: 'Đơn hàng đã được giao thành công'
  },
  'cancelled': { 
    label: 'Đã hủy', 
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle,
    description: 'Đơn hàng đã bị hủy'
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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.orderId as string;

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
      return;
    }

    if (!orderId) {
      setError('Mã đơn hàng không hợp lệ');
      setIsLoading(false);
      return;
    }

    fetchOrderDetail();
  }, [isAuthenticated, orderId]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OrderDetailResponse = await response.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Không thể tải chi tiết đơn hàng');
      }
    } catch (err) {
      console.error('Error fetching order detail:', err);
      setError('Có lỗi xảy ra khi tải chi tiết đơn hàng');
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải chi tiết đơn hàng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cần đăng nhập
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Vui lòng đăng nhập để xem chi tiết đơn hàng
              </p>
              <Button asChild>
                <Link href="/auth/login">
                  Đăng nhập
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <XCircle className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {error || 'Không tìm thấy đơn hàng'}
              </p>
              <div className="flex gap-2">
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

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const paymentInfo = paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig] || paymentStatusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
              <div className="flex items-center gap-2 text-lg">
                <Hash className="h-5 w-5 text-gray-500" />
                <span className="font-mono font-medium">#{order.orderId}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Badge 
                variant="secondary" 
                className={`${statusInfo.color} flex items-center gap-1 text-sm px-3 py-1`}
              >
                <StatusIcon className="h-4 w-4" />
                {statusInfo.label}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`${paymentInfo.color} text-sm px-3 py-1`}
              >
                {paymentInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon className="h-5 w-5" />
                  Trạng thái đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{statusInfo.description}</p>
                {order.estimatedDelivery && (
                  <p className="text-sm text-gray-500 mt-2">
                    Dự kiến giao hàng: {formatDate(order.estimatedDelivery)}
                  </p>
                )}
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Mã vận đơn: {order.trackingNumber}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm đã đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.productName}
                          </h4>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.size && <span>Kích thước: {item.size}</span>}
                            {item.size && item.color && <span> • </span>}
                            {item.color && <span>Màu sắc: {item.color}</span>}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {formatCurrency(item.unitPrice)} x {item.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
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

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tổng kết đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Ngày đặt hàng</div>
                    <div className="text-gray-600">{formatDate(order.orderDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Thanh toán</div>
                    <div className="text-gray-600 capitalize">{order.paymentMethod}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.customerName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Tên khách hàng</div>
                      <div className="text-gray-600">{order.customerName}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">{order.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Số điện thoại</div>
                    <div className="text-gray-600">{order.phoneNumber}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Địa chỉ giao hàng</div>
                    <div className="text-gray-600">{order.shippingAddress}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              {order.trackingNumber && (
                <Button className="w-full" variant="outline">
                  <Truck className="h-4 w-4 mr-2" />
                  Theo dõi vận đơn
                </Button>
              )}
              
              <Button asChild className="w-full" variant="outline">
                <Link href="/orders">
                  Về danh sách đơn hàng
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
