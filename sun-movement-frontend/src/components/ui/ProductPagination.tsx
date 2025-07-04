"use client";

import React from "react";
import { useProductFilter } from "@/contexts/ProductFilterContext";

interface ProductPaginationProps {
  className?: string;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
}

export function ProductPagination({ 
  className = "",
  showPageSize = true,
  pageSizeOptions = [6, 12, 24, 48]
}: ProductPaginationProps) {
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    filteredProducts,
    setCurrentPage,
    setItemsPerPage,
    getCurrentPageProducts
  } = useProductFilter();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    if (currentPage > delta + 2) {
      pages.push('...');
    }
    
    // Show pages around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - delta - 1) {
      pages.push('...');
    }
    
    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const currentProducts = getCurrentPageProducts();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      {/* Page size selector */}
      {showPageSize && (
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-sm">Hiển thị:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-lg text-white py-1 px-2 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} sản phẩm
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Results info */}
      <div className="text-sm text-slate-400">
        Hiển thị {startItem}-{endItem} trong tổng số {filteredProducts.length} sản phẩm
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors"
          title="Trang trước"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 text-slate-500">...</span>
            ) : (
              <button
                onClick={() => handlePageChange(page as number)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-red-500 text-white"
                    : "bg-slate-800 text-white hover:bg-red-500"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors"
          title="Trang sau"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
