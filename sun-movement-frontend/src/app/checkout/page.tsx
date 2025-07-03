"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShippingAddress, ContactInfo, CheckoutRequest } from "@/lib/checkout-service";
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthModal from "@/components/auth/AuthModal";
import { toast } from "@/hooks/use-toast";

// Loading skeleton components for better UX
const CheckoutFormSkeleton = () => (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 gap-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </Card>
    <Card className="p-6">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </Card>
    <Card className="p-6">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
      </div>
    </Card>
  </div>
);

const OrderSummarySkeleton = () => (
  <Card className="p-6">
    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="space-y-3">
      <div className="h-16 bg-gray-200 rounded animate-pulse" />
      <div className="h-16 bg-gray-200 rounded animate-pulse" />
      <hr className="my-4" />
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex justify-between border-t pt-2">
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </Card>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { items, totalPrice, isLoading, checkout, error } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | undefined>();
  
  // Check authentication on page load
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Show authentication required message instead of redirecting immediately
      return;
    }
  }, [isAuthenticated, authLoading]);

  // If still loading auth, show loading state with skeleton
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="md:col-span-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
              <CheckoutFormSkeleton />
            </div>
            <div>
              <OrderSummarySkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8">
            <div className="text-center">
              <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Yêu cầu đăng nhập
              </h1>
              <p className="text-gray-600 mb-6">
                Bạn cần đăng nhập để tiến hành thanh toán. Việc này giúp chúng tôi bảo vệ thông tin đơn hàng và hỗ trợ bạn tốt hơn.
              </p>
              
              <div className="space-y-4">
                <AuthModal defaultMode="login">
                  <Button size="lg" className="w-full">
                    Đăng nhập để tiếp tục
                  </Button>
                </AuthModal>
                
                <div className="text-sm text-gray-500">
                  Chưa có tài khoản?{" "}
                  <AuthModal defaultMode="register">
                    <button className="text-blue-600 hover:underline">
                      Đăng ký ngay
                    </button>
                  </AuthModal>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  Quay lại trang chủ
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
    addressLine1: "",
    city: "",
    province: "",
  });
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: user?.email || "",
    phone: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  // Update form state
  const updateShippingAddress = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  // Handle checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      return;
    }
    
    const checkoutDetails: CheckoutRequest = {
      shippingAddress,
      contactInfo,
      paymentMethod,
    };
    
    const result = await checkout(checkoutDetails);
    
    if (result.success) {
      setOrderSuccess(true);
      setOrderId(result.orderId);
    }
  };
  
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-8">
            <Alert className="bg-green-50 border-green-200 mb-6">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Đặt hàng thành công!</AlertTitle>
              <AlertDescription className="text-green-700">
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý thành công.
                {orderId && <p className="font-semibold mt-2">Mã đơn hàng: {orderId}</p>}
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/')}
                size="lg"
              >
                Tiếp tục mua sắm
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => orderId && router.push(`/orders/${orderId}`)}
              >
                Xem chi tiết đơn hàng
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán</h1>
          
          {items.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h2>
                <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán</p>
                <Button onClick={() => router.push('/store/sportswear')} size="lg">
                  Bắt đầu mua sắm
                </Button>
              </div>
            </Card>
          ) : (
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <CheckoutFormSkeleton />
                </div>
                <div>
                  <OrderSummarySkeleton />
                </div>
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="md:col-span-2">
                  <form onSubmit={handleCheckout}>
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-6">
                      {/* Shipping Information */}
                      <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="fullName">Họ và tên</Label>
                              <Input 
                                id="fullName" 
                                value={shippingAddress.fullName} 
                                onChange={(e) => updateShippingAddress('fullName', e.target.value)} 
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="addressLine1">Địa chỉ</Label>
                              <Input 
                                id="addressLine1" 
                                value={shippingAddress.addressLine1} 
                                onChange={(e) => updateShippingAddress('addressLine1', e.target.value)} 
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="addressLine2">Địa chỉ bổ sung (tùy chọn)</Label>
                              <Input 
                                id="addressLine2" 
                                value={shippingAddress.addressLine2 || ''} 
                                onChange={(e) => updateShippingAddress('addressLine2', e.target.value)} 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="city">Thành phố</Label>
                                <Input 
                                  id="city" 
                                  value={shippingAddress.city} 
                                  onChange={(e) => updateShippingAddress('city', e.target.value)} 
                                  required 
                                />
                              </div>
                              <div>
                                <Label htmlFor="province">Tỉnh / Thành phố</Label>
                                <Input 
                                  id="province" 
                                  value={shippingAddress.province} 
                                  onChange={(e) => updateShippingAddress('province', e.target.value)} 
                                  required 
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="zipCode">Mã bưu điện (tùy chọn)</Label>
                                <Input 
                                  id="zipCode" 
                                  value={shippingAddress.zipCode || ''} 
                                  onChange={(e) => updateShippingAddress('zipCode', e.target.value)} 
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Contact Information */}
                      <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email" 
                                type="email" 
                                value={contactInfo.email} 
                                onChange={(e) => updateContactInfo('email', e.target.value)} 
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Số điện thoại</Label>
                              <Input 
                                id="phone" 
                                value={contactInfo.phone} 
                                onChange={(e) => updateContactInfo('phone', e.target.value)} 
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                              <Textarea 
                                id="notes" 
                                value={contactInfo.notes || ''} 
                                onChange={(e) => updateContactInfo('notes', e.target.value)} 
                                placeholder="Ghi chú về đơn hàng của bạn" 
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Payment Method */}
                      <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                          <RadioGroup 
                            value={paymentMethod} 
                            onValueChange={setPaymentMethod}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                              <Label htmlFor="cash_on_delivery">Thanh toán khi nhận hàng (COD)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="vnpay" id="vnpay" />
                              <Label htmlFor="vnpay">Thanh toán qua VNPay</Label>
                            </div>
                          </RadioGroup>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <LoadingButton 
                      type="submit" 
                      className="mt-6 w-full" 
                      size="lg"
                      isLoading={isLoading}
                      loadingText="Đang xử lý..."
                    >
                      Hoàn tất đơn hàng
                    </LoadingButton>
                  </form>
                </div>
                
                {/* Order Summary */}
                <div>
                  <Card className="p-6 sticky top-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-lg">Đơn hàng của bạn</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div className="space-y-4 mb-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantity} x {item.price.toLocaleString()} VNĐ
                                {item.size && ` / ${item.size}`}
                                {item.color && ` / ${item.color}`}
                              </p>
                            </div>
                            <p className="font-medium">{(item.price * item.quantity).toLocaleString()} VNĐ</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between mb-2">
                          <span>Tạm tính</span>
                          <span>{totalPrice.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Phí vận chuyển</span>
                          <span>Miễn phí</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Tổng cộng</span>
                          <span>{totalPrice.toLocaleString()} VNĐ</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
