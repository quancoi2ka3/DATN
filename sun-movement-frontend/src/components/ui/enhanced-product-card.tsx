"use client";

import { OptimizedImage } from "./optimized-image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useState, memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Minus, ShoppingCart, Star, Heart, Tag, Percent } from "lucide-react";
import { useEnhancedCart } from "@/lib/enhanced-cart-context";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  showWishlist?: boolean;
}

// Enhanced product card with coupon support
const CouponBadge = memo(({ discount, couponCode }: { discount: number; couponCode?: string }) => (
  <div className="absolute top-2 left-2 z-10">
    <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-lg">
      <Percent className="w-3 h-3" />
      -{discount}%
    </div>
    {couponCode && (
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium mt-1 flex items-center gap-1 shadow-lg">
        <Tag className="w-3 h-3" />
        {couponCode}
      </div>
    )}
  </div>
));

CouponBadge.displayName = 'CouponBadge';

const PriceDisplay = memo(({ product }: { product: Product }) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  // Parse discount info from product details if available
  const discountInfo = parseDiscountInfo(product.details);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {hasDiscount ? (
          <>
            <span className="text-lg font-bold text-red-600">
              {product.salePrice!.toLocaleString()} VNĐ
            </span>
            <span className="text-sm text-gray-500 line-through">
              {product.price.toLocaleString()} VNĐ
            </span>
          </>
        ) : (
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString()} VNĐ
          </span>
        )}
      </div>
      
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
            Tiết kiệm {(product.price - product.salePrice!).toLocaleString()} VNĐ
          </span>
          {discountInfo.couponCode && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              Mã: {discountInfo.couponCode}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

PriceDisplay.displayName = 'PriceDisplay';

// Parse discount information from product details
function parseDiscountInfo(details?: string) {
  const info = {
    discount: 0,
    couponCode: '',
    couponType: '',
    couponValue: 0
  };

  if (!details) return info;

  const discountMatch = details.match(/\|DISCOUNT:([^|]+)\|/);
  const couponMatch = details.match(/\|COUPON:([^|]+)\|/);
  const typeMatch = details.match(/\|TYPE:([^|]+)\|/);
  const valueMatch = details.match(/\|VALUE:([^|]+)\|/);

  if (discountMatch) info.discount = parseFloat(discountMatch[1]) || 0;
  if (couponMatch) info.couponCode = couponMatch[1];
  if (typeMatch) info.couponType = typeMatch[1];
  if (valueMatch) info.couponValue = parseFloat(valueMatch[1]) || 0;

  return info;
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
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const { addToCart } = useEnhancedCart();
  const { isAuthenticated } = useAuth();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    
    setIsAdding(true);
    
    try {
      const success = await addToCart(product, 1);
      if (success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleQuickAdd}
        disabled={isAdding}
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all-smooth bg-white/90 text-black hover:bg-white shadow-lg hover-lift button-press"
      >
        {isAdding ? (
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>
      
      <LoginPromptDialog 
        isOpen={isLoginPromptOpen}
        onOpenChange={setIsLoginPromptOpen}
        message="Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng"
        returnUrl={`/products/${product.id}`}
      />
    </>
  );
});

QuickAddButton.displayName = 'QuickAddButton';

// Wishlist button component
const WishlistButton = memo(({ productId }: { productId: string }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white z-20"
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

// Main enhanced product card component
export const EnhancedProductCard = memo(({ 
  product, 
  variant = "default",
  showWishlist = true 
}: ProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useEnhancedCart();
  const { isAuthenticated } = useAuth();
  const { showError } = useNotification();
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    
    setIsAdding(true);
    
    try {
      const success = await addToCart(product, quantity, selectedSize, selectedColor);
      if (success) {
        setIsOpen(false);
        setQuantity(1);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  const isCompact = variant === "compact";
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountInfo = parseDiscountInfo(product.details);
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : discountInfo.discount > 0 
      ? Math.round((discountInfo.discount / product.price) * 100)
      : 0;

  return (
    <>
      <div 
        className={cn(
          "product-card-enhanced force-enhanced-hover group relative bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200",
          isCompact ? "shadow-sm" : "shadow-md"
        )}
        style={{
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          e.currentTarget.style.boxShadow = '';
        }}
        onClick={() => setIsOpen(true)}
      >
        {/* Discount Badge */}
        {(hasDiscount || discountPercentage > 0) && (
          <CouponBadge 
            discount={discountPercentage} 
            couponCode={discountInfo.couponCode}
          />
        )}

        {/* Wishlist Button */}
        {showWishlist && (
          <WishlistButton productId={product.id} />
        )}

        {/* Quick Add Button */}
        <QuickAddButton product={product} />

        {/* Product Image */}
        <div className={cn("aspect-square overflow-hidden", isCompact ? "h-48" : "h-64")}>
          <OptimizedImage
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            priority={false}
          />
        </div>

        {/* Product Info */}
        <div className={cn("p-4", isCompact && "p-3")}>
          {/* Product Rating */}
          <ProductRating rating={product.rating} reviews={product.reviews} />

          {/* Product Name */}
          <h3 className={cn(
            "font-semibold text-gray-900 mb-2 line-clamp-2",
            isCompact ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>

          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
          )}

          {/* Price Display */}
          <PriceDisplay product={product} />

          {/* Stock Status */}
          {product.StockQuantity !== undefined && (
            <div className="mt-2">
              {product.StockQuantity > 0 ? (
                <span className="text-green-600 text-sm font-medium">
                  Còn hàng ({product.StockQuantity})
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium">
                  Hết hàng
                </span>
              )}
            </div>
          )}

          {/* Product Tags */}
          <div className="flex gap-1 mt-2">
            {product.isNew && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                Mới
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Bán chạy
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                Nổi bật
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <OptimizedImage
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {/* Discount Badge in Modal */}
              {(hasDiscount || discountPercentage > 0) && (
                <div className="absolute top-4 left-4">
                  <CouponBadge 
                    discount={discountPercentage} 
                    couponCode={discountInfo.couponCode}
                  />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Rating */}
              <ProductRating rating={product.rating} reviews={product.reviews} />

              {/* Brand */}
              {product.brand && (
                <div>
                  <span className="text-gray-600">Thương hiệu: </span>
                  <span className="font-medium">{product.brand}</span>
                </div>
              )}

              {/* Price */}
              <PriceDisplay product={product} />

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="font-semibold mb-2">Mô tả sản phẩm</h4>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Màu sắc:</h4>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-3 py-1 rounded-md border text-sm font-medium transition-colors",
                          selectedColor === color
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Kích thước:</h4>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-3 py-1 rounded-md border text-sm font-medium transition-colors",
                          selectedSize === size
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <h4 className="font-semibold mb-2">Số lượng:</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              {product.StockQuantity !== undefined && (
                <div>
                  {product.StockQuantity > 0 ? (
                    <span className="text-green-600 font-medium">
                      ✓ Còn hàng ({product.StockQuantity} sản phẩm)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ✗ Hết hàng
                    </span>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || (product.StockQuantity !== undefined && product.StockQuantity === 0)}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang thêm...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    {product.StockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                  </div>
                )}
              </Button>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h4 className="font-semibold mb-2">Thông số kỹ thuật</h4>
                  <p className="text-gray-700 whitespace-pre-line">{product.specifications}</p>
                </div>
              )}
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
});

EnhancedProductCard.displayName = 'EnhancedProductCard';

export default EnhancedProductCard;
