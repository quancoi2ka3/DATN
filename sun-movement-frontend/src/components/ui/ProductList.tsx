"use client";

import { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

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
  // Calculate paginated products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  if (viewMode === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300 flex"
          >
            {/* Image */}
            <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
              {product.salePrice && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                  Sale
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
                  Mới
                </div>
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating ?? 0) ? 'text-amber-500' : 'text-slate-600'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-slate-400 text-sm ml-1">({product.reviews})</span>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="text-red-500 text-sm font-medium mb-2">
                  {product.subCategory || product.category}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-xl font-bold text-white">
                        {new Intl.NumberFormat('vi-VN').format(product.salePrice)}₫
                      </span>
                      <span className="text-sm text-slate-500 line-through">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-white">
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
        ))}
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {paginatedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
