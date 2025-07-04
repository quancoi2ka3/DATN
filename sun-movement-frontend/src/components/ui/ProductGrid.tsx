"use client";

import React from "react";
import { Product } from "@/lib/types";
import { useProductFilter } from "@/contexts/ProductFilterContext";

interface ProductGridProps {
  className?: string;
  showFeaturedSection?: boolean;
  featuredTitle?: string;
}

export function ProductGrid({ 
  className = "",
  showFeaturedSection = true,
  featuredTitle = "Sản phẩm nổi bật"
}: ProductGridProps) {
  const {
    allProducts,
    getCurrentPageProducts,
    filterState,
    isLoading
  } = useProductFilter();

  const currentProducts = getCurrentPageProducts();
  const featuredProducts = allProducts.filter(p => p.isBestseller || p.isFeatured).slice(0, 3);

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300">
      <div className="relative h-60 overflow-hidden">
        {product.salePrice && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
            Sale
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-sm font-medium px-2 py-1 rounded">
            Mới
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/placeholder-product.jpg";
          }}
        />
        <div className="absolute bottom-4 left-4 right-4 z-20">
          {product.rating && (
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'text-amber-500' : 'text-slate-600'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {product.reviews && (
                <span className="text-slate-400 text-sm ml-1">({product.reviews})</span>
              )}
            </div>
          )}
          {product.brand && (
            <div className="text-red-500 text-sm font-medium">
              {product.brand}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-white">
                  {new Intl.NumberFormat('vi-VN').format(product.salePrice)}₫
                </span>
                <span className="text-sm text-slate-500 line-through">
                  {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-white">
                {new Intl.NumberFormat('vi-VN').format(product.price)}₫
              </span>
            )}
          </div>
          <button className="p-2 rounded-full bg-slate-800 hover:bg-red-500 text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const gridClass = filterState.viewMode === 'list' 
    ? "grid grid-cols-1 gap-6" 
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-2 text-slate-400">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Featured Products Section */}
      {showFeaturedSection && featuredProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">{featuredTitle}</h3>
            <button className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm font-medium">
              Xem tất cả
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={`featured-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* All Products Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">
            {filterState.searchQuery ? `Kết quả tìm kiếm: "${filterState.searchQuery}"` : "Tất cả sản phẩm"}
          </h3>
        </div>
        
        {currentProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146.832-5.686 2.186m11.372 0C19.146 15.832 17.137 15 15 15c-2.137 0-4.146.832-5.686 2.186M6 9a2 2 0 11-4 0 2 2 0 014 0zM20 9a2 2 0 11-4 0 2 2 0 014 0zM6 20a2 2 0 11-4 0 2 2 0 014 0zM20 20a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h4>
            <p className="text-slate-400 mb-4">
              Không có sản phẩm nào phù hợp với bộ lọc của bạn.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className={gridClass}>
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
