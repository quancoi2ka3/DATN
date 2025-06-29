"use client";

import { OptimizedImage } from "./optimized-image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useState, memo, Suspense } from "react";
import { LazyModal } from "./lazy-modal";
import { Plus, Minus, ShoppingCart, Star, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  showWishlist?: boolean;
}

// Quick add to cart component
const QuickAddButton = memo(({ 
  product, 
  onSuccess 
}: { 
  product: Product; 
  onSuccess?: () => void;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    
    try {
      const success = await addToCart(product, 1);
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleQuickAdd}
      disabled={isAdding}
      size="sm"
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all-smooth bg-white/90 text-black hover:bg-white shadow-lg hover-lift button-press"
      aria-label={`Thêm ${product.name} vào giỏ hàng`}
    >
      {isAdding ? (
        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </Button>
  );
});

QuickAddButton.displayName = 'QuickAddButton';

// Wishlist button component
const WishlistButton = memo(({ product }: { product: Product }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    // Add wishlist logic here
  };

  return (
    <Button
      onClick={handleWishlist}
      size="sm"
      variant="ghost"
      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all-smooth bg-white/90 hover:bg-white shadow-lg"
      aria-label={`${isLiked ? 'Bỏ' : 'Thêm'} ${product.name} khỏi danh sách yêu thích`}
    >
      <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
    </Button>
  );
});

WishlistButton.displayName = 'WishlistButton';

// Product rating component
const ProductRating = memo(({ rating = 0, reviews = 0 }: { rating?: number; reviews?: number }) => (
  <div className="flex items-center text-sm text-gray-600">
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          )} 
        />
      ))}
    </div>
    <span className="ml-1">({reviews})</span>
  </div>
));

ProductRating.displayName = 'ProductRating';

// Simple product detail component
const SimpleProductDetail = ({ product, onAddToCart }: { product: Product; onAddToCart?: () => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const success = await addToCart(product, quantity);
      if (success) {
        onAddToCart?.();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="aspect-square overflow-hidden rounded-lg">
        <OptimizedImage
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-600 mt-2">{product.description}</p>
        </div>
        <div className="text-2xl font-bold text-blue-600">
          {product.price.toLocaleString('vi-VN')}đ
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(prev => prev > 1 ? prev - 1 : 1)}
              className="h-10 w-10 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(prev => prev + 1)}
              className="h-10 w-10 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full"
        >
          {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
        </Button>
      </div>
    </div>
  );
};

// Main product card component
export const OptimizedProductCard = memo(({ 
  product, 
  variant = "default",
  showWishlist = true 
}: ProductCardProps) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const isCompact = variant === "compact";

  const handleSuccessAdd = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <>
      {/* Enhanced Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
          <ShoppingCart className="h-4 w-4" />
          <span>Đã thêm vào giỏ hàng!</span>
        </div>
      )}

      <div className={cn(
        "group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all-smooth overflow-hidden hover-lift",
        isCompact ? "max-w-xs" : "max-w-sm"
      )}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <OptimizedImage
            src={product.imageUrl || '/placeholder-product.jpg'}
            alt={product.name}
            width={isCompact ? 200 : 300}
            height={isCompact ? 200 : 300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
          
          {/* Product badges */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              -{product.discount}%
            </div>
          )}
          
          {product.isFeatured && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
              Nổi bật
            </div>
          )}

          {/* Action buttons */}
          <QuickAddButton product={product} onSuccess={handleSuccessAdd} />
          {showWishlist && <WishlistButton product={product} />}
        </div>

        {/* Product Info */}
        <div className={cn("p-4", isCompact && "p-3")}>
          <h3 className={cn(
            "font-semibold text-gray-900 mb-2 line-clamp-2",
            isCompact ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>

          {!isCompact && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <ProductRating rating={product.rating} reviews={product.reviews} />

          {/* Price */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-gray-400 line-through text-sm">
                  {product.originalPrice.toLocaleString('vi-VN')}đ
                </span>
              )}
              <span className={cn(
                "font-bold text-blue-600",
                isCompact ? "text-lg" : "text-xl"
              )}>
                {product.price.toLocaleString('vi-VN')}đ
              </span>
            </div>

            {/* Lazy Modal for Product Details */}
            <LazyModal
              trigger={
                <Button
                  size={isCompact ? "sm" : "default"}
                  className="button-press"
                  aria-label={`Xem chi tiết ${product.name}`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isCompact ? "Mua" : "Thêm vào giỏ"}
                </Button>
              }
              className="max-w-4xl max-h-[90vh]"
            >
              <SimpleProductDetail 
                product={product}
                onAddToCart={handleSuccessAdd}
              />
            </LazyModal>
          </div>

          {/* Size/Color indicators */}
          {!isCompact && (product.sizes?.length || product.colors?.length) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {product.sizes?.length && (
                <div className="text-xs text-gray-500 mb-1">
                  Sizes: {product.sizes.slice(0, 3).join(', ')}
                  {product.sizes.length > 3 && '...'}
                </div>
              )}
              {product.colors?.length && (
                <div className="flex gap-1">
                  {product.colors.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 4 && (
                    <div className="w-4 h-4 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-xs">
                      +{product.colors.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';
