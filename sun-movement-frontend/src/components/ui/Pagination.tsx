"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "" 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors"
        title="Trang trước"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-red-500 text-white'
              : page === '...'
              ? 'bg-transparent text-slate-400 cursor-default'
              : 'bg-slate-800 text-white hover:bg-red-500'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors"
        title="Trang sau"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Pagination;
