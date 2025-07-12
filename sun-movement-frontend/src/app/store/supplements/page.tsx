"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductCard } from "@/components/ui/product-card";
import { AlertCircle } from "lucide-react";
import SupplementsTopControls from "@/components/ui/SupplementsTopControls";
import { SupplementsSidebar } from "@/components/ui/SupplementsSidebar";
import { ProductList } from "@/components/ui/ProductList";
import { Pagination } from "@/components/ui/Pagination";
import { trackPageView } from "@/services/analytics";

import { Product } from "@/lib/types";
import { ProductDto } from "@/lib/adapters";

// Client-side data fetching function with improved error handling
async function getSupplementsProducts(): Promise<{products: Product[], error?: string}> {
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
    
    const response = await fetch(`${backendUrl}/api/products/category/supplements`, fetchOptions);
    
    if (!response.ok) {
      // Enhanced error handling with status code
      const errorText = await response.text();
      throw new Error(`Failed to fetch supplements products (${response.status}): ${errorText || 'Unknown error'}`);
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
        imageUrl: item.imageUrl || "/images/supplements/default.jpg", // Fallback image
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
    console.error("Error fetching supplements products:", error);
    // Return fallback data in case of errors with error message
    return {
      products: fallbackSupplementsData,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

// Fallback data in case the API is unavailable
const fallbackSupplementsData: Product[] = [
  {
    id: "1",
    name: "Whey Protein Isolate",
    description: "Protein whey đạm tinh khiết hấp thu nhanh, hỗ trợ tăng cơ hiệu quả.",
    price: 850000,
    salePrice: 799000,
    imageUrl: "/images/supplements/protein.jpg",
    category: "protein",
    subCategory: "Sun Performance",
    rating: 4.9,
    reviews: 28,
    isNew: true,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Pre-Workout Energy",
    description: "Năng lượng tập luyện tăng cường sức mạnh và sức bền trong mỗi buổi tập.",
    price: 650000,
    salePrice: null,
    imageUrl: "/images/supplements/pre-workout.jpg",
    category: "pre-workout",
    subCategory: "Sun Performance",
    rating: 4.7,
    reviews: 15,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "3",
    name: "BCAA 2:1:1",
    description: "Hỗ trợ phục hồi cơ bắp và giảm đau nhức sau tập luyện cường độ cao.",
    price: 450000,
    salePrice: 399000,
    imageUrl: "/images/supplements/bcaa.jpg",
    category: "amino-acids",
    subCategory: "Sun Performance",
    rating: 4.5,
    reviews: 12,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "4",
    name: "Vitamin Complex",
    description: "Hỗn hợp vitamin và khoáng chất thiết yếu cho sức khỏe tổng thể và hỗ trợ miễn dịch.",
    price: 350000,
    salePrice: null,
    imageUrl: "/images/supplements/vitamins.jpg",
    category: "vitamins",
    subCategory: "Sun Wellness",
    rating: 4.8,
    reviews: 20,
    isNew: true,
    isBestseller: false,
  },
  {
    id: "5",
    name: "Creatine Monohydrate",
    description: "Tăng sức mạnh và hiệu suất tập luyện, hỗ trợ phát triển cơ bắp nhanh chóng.",
    price: 400000,
    salePrice: null,
    imageUrl: "/images/supplements/creatine.jpg",
    category: "performance",
    subCategory: "Sun Performance",
    rating: 4.9,
    reviews: 32,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "6",
    name: "Mass Gainer",
    description: "Bổ sung calo và protein chất lượng cao cho người khó tăng cân và phát triển cơ bắp.",
    price: 750000,
    salePrice: 699000,
    imageUrl: "/images/supplements/mass-gainer.jpg",
    category: "weight-gain",
    subCategory: "Sun Performance",
    rating: 4.6,
    reviews: 18,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "7",
    name: "Omega-3 Fish Oil",
    description: "Dầu cá omega-3 hỗ trợ sức khỏe tim mạch và giảm viêm sau tập luyện.",
    price: 320000,
    salePrice: null,
    imageUrl: "/images/supplements/omega3.jpg",
    category: "vitamins",
    subCategory: "Sun Wellness",
    rating: 4.7,
    reviews: 14,
    isNew: true,
    isBestseller: false,
  },
  {
    id: "8",
    name: "ZMA Complex",
    description: "Hỗ trợ giấc ngủ sâu và phục hồi cơ bắp với kẽm, magiê và vitamin B6.",
    price: 380000,
    salePrice: 349000,
    imageUrl: "/images/supplements/zma.jpg",
    category: "recovery",
    subCategory: "Sun Performance",
    rating: 4.5,
    reviews: 9,
    isNew: false,
    isBestseller: false,
  },
];

export default function SupplementsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch products on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const { products, error } = await getSupplementsProducts();
        setAllProducts(products);
        setFilteredProducts(products);
        setError(error || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setAllProducts(fallbackSupplementsData);
        setFilteredProducts(fallbackSupplementsData);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
    
    // Track page view
    trackPageView('/store/supplements');
  }, []);

  // Create stable callback functions to prevent infinite re-renders
  const handleFilteredProductsChange = useCallback((products: Product[]) => {
    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page when filters change
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
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/dichvu/Strength-Thumb.webp')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10">
          <div className="w-full py-4">
            <Breadcrumbs 
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Cửa hàng", href: "/store" },
                { label: "Thực phẩm bổ sung", href: "/store/supplements" },
              ]} 
              className="text-slate-400"
            />
          </div>
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              SUN SUPPLEMENTS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Thực phẩm bổ sung<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                chất lượng cao
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Tối ưu hóa hiệu suất tập luyện và phục hồi với các sản phẩm thực phẩm bổ sung 
              chất lượng cao được lựa chọn kỹ lưỡng.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <SupplementsSidebar
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
            <SupplementsTopControls
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
                {/* Products List */}
                <ProductList 
                  products={paginationData.paginatedProducts}
                  viewMode={viewMode}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                />
                
                {/* Pagination */}
                {paginationData.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={paginationData.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}

                {/* No results message */}
                {filteredProducts.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <div className="text-slate-400 text-lg mb-4">
                      Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn
                    </div>
                    <button 
                      onClick={() => {
                        handleCategoryChange([]);
                        handleRatingChange([]);
                        handlePriceRangeChange([0, 1500000]);
                        handlePageChange(1);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}