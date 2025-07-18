"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useState } from "react";
import { ErrorBoundary } from "./error-boundary";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useEnhancedCart } from "@/lib/enhanced-cart-context";
import { useAuth } from "@/lib/auth-context";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { trackProductView, trackAddToCart } from "@/services/analytics";
import ProductDetailModal from "@/components/ui/product-detail-modal";
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
  const { addToCart, isLoading } = useEnhancedCart();
  const { isAuthenticated, user } = useAuth();

  // Chặn tăng vượt tồn kho
  const increaseQuantity = () => {
    if (product.StockQuantity && quantity < product.StockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Check if user is authenticated
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    // Kiểm tra tồn kho trước khi thêm
    if (product.StockQuantity && quantity > product.StockQuantity) {
      alert(`Chỉ còn ${product.StockQuantity} sản phẩm trong kho!`);
      return;
    }
    setIsAdding(true);
    try {
      // Luôn truyền đúng giá khuyến mãi nếu có
      const productToAdd = {
        ...product,
        price: product.salePrice ?? product.price
      };
      const success = await addToCart(productToAdd, quantity, selectedSize, selectedColor);
      if (success) {
        // Track add to cart event - make it non-blocking
        try {
          if (user?.id) {
            trackAddToCart(user.id, productToAdd, quantity);
          }
        } catch (trackingError) {
          console.warn('Analytics tracking failed but cart operation succeeded:', trackingError);
        }
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
    // Track product view - only for authenticated users
    if (user?.id) {
      trackProductView(user.id, product);
    }
    setIsOpen(true);
  };

  return (
    <ErrorBoundary>
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
              {/* Hiển thị giá */}
              {product.salePrice ? (
                <>
                  <span className="text-sm line-through text-slate-500 mb-1">{product.price.toLocaleString()} VNĐ</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">{product.salePrice.toLocaleString()} VNĐ</span>
                </>
              ) : (
                <span className="text-xl font-bold text-white drop-shadow-sm">{product.price.toLocaleString()} VNĐ</span>
              )}
              {/* Hiển thị tồn kho */}
{product.StockQuantity === 0 ? (
  <span className="text-xs font-bold text-white bg-red-600 px-2 py-1 rounded ml-0 mt-1 inline-block animate-pulse shadow">HẾT HÀNG</span>
) : (
  <span className="text-xs text-gray-400 mt-1">Tồn kho: {product.StockQuantity??0}</span>
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

      <ProductDetailModal
        product={product}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
      
      {/* Login Prompt Dialog */}
      <LoginPromptDialog 
        isOpen={isLoginPromptOpen}
        onOpenChange={setIsLoginPromptOpen}
        message="Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng"
        returnUrl={`/products/${product.id}`}
      />
      </>
    </ErrorBoundary>
  );
}