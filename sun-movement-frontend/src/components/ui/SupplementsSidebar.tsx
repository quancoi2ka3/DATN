"use client";

import React, { useState, useCallback } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

interface CategoryOption {
  value: string;
  label: string;
  count: number;
}

interface SupplementsSidebarProps {
  products: Product[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedRatings: number[];
  onRatingChange: (ratings: number[]) => void;
  className?: string;
}

export function SupplementsSidebar({ 
  products,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedRatings,
  onRatingChange,
  className = ""
}: SupplementsSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true,
  });

  // Generate category options from products (using subCategory)
  const generateCategoryOptions = (): CategoryOption[] => {
    const categoryCount: { [key: string]: number } = {};
    
    products.forEach(product => {
      // Use subCategory instead of category for more specific filtering
      const subCategory = product.subCategory || product.category || "other";
      categoryCount[subCategory] = (categoryCount[subCategory] || 0) + 1;
    });

    // Generate dynamic categories from actual product data
    const dynamicCategories = Object.keys(categoryCount).map(key => ({
      value: key,
      label: key,
      count: categoryCount[key]
    }));

    return [
      { value: "all", label: "Tất cả", count: products.length },
      ...dynamicCategories.filter(cat => cat.count > 0)
    ];
  };

  // Generate brand options from products
  const generateBrandOptions = () => {
    const uniqueBrands = Array.from(new Set(
      products.map(p => p.brand).filter(Boolean)
    ));
    return [
      { value: "all", label: "Tất cả" },
      ...uniqueBrands.map(brand => ({ value: brand as string, label: brand as string })),
    ];
  };

  const categories = generateCategoryOptions();
  const brands = generateBrandOptions();

  // Stable callbacks to prevent re-renders
  const handleCategoryToggle = useCallback((categoryValue: string) => {
    if (categoryValue === "all") {
      onCategoryChange([]);
    } else {
      const newCategories = selectedCategories.includes(categoryValue)
        ? selectedCategories.filter(cat => cat !== categoryValue)
        : [...selectedCategories.filter(cat => cat !== "all"), categoryValue];
      onCategoryChange(newCategories);
    }
  }, [selectedCategories, onCategoryChange]);

  const handleRatingToggle = useCallback((rating: number) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    onRatingChange(newRatings);
  }, [selectedRatings, onRatingChange]);

  const handlePriceChange = useCallback((min: number, max: number) => {
    onPriceRangeChange([min, max]);
  }, [onPriceRangeChange]);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    onCategoryChange([]);
    onRatingChange([]);
    onPriceRangeChange([0, 1500000]);
  }, [onCategoryChange, onRatingChange, onPriceRangeChange]);

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Bộ lọc</h3>
        <SlidersHorizontal className="w-5 h-5 text-slate-400" />
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-red-500"
        >
          <span>Danh mục</span>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.categories && (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center justify-between">
                <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mr-2 accent-red-500" 
                    checked={category.value === "all" ? selectedCategories.length === 0 : selectedCategories.includes(category.value)}
                    onChange={() => handleCategoryToggle(category.value)}
                  />
                  {category.label}
                </label>
                <span className="text-sm text-slate-500">({category.count})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-red-500"
        >
          <span>Khoảng giá</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="px-2">
              <div className="h-1 bg-slate-700 rounded-full mb-2 relative">
                <div 
                  className="absolute h-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                  style={{ 
                    left: `${(priceRange[0] / 1500000) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / 1500000) * 100}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-slate-400 mb-3">
                <span>{new Intl.NumberFormat('vi-VN').format(priceRange[0])}₫</span>
                <span>{new Intl.NumberFormat('vi-VN').format(priceRange[1])}₫</span>
              </div>
            </div>
            
            {/* Quick price filters */}
            <div className="space-y-2">
              <button
                onClick={() => handlePriceChange(0, 400000)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  priceRange[0] === 0 && priceRange[1] === 400000 
                    ? 'bg-red-500 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Dưới 400.000₫
              </button>
              <button
                onClick={() => handlePriceChange(400000, 700000)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  priceRange[0] === 400000 && priceRange[1] === 700000 
                    ? 'bg-red-500 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                400.000₫ - 700.000₫
              </button>
              <button
                onClick={() => handlePriceChange(700000, 1000000)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  priceRange[0] === 700000 && priceRange[1] === 1000000 
                    ? 'bg-red-500 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                700.000₫ - 1.000.000₫
              </button>
              <button
                onClick={() => handlePriceChange(1000000, 1500000)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  priceRange[0] === 1000000 && priceRange[1] === 1500000 
                    ? 'bg-red-500 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Trên 1.000.000₫
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Brands */}
      {brands.length > 1 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-red-500"
          >
            <span>Thương hiệu</span>
            {expandedSections.brands ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {expandedSections.brands && (
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.value} className="flex items-center">
                  <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mr-2 accent-red-500" 
                      defaultChecked={brand.value === "all"}
                    />
                    {brand.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Rating */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-red-500"
        >
          <span>Đánh giá</span>
          {expandedSections.rating ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.rating && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mr-2 accent-red-500"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingToggle(rating)}
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
                    <span className="ml-1 text-slate-400 text-sm">
                      {rating === 1 ? 'trở lên' : `+ sao`}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={handleClearFilters}
          variant="outline" 
          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Xóa bộ lọc
        </Button>
        <Button className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white">
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  );
}
