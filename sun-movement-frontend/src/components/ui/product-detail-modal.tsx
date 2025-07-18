"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useEnhancedCart } from "@/lib/enhanced-cart-context";
import { cn } from "@/lib/utils";
import productService from "@/services/productService";
import { OptimizedImage } from "./optimized-image";
import { useAuth } from "@/lib/auth-context";
import { LoginPromptDialog } from "@/components/ui/login-prompt-dialog";

interface ProductDetailModalProps {
  productId?: string;
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: () => void;
}

export default function ProductDetailModal({ productId, product: productProp, open, onOpenChange, onAddToCart }: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(productProp ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const { addToCart } = useEnhancedCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!open) return;
    setQuantity(1);
    setSelectedSize(undefined);
    if (productProp) {
      setProduct(productProp);
      setSelectedSize(productProp.sizes?.[0]);
      setLoading(false);
      setError(null);
    } else if (productId) {
      setLoading(true);
      setError(null);
      setProduct(null);
      productService.getProductById(productId)
        .then((data: Product | null) => {
          setProduct(data);
          setSelectedSize(data?.sizes?.[0]);
        })
        .catch((err: unknown) => setError("Không thể tải thông tin sản phẩm."))
        .finally(() => setLoading(false));
    }
  }, [productId, productProp, open]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    setIsAdding(true);
    try {
      const success = await addToCart(product, quantity, selectedSize);
      if (success) {
        setQuantity(1);
        onAddToCart?.();
        onOpenChange(false);
      }
    } catch (error) {
      // Optionally show toast
    } finally {
      setIsAdding(false);
    }
  };

  // Price logic: prefer salePrice or discountPrice if available
  let displayPrice = product?.salePrice ?? product?.price;
  let hasDiscount = product?.salePrice && product.salePrice < (product?.price ?? 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">Đang tải thông tin sản phẩm...</div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">{error}</div>
          ) : product ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Product Image */}
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                <OptimizedImage
                  src={product.imageUrl || "/placeholder-product.jpg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              {/* Product Details */}
              <div className="flex flex-col gap-4">
                <DialogHeader>
                  <VisuallyHidden>
                    <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
                  </VisuallyHidden>
                  <DialogDescription className="text-base text-gray-600 mb-2">{product.description}</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  {hasDiscount && (
                    <span className="text-gray-400 line-through text-lg">
                      {product.price?.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                  <span className="text-2xl font-bold text-blue-600">
                    {displayPrice?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="text-sm text-gray-500">Còn lại: <span className="font-semibold text-gray-800">{product.StockQuantity}</span> sản phẩm</div>
                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="font-semibold mb-1">Kích thước:</div>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size.sizeLabel}
                          onClick={() => setSelectedSize(size.sizeLabel)}
                          disabled={size.stockQuantity === 0}
                          className={cn(
                            "px-3 py-1 border rounded text-sm font-medium transition-colors",
                            selectedSize === size.sizeLabel
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-600",
                            size.stockQuantity === 0 && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {size.sizeLabel} {size.stockQuantity === 0 ? "(Hết hàng)" : `(Còn ${size.stockQuantity})`}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowSizeChart(true)} className="mt-2 underline text-blue-600">Bảng size</button>
                    {showSizeChart && <SizeChartModal onClose={() => setShowSizeChart(false)} />}
                  </div>
                )}
                {/* Quantity */}
                <div>
                  <div className="font-semibold mb-1">Số lượng:</div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-9 w-9 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={increaseQuantity}
                      className="h-9 w-9 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.StockQuantity === 0}
                  className="mt-4 flex items-center justify-center gap-2 h-11 text-lg font-medium"
                >
                  {isAdding ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                </Button>
                {/* Details (optional) */}
                {product.details && (
                  <div className="mt-2 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: product.details }} />
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      <LoginPromptDialog
        isOpen={isLoginPromptOpen}
        onOpenChange={setIsLoginPromptOpen}
        message="Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng"
      />
    </>
  );
}
