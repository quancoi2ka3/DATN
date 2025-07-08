"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "./optimized-image";
import { useEnhancedCart } from "@/lib/enhanced-cart-context";
import { Plus, Minus, Trash2, ShoppingCart, Tag, X, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Enhanced floating cart with coupon support
export default function EnhancedFloatingCart() {
  const { 
    items, 
    totalItems, 
    subtotal,
    totalDiscount,
    finalTotal,
    appliedCoupons,
    updateQuantity, 
    removeFromCart, 
    applyCoupon,
    removeCoupon,
    isLoading 
  } = useEnhancedCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
    } else {
      await updateQuantity(cartItemId, newQuantity);
    }
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

  return (
    <div className="fixed bottom-32 left-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "relative h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
              totalItems > 0 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                : "bg-gray-400 hover:bg-gray-500"
            )}
          >
            <ShoppingCart className="h-8 w-8 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-lg p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                Giỏ hàng ({totalItems} sản phẩm)
              </SheetTitle>
            </SheetHeader>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
                  <Button onClick={() => setIsOpen(false)}>
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden">
                        <OptimizedImage
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        
                        {/* Size and Color */}
                        {(item.size || item.color) && (
                          <div className="flex gap-2 text-xs text-gray-600">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Màu: {item.color}</span>}
                          </div>
                        )}

                        {/* Price with discount */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {item.discountAmount && item.discountAmount > 0 ? (
                              <>
                                <span className="font-semibold text-red-600">
                                  {item.finalPrice.toLocaleString()} VNĐ
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  {item.originalPrice.toLocaleString()} VNĐ
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold">
                                {item.finalPrice.toLocaleString()} VNĐ
                              </span>
                            )}
                          </div>
                          
                          {/* Discount info */}
                          {item.discountAmount && item.discountAmount > 0 && (
                            <div className="flex items-center gap-1">
                              <Badge variant="destructive" className="text-xs">
                                <Percent className="w-3 h-3 mr-1" />
                                -{item.discountAmount.toLocaleString()} VNĐ
                              </Badge>
                              {item.couponCode && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.couponCode}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={isLoading}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2 text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="space-y-4">
                    {/* Applied Coupons */}
                    {appliedCoupons.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Mã giảm giá đã áp dụng:</h4>
                        <div className="flex flex-wrap gap-2">
                          {appliedCoupons.map((code) => (
                            <Badge key={code} variant="secondary" className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {code}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-4 w-4 p-0 ml-1 hover:bg-red-100"
                                onClick={() => handleRemoveCoupon(code)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Coupon */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Thêm mã giảm giá:</h4>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập mã giảm giá"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1"
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
                          className="px-4"
                        >
                          {isApplyingCoupon ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Áp dụng"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-6 border-t bg-white space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính:</span>
                      <span>{subtotal.toLocaleString()} VNĐ</span>
                    </div>
                    
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Giảm giá:</span>
                        <span>-{totalDiscount.toLocaleString()} VNĐ</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển:</span>
                      <span className="text-green-600">Miễn phí</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{finalTotal.toLocaleString()} VNĐ</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    Thanh toán
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
