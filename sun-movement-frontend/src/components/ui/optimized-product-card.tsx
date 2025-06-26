"use client";

import { OptimizedImage } from "./optimized-image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useState, memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Minus, ShoppingCart, Star, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

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
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 text-black hover:bg-white shadow-lg"
    >
      {isAdding ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </Button>
  );
});

QuickAddButton.displayName = 'QuickAddButton';

// Wishlist button component
const WishlistButton = memo(({ productId }: { productId: string }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Add to wishlist API call
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
    >
      <Heart 
        className={cn(
          "w-4 h-4 transition-colors",
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
        )} 
      />
    </button>
  );
});

WishlistButton.displayName = 'WishlistButton';

// Product rating component
const ProductRating = memo(({ rating = 4.5, reviews = 0 }: { rating?: number; reviews?: number }) => (
  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={cn(
            "w-4 h-4",
            i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          )} 
        />
      ))}
    </div>
    <span className="ml-1">({reviews})</span>
  </div>
));

ProductRating.displayName = 'ProductRating';

// Main product card component
export const OptimizedProductCard = memo(({ 
  product, 
  variant = "default",
  showWishlist = true 
}: ProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { addToCart } = useCart();

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
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isCompact = variant === "compact";

  return (
    <>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right">
          ✅ Đã thêm {product.name} vào giỏ hàng!
        </div>
      )}

      <div 
        className={cn(
          "group relative bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer",
          "hover:shadow-xl hover:-translate-y-1",
          "border border-gray-100 hover:border-gray-200",
          isCompact ? "shadow-sm" : "shadow-md"
        )}
        onClick={() => setIsOpen(true)}
      >
        {/* Image Container */}
        <div className={cn("relative overflow-hidden", isCompact ? "h-48" : "h-64")}>
          <OptimizedImage
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick actions */}
          <QuickAddButton 
            product={product} 
            onSuccess={() => {
              setShowSuccessToast(true);
              setTimeout(() => setShowSuccessToast(false), 3000);
            }}
          />
          {showWishlist && <WishlistButton productId={product.id} />}
          
          {/* Discount badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn("p-4", isCompact && "p-3")}>
          <ProductRating rating={product.rating} reviews={product.reviews} />
          
          <h3 className={cn(
            "font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors",
            isCompact ? "text-sm" : "text-lg"
          )}>
            {product.name}
          </h3>
          
          <p className={cn(
            "text-gray-600 mb-3 line-clamp-2",
            isCompact ? "text-xs" : "text-sm"
          )}>
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-bold text-primary",
                isCompact ? "text-lg" : "text-xl"
              )}>
                {product.price.toLocaleString()} VNĐ
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()} VNĐ
                </span>
              )}
            </div>
          </div>

          {/* Colors preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mb-3">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 4}</span>
              )}
            </div>
          )}

          {/* Action button */}
          <Button 
            className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
            variant="outline"
            size={isCompact ? "sm" : "default"}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <OptimizedImage
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <ProductRating rating={product.rating} reviews={product.reviews} />
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-primary">
                    {product.price.toLocaleString()} VNĐ
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {product.originalPrice.toLocaleString()} VNĐ
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Kích thước:</label>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSize(size);
                        }}
                        className={cn(
                          "px-4 py-2 border rounded-lg transition-all",
                          selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-primary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Màu sắc:</label>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedColor(color);
                        }}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          selectedColor === color
                            ? "border-primary scale-110"
                            : "border-gray-300 hover:border-primary"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">Số lượng:</label>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); decreaseQuantity(); }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); increaseQuantity(); }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-3 text-lg font-semibold"
                size="lg"
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Đang thêm...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';
