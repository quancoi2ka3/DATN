"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShippingAddress, ContactInfo, CheckoutRequest } from "@/lib/checkout-service";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, isLoading, checkout, error } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | undefined>();
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    city: "",
    district: "",
    province: "",
  });
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
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
      <div className="container mx-auto py-10 max-w-3xl">
        <Alert className="bg-green-50 border-green-200 mb-6">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Đặt hàng thành công!</AlertTitle>
          <AlertDescription className="text-green-700">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý thành công.
            {orderId && <p className="font-semibold mt-2">Mã đơn hàng: {orderId}</p>}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => router.push('/')}
            className="mr-4"
          >
            Tiếp tục mua sắm
          </Button>
          <Button 
            variant="outline"
            onClick={() => orderId && router.push(`/account/orders/${orderId}`)}
          >
            Xem chi tiết đơn hàng
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-6">Giỏ hàng của bạn đang trống</p>
          <Button onClick={() => router.push('/store')}>Tiếp tục mua sắm</Button>
        </div>
      ) : (
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
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
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
                        <Label htmlFor="district">Quận / Huyện</Label>
                        <Input 
                          id="district" 
                          value={shippingAddress.district} 
                          onChange={(e) => updateShippingAddress('district', e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Thành phố</Label>
                        <Input 
                          id="city" 
                          value={shippingAddress.city} 
                          onChange={(e) => updateShippingAddress('city', e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="province">Tỉnh</Label>
                        <Input 
                          id="province" 
                          value={shippingAddress.province} 
                          onChange={(e) => updateShippingAddress('province', e.target.value)} 
                          required 
                        />
                      </div>
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
                </div>
                
                {/* Contact Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>
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
                </div>
                  {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
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
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer">Chuyển khoản ngân hàng</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="mt-6 w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Đang xử lý...
                  </>
                ) : (
                  'Hoàn tất đơn hàng'
                )}
              </Button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>
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
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
