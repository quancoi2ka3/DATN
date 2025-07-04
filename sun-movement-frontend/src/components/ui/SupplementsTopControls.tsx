"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "./search-bar";
import { LayoutGrid, LayoutList, Filter } from "lucide-react";
import { Product } from "@/lib/types";

const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
  { value: "name-desc", label: "Tên: Z-A" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

interface SupplementsTopControlsProps {
  products: Product[];
  onFilteredProductsChange: (products: Product[]) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedRatings: number[];
  onRatingChange: (ratings: number[]) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export default function SupplementsTopControls({
  products,
  onFilteredProductsChange,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedRatings,
  onRatingChange,
  viewMode,
  onViewModeChange,
  currentPage,
  onPageChange,
  itemsPerPage,
}: SupplementsTopControlsProps) {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("default");
  const [showResults, setShowResults] = useState(0);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        String(product.category).toLowerCase().includes(searchTerm) ||
        (product.subCategory && product.subCategory.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter (using subCategory)
    if (selectedCategories.length > 0 && !selectedCategories.includes("all")) {
      filtered = filtered.filter(product => {
        const productSubCategory = String(product.subCategory || product.category || "other");
        return selectedCategories.includes(productSubCategory);
      });
    }

    // Apply price range filter
    filtered = filtered.filter(product => {
      const effectivePrice = product.salePrice || product.price;
      return effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
    });

    // Apply rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product => {
        const rating = product.rating || 0;
        return selectedRatings.some(minRating => rating >= minRating);
      });
    }

    // Apply sorting
    switch (sortValue) {
      case "price-asc":
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      default:
        // Keep bestsellers first, then by rating
        filtered.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }

    setShowResults(filtered.length);
    onFilteredProductsChange(filtered);
  }, [products, searchValue, selectedCategories, priceRange, selectedRatings, sortValue, onFilteredProductsChange]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <SearchBar
            placeholder="Tìm kiếm thực phẩm bổ sung..."
            value={searchValue}
            onChange={setSearchValue}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Results count */}
          <div className="text-sm text-slate-400">
            {showResults} sản phẩm
          </div>
          
          {/* View mode toggle */}
          <div className="hidden md:flex items-center gap-2 border-r border-slate-700 pr-4">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-red-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
              title="Xem dạng lưới"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-red-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
              title="Xem dạng danh sách"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
          
          {/* Sort dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="hidden sm:inline">Sắp xếp:</span>
              <select
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg text-white py-2 pl-3 pr-10 cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active filters display */}
      {(searchValue || selectedCategories.length > 0 || selectedRatings.length > 0) && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-400">Bộ lọc đang áp dụng:</span>
            
            {searchValue && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                Tìm kiếm: "{searchValue}"
                <button
                  onClick={() => setSearchValue("")}
                  className="ml-1 hover:text-red-300"
                >
                  ×
                </button>
              </span>
            )}
            
            {selectedCategories.filter(cat => cat !== "all").map(category => (
              <span key={category} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {category}
                <button
                  onClick={() => onCategoryChange(selectedCategories.filter(c => c !== category))}
                  className="ml-1 hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            ))}
            
            {selectedRatings.map(rating => (
              <span key={rating} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {rating}+ sao
                <button
                  onClick={() => onRatingChange(selectedRatings.filter(r => r !== rating))}
                  className="ml-1 hover:text-amber-300"
                >
                  ×
                </button>
              </span>
            ))}
            
            <button
              onClick={() => {
                setSearchValue("");
                onCategoryChange([]);
                onRatingChange([]);
                onPriceRangeChange([0, 1500000]);
              }}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
