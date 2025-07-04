"use client";

import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/images/placeholder-product.jpg';
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7297';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

export default function FloatingCart() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, isLoading } = useCart();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="fixed bottom-32 left-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "relative h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
              "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
              "border-4 border-white dark:border-gray-800",
              totalItems > 0 ? "animate-pulse" : ""
            )}
          >
            <ShoppingCart className="h-6 w-6 text-white" />
            {totalItems > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Giỏ hàng của bạn ({totalItems} sản phẩm)
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Giỏ hàng trống</p>
                <p className="text-sm text-center">
                  Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex-shrink-0">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-md bg-gray-200"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-500 mb-2">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Màu: ${item.color}`}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-600">
                          {formatCurrency(item.price)}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t pt-4 mt-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{formatCurrency(totalPrice)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Tiếp tục mua
                </Button>
                <Button 
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
