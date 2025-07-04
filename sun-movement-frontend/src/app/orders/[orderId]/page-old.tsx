// "use client";

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useAuth } from '@/lib/auth-context';
// import { useNotification } from '@/lib/notification-context';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { OrderTimeline } from '@/components/orders/OrderTimeline';
// import { OrderActions } from '@/components/orders/OrderActions';
// import { 
//   getOrderStatus, 
//   getPaymentStatus, 
//   formatOrderDate, 
//   formatCurrency, 
//   generateOrderCode,
//   getOrderTimeline 
// } from '@/lib/order-utils';
// import { 
//   ArrowLeft,
//   Package, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   Truck, 
//   Calendar,
//   Hash,
//   DollarSign,
//   MapPin,
//   Phone,
//   Mail,
//   CreditCard,
//   User,
//   ShoppingBag,
//   FileText
// } from 'lucide-react';

// interface OrderItem {
//   id: string;
//   productId: number;
//   productName: string;
//   quantity: number;
//   unitPrice: number;
//   subtotal: number;
//   size?: string;
//   color?: string;
//   imageUrl?: string;
// }

// interface Order {
//   orderId: string;
//   orderDate: string;
//   status: string;
//   totalAmount: number;
//   subtotalAmount?: number;
//   shippingAmount?: number;
//   discountAmount?: number;
//   taxAmount?: number;
//   email: string;
//   phoneNumber: string;
//   shippingAddress: string;
//   billingAddress?: string;
//   customerName?: string;
//   paymentMethod: string;
//   paymentStatus: string;
//   trackingNumber?: string;
//   shippingMethod?: string;
//   notes?: string;
//   couponCode?: string;
//   estimatedDeliveryDate?: string;
//   orderItems: OrderItem[];
// }

// interface OrderDetailResponse {
//   success: boolean;
//   order?: Order;
//   error?: string;
// }

// export default function OrderDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { isAuthenticated } = useAuth();
//   const { showError, showSuccess } = useNotification();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const orderId = params.orderId as string;

//   useEffect(() => {
//     if (!isAuthenticated) {
//       setIsLoading(false);
//       setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
//       return;
//     }

//     if (!orderId) {
//       setError('Mã đơn hàng không hợp lệ');
//       setIsLoading(false);
//       return;
//     }

//     fetchOrderDetail();
//   }, [isAuthenticated, orderId]);

//   const fetchOrderDetail = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(`/api/orders/${orderId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: OrderDetailResponse = await response.json();

//       if (data.success && data.order) {
//         setOrder(data.order);
//       } else {
//         setError(data.error || 'Không thể tải chi tiết đơn hàng');
//       }
//     } catch (err) {
//       console.error('Error fetching order detail:', err);
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
//       if (errorMessage.includes('500')) {
//         setError('Máy chủ đang gặp sự cố. Vui lòng thử lại sau.');
//         showError("Máy chủ đang gặp sự cố. Vui lòng thử lại sau.");
//       } else if (errorMessage.includes('401')) {
//         setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
//         showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
//       } else if (errorMessage.includes('404')) {
//         setError('Không tìm thấy đơn hàng này.');
//         showError("Không tìm thấy đơn hàng này.");
//       } else {
//         setError('Có lỗi xảy ra khi tải chi tiết đơn hàng. Vui lòng thử lại.');
//         showError("Không thể tải chi tiết đơn hàng. Vui lòng kiểm tra kết nối mạng.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="animate-pulse space-y-6">
//             <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 space-y-6">
//                 <div className="bg-white rounded-lg p-6 space-y-4">
//                   <div className="h-6 bg-gray-200 rounded w-1/4"></div>
//                   <div className="space-y-2">
//                     {[1, 2, 3].map((i) => (
//                       <div key={i} className="h-4 bg-gray-200 rounded"></div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-6">
//                 <div className="bg-white rounded-lg p-6 space-y-4">
//                   <div className="h-6 bg-gray-200 rounded w-1/2"></div>
//                   <div className="space-y-2">
//                     {[1, 2].map((i) => (
//                       <div key={i} className="h-4 bg-gray-200 rounded"></div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Package className="h-12 w-12 text-gray-400 mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Cần đăng nhập
//               </h3>
//               <p className="text-gray-500 text-center mb-4">
//                 Vui lòng đăng nhập để xem chi tiết đơn hàng
//               </p>
//               <Button asChild>
//                 <Link href="/auth/login">
//                   Đăng nhập
//                 </Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="mb-6">
//             <Button 
//               variant="ghost" 
//               onClick={() => router.back()}
//               className="mb-4"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Quay lại
//             </Button>
//           </div>
          
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <XCircle className="h-12 w-12 text-red-400 mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Có lỗi xảy ra
//               </h3>
//               <p className="text-gray-500 text-center mb-4">
//                 {error || 'Không tìm thấy đơn hàng'}
//               </p>
//               <div className="flex gap-2">
//                 <Button onClick={fetchOrderDetail} variant="outline">
//                   Thử lại
//                 </Button>
//                 <Button asChild>
//                   <Link href="/orders">
//                     Về danh sách đơn hàng
//                   </Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   const orderStatus = getOrderStatus(order.status);
//   const paymentStatus = getPaymentStatus(order.paymentStatus);
//   const orderCode = generateOrderCode(order.orderId);
//   const timeline = getOrderTimeline(order.status, order.orderDate);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         {/* Header */}
//         <div className="mb-6">
//           <Button 
//             variant="ghost" 
//             onClick={() => router.back()}
//             className="mb-4"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Quay lại
//           </Button>
          
