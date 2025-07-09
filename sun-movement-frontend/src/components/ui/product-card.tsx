"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { trackProductView, trackAddToCart } from "@/services/analytics";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    
    setIsAdding(true);
    
    try {
      const success = await addToCart(product, quantity, selectedSize, selectedColor);
      if (success) {
        // Track add to cart event
        trackAddToCart('anonymous', product, quantity);
        setIsOpen(false);
        setQuantity(1);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleProductClick = () => {
    // Track product view
    trackProductView('anonymous', product);
    setIsOpen(true);
  };

  return (
    <>
      <div 
        className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:border-red-500/30"
        onClick={handleProductClick}
      >
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.salePrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
            </div>
          )}
        </div>
        <div className="p-5 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-t border-slate-700/30">
          <div className="mb-3">
            <h3 className="text-xl font-bold mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400 transition-all duration-300 line-clamp-1">{product.name}</h3>
            {product.subCategory && (
              <div className="text-xs font-semibold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent uppercase tracking-wide">
                {product.subCategory}
              </div>
            )}
          </div>
          <p className="text-slate-300 mb-4 line-clamp-2 leading-relaxed text-sm group-hover:text-slate-200 transition-colors duration-300">{product.description}</p>
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              {product.salePrice ? (
                <>
                  <span className="text-sm line-through text-slate-500 mb-1">{product.price.toLocaleString()} VNĐ</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">{product.salePrice.toLocaleString()} VNĐ</span>
                </>
              ) : (
                <span className="text-xl font-bold text-white drop-shadow-sm">{product.price.toLocaleString()} VNĐ</span>
              )}
              {product.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(product.rating ?? 0) ? 'text-yellow-400' : 'text-slate-600'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs">({product.reviews})</span>
                </div>
              )}
            </div>
            <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold">
              Chi tiết
            </Button>
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
      
      {/* Login Prompt Dialog */}
      <LoginPromptDialog 
        isOpen={isLoginPromptOpen}
        onOpenChange={setIsLoginPromptOpen}
        message="Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng"
        returnUrl={`/products/${product.id}`}
      />
    </>
  );
}