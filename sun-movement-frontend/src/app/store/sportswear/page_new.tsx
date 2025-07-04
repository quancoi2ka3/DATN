"use client";

import { useState, useEffect } from "react";
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
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10">
          <div className="w-full py-4">
            <Breadcrumbs 
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Cửa hàng", href: "/store" },
                { label: "Trang phục thể thao", href: "/store/sportswear" },
              ]} 
              className="text-slate-400"
            />
          </div>
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              SUN SPORTSWEAR
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Trang phục thể thao<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                chất lượng cao
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Khám phá bộ sưu tập trang phục thể thao hiện đại, thoải mái và phong cách 
              cho mọi hoạt động thể thao của bạn.
            </p>
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
              onCategoryChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedRatings={selectedRatings}
              onRatingChange={setSelectedRatings}
            />
          </div>
          
          {/* Product Listing */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            {/* Top Controls */}
            <SportswearTopControls
              products={allProducts}
              onFilteredProductsChange={setFilteredProducts}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedRatings={selectedRatings}
              onRatingChange={setSelectedRatings}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
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
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">Sản phẩm nổi bật</h3>
                      <a href="#" className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm font-medium">
                        Xem tất cả 
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {selectedCategories.length > 0 || filteredProducts.length !== allProducts.length 
                        ? "Kết quả tìm kiếm" 
                        : "Tất cả sản phẩm"
                      }
                    </h3>
                    <div className="text-sm text-slate-400">
                      Hiển thị {Math.min(filteredProducts.length, itemsPerPage)} trong tổng {filteredProducts.length} sản phẩm
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
                          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-slate-400 text-lg mb-4">
                        Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedCategories([]);
                          setSelectedRatings([]);
                          setPriceRange([0, 1500000]);
                          setCurrentPage(1);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Xóa bộ lọc
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
