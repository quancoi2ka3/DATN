"use client";

import React from "react";
import { SearchBar } from "./search-bar";
import { LayoutGrid, LayoutList } from "lucide-react";
import { useProductFilter } from "@/contexts/ProductFilterContext";

const defaultSortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
  { value: "name-desc", label: "Tên: Z-A" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

interface ProductTopControlsProps {
  searchPlaceholder?: string;
  sortOptions?: Array<{ value: string; label: string }>;
  showViewToggle?: boolean;
  className?: string;
}

export function ProductTopControls({ 
  searchPlaceholder = "Tìm kiếm sản phẩm...",
  sortOptions = defaultSortOptions,
  showViewToggle = true,
  className = ""
}: ProductTopControlsProps) {
  const {
    filterState,
    setSearchQuery,
    setSortBy,
    setViewMode,
    filteredProducts
  } = useProductFilter();

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto flex-1 md:flex-initial">
          <SearchBar
            placeholder={searchPlaceholder}
            value={filterState.searchQuery}
            onChange={setSearchQuery}
            className="w-full md:min-w-[300px]"
          />
        </div>
        
        <div className="flex items-center gap-4">
          {/* Results count */}
          <div className="text-sm text-slate-400 hidden sm:block">
            {filteredProducts.length} sản phẩm
          </div>
          
          {/* View mode toggle */}
          {showViewToggle && (
            <div className="hidden md:flex items-center gap-2 border-r border-slate-700 pr-4">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  filterState.viewMode === "grid" 
                    ? "bg-red-500 text-white" 
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
                title="Xem dạng lưới"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  filterState.viewMode === "list" 
                    ? "bg-red-500 text-white" 
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
                title="Xem dạng danh sách"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Sort dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="hidden sm:inline">Sắp xếp:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg text-white py-2 pl-3 pr-10 cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
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
    </div>
  );
}
