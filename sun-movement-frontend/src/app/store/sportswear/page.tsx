"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductCard } from "@/components/ui/product-card";
import { AlertCircle } from "lucide-react";
import SportswearTopControls from "@/components/ui/SportswearTopControls";
import { SportswearSidebar } from "@/components/ui/SportswearSidebar";
import { ProductList } from "@/components/ui/ProductList";
import { Pagination } from "@/components/ui/Pagination";

import { Product } from "@/lib/types";
import { ProductDto } from "@/lib/adapters";

// Client-side data fetching function with improved error handling
async function getSportswearProducts(): Promise<{products: Product[], error?: string}> {
  try {
    // For development, use HTTPS with custom agent to handle self-signed certificates
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    
    // Create a custom fetch with SSL verification disabled for development
    const fetchOptions: RequestInit = {
      cache: 'no-store', // Disable cache for client-side fetching
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
    
    const response = await fetch(`${backendUrl}/api/products/category/sportswear`, fetchOptions);
    
    if (!response.ok) {
      // Enhanced error handling with status code
      const errorText = await response.text();
      throw new Error(`Failed to fetch sportswear products (${response.status}): ${errorText || 'Unknown error'}`);
    }
    
    const data: ProductDto[] = await response.json();
    
    // Map backend model to frontend model
    return {
      products: data.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        salePrice: item.discountPrice ?? null,
        imageUrl: item.imageUrl || "/images/sportswear/default.jpg", // Fallback image
        category: item.category.toString(),
        StockQuantity: (item as any).stockQuantity ?? (item as any).StockQuantity ?? 0,
        subCategory: item.subCategory || "General",
        isBestseller: item.isFeatured ?? false,
        rating: 4.5, // Default rating since backend doesn't provide it
        reviews: Math.floor(Math.random() * 50) + 10, // Mock reviews
        isNew: Math.random() > 0.7, // Random new flag
      })),
      error: undefined
    };
  } catch (error) {
    console.error("Error fetching sportswear products:", error);
    // Return fallback data in case of errors with error message
    return {
      products: fallbackSportswearData,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

// Fallback data in case the API is unavailable
const fallbackSportswearData: Product[] = [
  {
    id: "1",
    name: "Áo Thun Thể Thao Nam",
    description: "Áo thun thể thao nam chất liệu cotton co giãn, thoáng mát và thấm hút mồ hôi tốt.",
    price: 450000,
    salePrice: 399000,
    imageUrl: "/images/sportswear/jersey-black.webp",
    category: "shirts",
    subCategory: "Sun Sport",
    StockQuantity: 100,
    rating: 4.8,
    reviews: 32,
    isNew: true,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Quần Jogger Thể Thao",
    description: "Quần jogger thể thao nam thiết kế hiện đại, phù hợp cho tập gym và chạy bộ.",
    price: 520000,
    salePrice: null,
    imageUrl: "/images/sportswear/casual-black.webp",
    category: "pants",
    subCategory: "Sun Sport",
    StockQuantity: 75,
    rating: 4.7,
    reviews: 28,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "3",
    name: "Giày Thể Thao Chạy Bộ",
    description: "Giày thể thao chuyên dụng cho chạy bộ với đế đàn hồi cao và thiết kế thoáng khí.",
    price: 1200000,
    salePrice: 999000,
    imageUrl: "/images/sportswear/casual-black.webp",
    category: "shoes",
    subCategory: "Sun Performance",
    StockQuantity: 50,
    rating: 4.9,
    reviews: 45,
    isNew: true,
    isBestseller: true,
  },
  {
    id: "4",
    name: "Áo Khoác Gió Thể Thao",
    description: "Áo khoác gió nhẹ, chống nước và thoáng khí, lý tưởng cho các hoạt động ngoài trời.",
    price: 780000,
    salePrice: 699000,
    imageUrl: "/images/sportswear/jersey-black.webp",
    category: "jackets",
    subCategory: "Sun Performance",
    StockQuantity: 30,
    rating: 4.6,
    reviews: 21,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "5",
    name: "Quần Short Thể Thao",
    description: "Quần short tập gym co giãn 4 chiều, thoải mái cho mọi động tác.",
    price: 320000,
    salePrice: null,
    imageUrl: "/images/sportswear/shorts.jpg",
    category: "shorts",
    subCategory: "Sun Sport",
    StockQuantity: 80,
    rating: 4.5,
    reviews: 23,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "6",
    name: "Áo Hoodie Thể Thao",
    description: "Áo hoodie thể thao ấm áp, phù hợp cho các buổi tập ngoài trời mùa đông.",
    price: 680000,
    salePrice: 599000,
    imageUrl: "/images/sportswear/casual-black.webp",
    category: "hoodies",
    subCategory: "Sun Sport",
    StockQuantity: 60,
    rating: 4.6,
    reviews: 19,
    isNew: false,
    isBestseller: false,
  },
];

export default function SportswearPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New states for view mode and pagination
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Fetch products on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const { products, error } = await getSportswearProducts();
        setAllProducts(products);
        setFilteredProducts(products);
        setError(error || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setAllProducts(fallbackSportswearData);
        setFilteredProducts(fallbackSportswearData);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, selectedRatings]);

  // Create stable callback functions to prevent infinite re-renders
  const handleFilteredProductsChange = useCallback((products: Product[]) => {
    setFilteredProducts(products);
  }, []);

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    setPriceRange(range);
  }, []);

  const handleRatingChange = useCallback((ratings: number[]) => {
    setSelectedRatings(ratings);
  }, []);

  const handleViewModeChange = useCallback((mode: "grid" | "list") => {
    setViewMode(mode);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Calculate pagination with useMemo to prevent unnecessary recalculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      totalPages,
      paginatedProducts,
      showingCount: Math.min(filteredProducts.length, itemsPerPage),
      totalCount: filteredProducts.length
    };
  }, [filteredProducts, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Error display if API call failed */}
      {error && (
        <div className="container py-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-500 mb-6">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Lỗi tải sản phẩm</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </div>
      )}
    
      {/* Hero Section */}
      <div className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/15 via-orange-500/10 to-blue-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/dichvu/Strength-Thumb.webp')] bg-repeat opacity-5 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-slate-950/50 z-0"></div>
        
        <div className="container relative z-10">
          <div className="w-full py-6">
            <Breadcrumbs 
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Cửa hàng", href: "/store" },
                { label: "Trang phục thể thao", href: "/store/sportswear" },
              ]} 
              className="text-slate-400 hover:text-white transition-colors duration-300"
            />
          </div>
          
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold tracking-wide">SUN SPORTSWEAR COLLECTION</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
              Trang phục thể thao<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-red-500 drop-shadow-2xl">
                Premium & Hiện đại
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Khám phá bộ sưu tập trang phục thể thao chất lượng cao với thiết kế hiện đại, 
              <br className="hidden md:block" />
              mang lại sự thoải mái tối đa cho mọi hoạt động thể thao của bạn.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Chất liệu cao cấp</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Thiết kế thoáng khí</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Đa dạng kiểu dáng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <SportswearSidebar
              products={allProducts}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedRatings={selectedRatings}
              onRatingChange={handleRatingChange}
            />
          </div>
          
          {/* Product Listing */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            {/* Top Controls */}
            <SportswearTopControls
              products={allProducts}
              onFilteredProductsChange={handleFilteredProductsChange}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedRatings={selectedRatings}
              onRatingChange={handleRatingChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-3 text-slate-400">Đang tải sản phẩm...</span>
              </div>
            ) : (
              <>
                {/* Featured Products */}
                {filteredProducts.filter(p => p.isBestseller).length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                      <div className="relative">
                        <h3 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
                          Sản phẩm nổi bật
                        </h3>
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-80"></div>
                      </div>
                      <a href="#" className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent hover:from-red-400 hover:to-orange-400 flex items-center gap-2 text-sm font-bold transition-all duration-300 hover:scale-105">
                        Xem tất cả 
                        <svg className="w-5 h-5 rotate-180 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.filter(p => p.isBestseller).slice(0, 3).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Products */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="relative">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent drop-shadow-2xl">
                        {selectedCategories.length > 0 || filteredProducts.length !== allProducts.length 
                          ? "Kết quả tìm kiếm" 
                          : "Tất cả sản phẩm thể thao"
                        }
                      </h3>
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-white to-slate-400 rounded-full opacity-60"></div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-2">
                      <div className="text-sm font-semibold text-white">
                        Hiển thị <span className="text-red-400">{paginationData.showingCount}</span> trong tổng 
                        <span className="text-orange-400 ml-1">{paginationData.totalCount}</span> sản phẩm
                      </div>
                    </div>
                  </div>
                  
                  {filteredProducts.length > 0 ? (
                    <>
                      <ProductList 
                        products={filteredProducts}
                        viewMode={viewMode}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                      />
                      
                      {/* Pagination */}
                      <div className="mt-12">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={paginationData.totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h4 className="text-2xl font-bold bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent mb-2">
                          Không tìm thấy sản phẩm
                        </h4>
                        <p className="text-slate-400 text-lg mb-6 max-w-md mx-auto">
                          Không có sản phẩm nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh các tiêu chí tìm kiếm.
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          handleCategoryChange([]);
                          handleRatingChange([]);
                          handlePriceRangeChange([0, 1500000]);
                          handlePageChange(1);
                        }}
                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                      >
                        Xóa tất cả bộ lọc
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
