"use client";

import { Card } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { CartItem } from "@/lib/types";

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  isLoading: boolean;
}

export default function OrderSummary({ items, totalPrice, isLoading }: OrderSummaryProps) {
  return (
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
}
