"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, isLoading } = useCart();

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    
    try {
      const success = await addToCart(product, quantity, selectedSize, selectedColor);
      if (success) {
        setIsOpen(false);
        setQuantity(1);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative h-64 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">{product.price.toLocaleString()} VNĐ</span>
            <Button size="sm">Xem chi tiết</Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>Chi tiết sản phẩm</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-[300px] w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-gray-700 mb-4">{product.description}</p>
              <div className="text-2xl font-bold mb-4">{product.price.toLocaleString()} VNĐ</div>
              
              <div className="flex items-center gap-2 mb-6">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); decreaseQuantity(); }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); increaseQuantity(); }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
                <Button 
                className="mt-auto" 
                onClick={handleAddToCart} 
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}