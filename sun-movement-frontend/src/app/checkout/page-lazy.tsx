"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { LazySection } from "@/components/ui/lazy-sections";
import { CriticalRoutesPrefetch } from "@/components/ui/strategic-prefetch";
import { ShippingAddress, ContactInfo, CheckoutRequest } from "@/lib/checkout-service";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { CartItem } from "@/lib/types";

// Loading skeleton components
const CheckoutFormSkeleton = () => (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse md:col-span-2" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
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
    </div>
  </Card>
);

// Inline checkout form component
const CheckoutForm = ({ 
  shippingAddress, 
  contactInfo, 
  paymentMethod, 
  onUpdateShippingAddress, 
  onUpdateContactInfo, 
  onUpdatePaymentMethod 
}: {
  shippingAddress: ShippingAddress;
  contactInfo: ContactInfo;
  paymentMethod: string;
  onUpdateShippingAddress: (field: keyof ShippingAddress, value: string) => void;
  onUpdateContactInfo: (field: keyof ContactInfo, value: string) => void;
  onUpdatePaymentMethod: (method: string) => void;
}) => (
  <div className="space-y-6">
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Họ và tên *</Label>
          <Input
            id="fullName"
            type="text"
            value={shippingAddress.fullName}
            onChange={(e) => onUpdateShippingAddress('fullName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input
            id="phone"
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => onUpdateContactInfo('phone', e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={contactInfo.email}
            onChange={(e) => onUpdateContactInfo('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">Thành phố *</Label>
          <Input
            id="city"
            type="text"
            value={shippingAddress.city}
            onChange={(e) => onUpdateShippingAddress('city', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="province">Tỉnh/Thành phố *</Label>
          <Input
            id="province"
            type="text"
            value={shippingAddress.province}
            onChange={(e) => onUpdateShippingAddress('province', e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="addressLine1">Địa chỉ chi tiết *</Label>
          <Textarea
            id="addressLine1"
            value={shippingAddress.addressLine1}
            onChange={(e) => onUpdateShippingAddress('addressLine1', e.target.value)}
            placeholder="Số nhà, tên đường, phường/xã..."
            required
          />
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
      <RadioGroup value={paymentMethod} onValueChange={onUpdatePaymentMethod}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cash_on_delivery" id="cod" />
          <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bank_transfer" id="transfer" />
          <Label htmlFor="transfer">Chuyển khoản ngân hàng</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="credit_card" id="card" />
          <Label htmlFor="card">Thẻ tín dụng (Coming soon)</Label>
        </div>
      </RadioGroup>
    </Card>
  </div>
);

// Inline order summary component
const OrderSummary = ({ items, totalPrice, isLoading }: {
  items: CartItem[];
  totalPrice: number;
  isLoading: boolean;
}) => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
    
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-start space-x-3">
          <div className="relative w-16 h-16 flex-shrink-0">
            <OptimizedImage
              src={item.imageUrl}
              alt={item.name}
              width={64}
              height={64}
              className="rounded-md object-cover"
            />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {item.quantity}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{item.name}</h3>
            <p className="text-xs text-gray-500">
              {item.size && `Size: ${item.size}`}
              {item.size && item.color && ' - '}
              {item.color && `Color: ${item.color}`}
            </p>
            <p className="text-sm font-medium text-blue-600">
              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>
      ))}
    </div>

    <hr className="my-4" />
    
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Tạm tính:</span>
        <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Phí vận chuyển:</span>
        <span>Miễn phí</span>
      </div>
      <div className="flex justify-between text-lg font-semibold pt-2 border-t">
        <span>Tổng cộng:</span>
        <span className="text-blue-600">{totalPrice.toLocaleString('vi-VN')}đ</span>
      </div>
    </div>

    {isLoading && (
      <div className="mt-4 text-center text-sm text-gray-500">
        Đang xử lý...
      </div>
    )}
  </Card>
);

// Success screen component
const SuccessScreen = ({ orderId, onContinueShopping, onViewOrder }: {
  orderId?: string;
  onContinueShopping: () => void;
  onViewOrder: () => void;
}) => (
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
      <Button onClick={onContinueShopping} className="mr-4">
        Tiếp tục mua sắm
      </Button>
      <Button variant="outline" onClick={onViewOrder}>
        Xem chi tiết đơn hàng
      </Button>
    </div>
  </div>
);

export default function CheckoutPageSimple() {
  const router = useRouter();
  const { items, totalPrice, isLoading, checkout, error } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | undefined>();
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    city: "",
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

  // Success screen handlers
  const handleContinueShopping = () => router.push('/');
  const handleViewOrder = () => {
    if (orderId) {
      router.push(`/account/orders/${orderId}`);
    }
  };

  if (orderSuccess) {
    return (
      <SuccessScreen 
        orderId={orderId}
        onContinueShopping={handleContinueShopping}
        onViewOrder={handleViewOrder}
      />
    );
  }

  return (
    <>
      {/* Strategic prefetch for related routes */}
      <CriticalRoutesPrefetch />
      
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
        
        {/* Error alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty cart alert */}
        {items.length === 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Giỏ hàng trống</AlertTitle>
            <AlertDescription>
              Bạn chưa có sản phẩm nào trong giỏ hàng. 
              <Button variant="link" onClick={() => router.push('/')} className="p-0 ml-1">
                Tiếp tục mua sắm
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {items.length > 0 && (
          <form onSubmit={handleCheckout}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout form - lazy loaded */}
              <div className="lg:col-span-2">
                <LazySection>
                  <Suspense fallback={<CheckoutFormSkeleton />}>
                    <CheckoutForm 
                      shippingAddress={shippingAddress}
                      contactInfo={contactInfo}
                      paymentMethod={paymentMethod}
                      onUpdateShippingAddress={updateShippingAddress}
                      onUpdateContactInfo={updateContactInfo}
                      onUpdatePaymentMethod={setPaymentMethod}
                    />
                  </Suspense>
                </LazySection>
              </div>

              {/* Order summary - lazy loaded */}
              <div>
                <LazySection>
                  <Suspense fallback={<OrderSummarySkeleton />}>
                    <OrderSummary 
                      items={items}
                      totalPrice={totalPrice}
                      isLoading={isLoading}
                    />
                  </Suspense>
                </LazySection>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isLoading || items.length === 0}
                >
                  {isLoading ? "Đang xử lý..." : "Đặt hàng"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
