"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { ShippingAddress, ContactInfo } from "@/lib/checkout-service";

interface CheckoutFormProps {
  shippingAddress: ShippingAddress;
  contactInfo: ContactInfo;
  paymentMethod: string;
  onUpdateShippingAddress: (field: keyof ShippingAddress, value: string) => void;
  onUpdateContactInfo: (field: keyof ContactInfo, value: string) => void;
  onUpdatePaymentMethod: (method: string) => void;
}

export default function CheckoutForm({
  shippingAddress,
  contactInfo,
  paymentMethod,
  onUpdateShippingAddress,
  onUpdateContactInfo,
  onUpdatePaymentMethod
}: CheckoutFormProps) {
  return (
    <div className="space-y-6">
      {/* Shipping Address */}
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

      {/* Payment Method */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
        <RadioGroup value={paymentMethod} onValueChange={onUpdatePaymentMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash_on_delivery" id="cod" />
            <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vnpay" id="vnpay" />
            <Label htmlFor="vnpay">Thanh toán qua VNPay</Label>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
}