//           <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Chi tiết đơn hàng
//               </h1>
//               <div className="flex items-center gap-4 text-lg mb-2">
//                 <div className="flex items-center gap-2">
//                   <Hash className="h-5 w-5 text-gray-500" />
//                   <span className="font-mono font-medium">{orderCode}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <Calendar className="h-4 w-4" />
//                   <span className="text-sm">{formatOrderDate(order.orderDate)}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col gap-2">
//               <Badge 
//                 variant={orderStatus.color}
//                 className="flex items-center gap-1 text-sm px-3 py-1"
//               >
//                 {orderStatus.label}
//               </Badge>
//               <Badge 
//                 variant={paymentStatus.color}
//                 className="text-sm px-3 py-1"
//               >
//                 {paymentStatus.label}
//               </Badge>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">{/* Order Timeline */}
//             <Card>
//               <CardContent className="p-6">
//                 <OrderTimeline timeline={timeline} />
//               </CardContent>
//             </Card>
//         </div>

//             {/* Order Items */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ShoppingBag className="h-5 w-5" />
//                   Sản phẩm đã đặt ({order.orderItems.length})
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {order.orderItems.map((item, index) => (
//                     <div key={item.id}>
//                       <div className="flex gap-4">
//                         {/* Product Image Placeholder */}
//                         <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
//                           <Package className="w-6 h-6 text-gray-400" />
//                         </div>
                        
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-medium text-gray-900 truncate">
//                             {item.productName}
//                           </h4>
//                           <div className="text-sm text-gray-500 mt-1">
//                             {item.size && <span>Size: {item.size}</span>}
//                             {item.size && item.color && <span> • </span>}
//                             {item.color && <span>Màu: {item.color}</span>}
//                           </div>
//                           <div className="text-sm text-gray-600 mt-1">
//                             {formatCurrency(item.unitPrice)} × {item.quantity}
//                           </div>
//                         </div>
                        
//                         <div className="text-right shrink-0">
//                           <div className="font-medium text-lg">
//                             {formatCurrency(item.subtotal)}
//                           </div>
//                         </div>
//                       </div>
//                       {index < order.orderItems.length - 1 && (
//                         <Separator className="mt-4" />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Order Notes */}
//             {order.notes && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5" />
//                     Ghi chú đơn hàng
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-600 whitespace-pre-wrap">{order.notes}</p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Order Actions */}
//             <Card>
//               <CardContent className="p-6">
//                 <OrderActions 
//                   orderId={order.orderId}
//                   status={order.status}
//                   trackingNumber={order.trackingNumber}
//                   onOrderUpdated={fetchOrderDetail}
//                 />
//               </CardContent>
//             </Card>

//             {/* Order Summary */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <DollarSign className="h-5 w-5" />
//                   Tổng kết đơn hàng
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {order.subtotalAmount && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tạm tính:</span>
//                     <span>{formatCurrency(order.subtotalAmount)}</span>
//                   </div>
//                 )}
                
//                 {order.shippingAmount && order.shippingAmount > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Phí vận chuyển:</span>
//                     <span>{formatCurrency(order.shippingAmount)}</span>
//                   </div>
//                 )}
                
//                 {order.discountAmount && order.discountAmount > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Giảm giá:</span>
//                     <span>-{formatCurrency(order.discountAmount)}</span>
//                   </div>
//                 )}
                
//                 {order.couponCode && (
//                   <div className="flex justify-between text-green-600 text-sm">
//                     <span>Mã giảm giá:</span>
//                     <span className="font-mono">{order.couponCode}</span>
//                   </div>
//                 )}
                
//                 {order.taxAmount && order.taxAmount > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Thuế:</span>
//                     <span>{formatCurrency(order.taxAmount)}</span>
//                   </div>
//                 )}
                
//                 <Separator />
                
//                 <div className="flex justify-between text-lg font-semibold">
//                   <span>Tổng cộng:</span>
//                   <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Customer Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Thông tin khách hàng
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   {order.customerName && (
//                     <div className="flex items-start gap-3">
//                       <User className="h-4 w-4 mt-1 text-gray-400" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="flex items-start gap-3">
//                     <Mail className="h-4 w-4 mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-600">Email</p>
//                       <p className="text-sm font-medium">{order.email}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-start gap-3">
//                     <Phone className="h-4 w-4 mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-600">Số điện thoại</p>
//                       <p className="text-sm font-medium">{order.phoneNumber}</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Shipping Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <MapPin className="h-5 w-5" />
//                   Thông tin giao hàng
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-2">Địa chỉ giao hàng</p>
//                   <p className="text-sm font-medium">{order.shippingAddress}</p>
//                 </div>
                
//                 {order.shippingMethod && (
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Phương thức vận chuyển</p>
//                     <p className="text-sm font-medium">{order.shippingMethod}</p>
//                   </div>
//                 )}
                
//                 {order.trackingNumber && (
//                   <div className="p-3 bg-blue-50 rounded-lg">
//                     <p className="text-sm font-medium text-blue-900 mb-1">Mã vận đơn</p>
//                     <p className="text-sm font-mono text-blue-800">{order.trackingNumber}</p>
//                   </div>
//                 )}
                
//                 {order.estimatedDeliveryDate && (
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Dự kiến giao hàng</p>
//                     <p className="text-sm font-medium text-green-600">
//                       {formatOrderDate(order.estimatedDeliveryDate)}
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Payment Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CreditCard className="h-5 w-5" />
//                   Thông tin thanh toán
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Phương thức:</span>
//                   <span className="font-medium">
//                     {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
//                      order.paymentMethod === 'vnpay' ? 'VNPay' :
//                      order.paymentMethod === 'momo' ? 'MoMo' :
//                      order.paymentMethod}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Trạng thái:</span>
//                   <Badge variant={paymentStatus.color} className="text-xs">
//                     {paymentStatus.label}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
