"use client";

import { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { useState } from "react";
import { useEnhancedCart } from "@/lib/enhanced-cart-context";
import { useAuth } from "@/lib/auth-context";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { CheckCircle } from "lucide-react";

interface ProductListProps {
  products: Product[];
  viewMode: "grid" | "list";
  currentPage: number;
  itemsPerPage: number;
  className?: string;
}

export function ProductList({ 
  products, 
  viewMode, 
  currentPage, 
  itemsPerPage,
  className = "" 
}: ProductListProps) {
  // State for cart functionality
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [successProductId, setSuccessProductId] = useState<string | null>(null);
  const { addToCart } = useEnhancedCart();
  const { isAuthenticated } = useAuth();
  
  // Calculate paginated products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Handle add to cart for list view
  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    
    setAddingProductId(product.id);
    
    try {
      const success = await addToCart(product, 1); // Default quantity 1 for quick add
      if (success) {
        // Show success feedback
        setSuccessProductId(product.id);
        setTimeout(() => setSuccessProductId(null), 2000); // Hide success after 2 seconds
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingProductId(null);
    }
  };

  if (viewMode === "list") {
    return (
      <>
        <div className={`space-y-4 ${className}`}>
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300 flex"
            >
              {/* ...existing code... */}
              {/* Image */}
              <div className="relative w-52 h-36 flex-shrink-0 overflow-hidden">
                {product.salePrice && (
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Mới
                  </div>
                )}
                {product.isBestseller && (
                  <div className="absolute bottom-3 left-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Bán chạy
                  </div>
                )}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-sm border-l border-slate-700/30">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 mr-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400 transition-all duration-300 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent text-sm font-bold uppercase tracking-wide">
                        {product.subCategory || product.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating ?? 0) ? 'text-yellow-400' : 'text-slate-600'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-slate-400 text-sm ml-1 font-medium">({product.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {product.description}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {product.salePrice ? (
                      <>
                        <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                          {new Intl.NumberFormat('vi-VN').format(product.salePrice)}₫
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                          {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-white drop-shadow-sm">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={addingProductId === product.id}
                    className={`p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                      successProductId === product.id 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-red-500 hover:to-red-600'
                    } text-white`}
                    title="Thêm vào giỏ hàng"
                  >
                    {addingProductId === product.id ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : successProductId === product.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-105 transition-transform duration-300">
                        <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Login Prompt Dialog for List View */}
        <LoginPromptDialog 
          isOpen={isLoginPromptOpen} 
          onOpenChange={setIsLoginPromptOpen} 
        />
      </>
    );
  }

  // Grid view (default)
  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Login Prompt Dialog */}
      <LoginPromptDialog 
        isOpen={isLoginPromptOpen} 
        onOpenChange={setIsLoginPromptOpen} 
      />
    </>
  );
}

export default ProductList;
