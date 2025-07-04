"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductFilter } from "@/contexts/ProductFilterContext";

interface ProductSidebarProps {
  categoryOptions?: Array<{ value: string; label: string; count?: number }>;
  showPriceRange?: boolean;
  showRatingFilter?: boolean;
  className?: string;
}

export function ProductSidebar({ 
  categoryOptions = [], 
  showPriceRange = true, 
  showRatingFilter = true,
  className = ""
}: ProductSidebarProps) {
  const {
    filterState,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    toggleRating,
    clearFilters,
    getUniqueCategories,
    getUniqueBrands,
    getPriceRangeMinMax,
    allProducts
  } = useProductFilter();

  // Generate category options if not provided
  const categories = categoryOptions.length > 0 
    ? categoryOptions 
    : [
        { value: "all", label: "Tất cả", count: allProducts.length },
        ...getUniqueCategories().map(cat => ({
          value: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          count: allProducts.filter(p => String(p.category) === cat).length
        }))
      ];

  // Generate brand options
  const brands = [
    { value: "all", label: "Tất cả" },
    ...getUniqueBrands().map(brand => ({ value: brand, label: brand }))
  ];

  const [minPrice, maxPrice] = getPriceRangeMinMax();

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange: [number, number] = [...filterState.priceRange];
    if (type === 'min') {
      newRange[0] = Math.max(minPrice, Math.min(value, newRange[1]));
    } else {
      newRange[1] = Math.min(maxPrice, Math.max(value, newRange[0]));
    }
    setPriceRange(newRange);
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Bộ lọc</h3>
        <SlidersHorizontal className="w-5 h-5 text-slate-400" />
      </div>
      
      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h4 className="text-white font-medium mb-3">Danh mục</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center justify-between">
                <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mr-2 accent-red-500" 
                    checked={
                      category.value === "all" 
                        ? filterState.selectedCategories.length === 0
                        : filterState.selectedCategories.includes(category.value)
                    }
                    onChange={() => toggleCategory(category.value)}
                  />
                  {category.label}
                </label>
                {category.count !== undefined && (
                  <span className="text-sm text-slate-500">({category.count})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Price Range */}
      {showPriceRange && (
        <div className="mb-8">
          <h4 className="text-white font-medium mb-3">Khoảng giá</h4>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filterState.priceRange[0] || ''}
                  onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Đến"
                  value={filterState.priceRange[1] || ''}
                  onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>{new Intl.NumberFormat('vi-VN').format(minPrice)}₫</span>
              <span>{new Intl.NumberFormat('vi-VN').format(maxPrice)}₫</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Brands */}
      {brands.length > 1 && (
        <div className="mb-8">
          <h4 className="text-white font-medium mb-3">Thương hiệu</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand.value} className="flex items-center">
                <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mr-2 accent-red-500" 
                    checked={
                      brand.value === "all" 
                        ? filterState.selectedBrands.length === 0
                        : filterState.selectedBrands.includes(brand.value)
                    }
                    onChange={() => toggleBrand(brand.value)}
                  />
                  {brand.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Rating */}
      {showRatingFilter && (
        <div className="mb-8">
          <h4 className="text-white font-medium mb-3">Đánh giá</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mr-2 accent-red-500" 
                    checked={filterState.selectedRatings.includes(rating)}
                    onChange={() => toggleRating(rating)}
                  />
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < rating ? 'text-amber-500' : 'text-slate-600'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-slate-400">trở lên</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Apply/Clear Filters Button */}
      <div className="space-y-2">
        <Button 
          onClick={clearFilters}
          variant="outline"
          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
}
