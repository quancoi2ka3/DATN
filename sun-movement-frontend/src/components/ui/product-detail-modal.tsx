"use client";

import { useState, Suspense } from "react";
import { OptimizedImage } from "./optimized-image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { Plus, Minus, ShoppingCart, Star, Heart, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

// Dynamically import SimilarProducts component
const SimilarProducts = dynamic(
  () => import('@/components/recommendations/SimilarProducts'),
  { ssr: false, loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-md"></div> }
);

interface ProductDetailModalProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductDetailModal({ product, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      const success = await addToCart(product, quantity, selectedSize, selectedColor);
      if (success) {
        setQuantity(1);
        onAddToCart?.();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <OptimizedImage
            src={product.imageUrl || '/placeholder-product.jpg'}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-full object-cover"
            priority
          />
          
          {/* Product badges */}
          {product.discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
              -{product.discount}%
            </div>
          )}
          
          {product.isFeatured && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
              Nổi bật
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Rating */}
          {(product.rating || product.reviews) && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-5 w-5",
                      star <= (product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    )} 
                  />
                ))}
              </div>
              {product.reviews && (
                <span className="text-gray-600">({product.reviews} đánh giá)</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-xl">
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
            <span className="text-3xl font-bold text-blue-600">
              {product.price.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          {product.details && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Chi tiết</h4>
              <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: product.details }} />
            </div>
          )}
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Kích thước</h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-4 py-2 border rounded-md text-sm font-medium transition-colors",
                    selectedSize === size
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
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
            <h3 className="font-semibold text-gray-900 mb-3">Màu sắc</h3>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all",
                    selectedColor === color
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Số lượng</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseQuantity}
                className="h-10 w-10 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {product.stockQuantity && (
              <span className="text-sm text-gray-500">
                (Còn {product.stockQuantity} sản phẩm)
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 h-12 text-lg font-medium"
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <ShoppingCart className="h-5 w-5 mr-2" />
            )}
            {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </Button>
          
          <Button variant="outline" size="lg" className="h-12 px-4">
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 gap-3 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Danh mục:</span>
            <span className="font-medium">{product.category}</span>
          </div>
          {product.brand && (
            <div className="flex justify-between">
              <span>Thương hiệu:</span>
              <span className="font-medium">{product.brand}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Mã sản phẩm:</span>
            <span className="font-medium">{product.id}</span>
          </div>
        </div>

        {/* Similar Products Section - Suspense fallback used here */}
        <div className="pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm tương tự</h2>
          <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-md"></div>}>
            <SimilarProducts productId={product.id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
