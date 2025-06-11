"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { CartItem } from "@/lib/types";
import Image from "next/image";
import { Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className }: CartIconProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, isLoading } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setUpdatingItemId(itemId);
    await updateQuantity(itemId, quantity);
    setUpdatingItemId(null);
  };

  const handleRemoveFromCart = async (itemId: string) => {
    setRemovingItemId(itemId);
    await removeFromCart(itemId);
    setRemovingItemId(null);
  };

  const CartItemComponent = ({ item }: { item: CartItem }) => (
    <div className="flex py-4 border-b">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name}</h3>
            <p className="ml-4">{(item.price * item.quantity).toLocaleString()} VNĐ</p>
          </div>
        </div>        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              disabled={updatingItemId === item.id}
            >
              {updatingItemId === item.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              disabled={updatingItemId === item.id}
            >
              {updatingItemId === item.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleRemoveFromCart(item.id)}
            className="text-red-500"
            disabled={removingItemId === item.id}
          >
            {removingItemId === item.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Giỏ hàng</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            <div className="flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>        {items.length > 0 && (
          <div className="border-t border-gray-200 py-6 px-4">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Tổng cộng</p>
              <p>{totalPrice.toLocaleString()} VNĐ</p>
            </div>
            <Button className="w-full" asChild disabled={isLoading}>
              <Link href="/checkout">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Thanh toán'
                )}
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}