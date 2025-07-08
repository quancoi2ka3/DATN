"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useEnhancedCart } from "@/lib/enhanced-cart-context";
import { CheckoutRequest } from "@/lib/checkout-service";
import { ShoppingCart, CreditCard, Truck, Tag, Percent, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";

export default function EnhancedCheckoutPage() {
  const { 
    items, 
    subtotal,
    totalDiscount,
    finalTotal,
    appliedCoupons,
    applyCoupon,
    removeCoupon,
    checkout,
    isLoading 
  } = useEnhancedCart();
  
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showError } = useNotification();

  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    zipCode: "",
    notes: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?returnUrl=/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, items.length, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    try {
      const success = await applyCoupon(couponCode.trim().toUpperCase());
      if (success) {
        setCouponCode("");
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async (code: string) => {
    await removeCoupon(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.addressLine1) {
      showError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsProcessing(true);

    try {
      const checkoutData: CheckoutRequest = {
        shippingAddress: {
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          province: formData.province,
          zipCode: formData.zipCode
        },
        contactInfo: {
          email: formData.email,
          phone: formData.phoneNumber,
          notes: formData.notes
        },
        paymentMethod: paymentMethod
      };

      const result = await checkout(checkoutData);
      
      if (result.success) {
        router.push(`/order-success?orderId=${result.orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine1">Địa chỉ *</Label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine2">Địa chỉ chi tiết</Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                      placeholder="Tầng, căn hộ, tòa nhà (tùy chọn)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Thành phố</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Tỉnh</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => handleInputChange("province", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Mã bưu chính</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Ghi chú đơn hàng</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="vnpay" id="vnpay" />
                    <Label htmlFor="vnpay" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">VNPay</div>
                          <div className="text-sm text-gray-600">Thanh toán qua cổng VNPay</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                          <Truck className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-gray-600">Chuyển khoản trực tiếp qua ngân hàng</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Mã giảm giá
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Applied Coupons */}
                {appliedCoupons.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Đã áp dụng:</h4>
                    <div className="space-y-2">
                      {appliedCoupons.map((code) => (
                        <div key={code} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {code}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveCoupon(code)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Coupon */}
                <div className="space-y-2">
                  <Label>Thêm mã giảm giá:</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyCoupon();
                        }
                      }}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || isApplyingCoupon}
                      size="sm"
                    >
                      {isApplyingCoupon ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Đơn hàng của bạn ({items.length} sản phẩm)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        
                        {(item.size || item.color) && (
                          <div className="flex gap-2 text-xs text-gray-600">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Màu: {item.color}</span>}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            {item.discountAmount && item.discountAmount > 0 ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-red-600 text-sm">
                                    {item.finalPrice.toLocaleString()} VNĐ
                                  </span>
                                  <span className="text-xs text-gray-500 line-through">
                                    {item.originalPrice.toLocaleString()} VNĐ
                                  </span>
                                </div>
                                {item.couponCode && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.couponCode}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="font-semibold text-sm">
                                {item.finalPrice.toLocaleString()} VNĐ
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-medium">x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString()} VNĐ</span>
                  </div>
                  
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        Giảm giá:
                      </span>
                      <span>-{totalDiscount.toLocaleString()} VNĐ</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{finalTotal.toLocaleString()} VNĐ</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="text-center p-2 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-sm text-green-700 font-medium">
                        🎉 Bạn đã tiết kiệm được {totalDiscount.toLocaleString()} VNĐ!
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isProcessing || isLoading}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </div>
                  ) : (
                    `Đặt hàng • ${finalTotal.toLocaleString()} VNĐ`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
