import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Image from "next/image";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, ChevronDown, AlertCircle } from "lucide-react";
import SupplementsTopControls from "@/components/ui/SupplementsTopControls";

export const metadata: Metadata = {
  title: "Thực phẩm bổ sung | Sun Movement",
  description: "Các sản phẩm thực phẩm bổ sung chất lượng cao tại Sun Movement",
};

import { Product } from "@/lib/types";
import { ProductDto } from "@/lib/adapters";

// Server-side data fetching function with improved error handling
async function getSupplementsProducts(): Promise<{products: Product[], error?: string}> {
  try {
    // For development, use HTTPS with custom agent to handle self-signed certificates
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    // Create a custom fetch with SSL verification disabled for development
    const fetchOptions: RequestInit = {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    // Disable SSL verification for development
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - This is a Node.js specific property
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    
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
    imageUrl: "/images/supplements/protein.jpg", // placeholder image
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
    imageUrl: "/images/supplements/pre-workout.jpg", // placeholder image
    category: "recovery",
    subCategory: "Sun Performance",
    rating: 4.5,
    reviews: 9,
    isNew: false,
    isBestseller: false,
  },
];

// Function to calculate category counts from products
function getCategoryOptions(products: Product[]) {
  return [
    { value: "all", label: "Tất cả", count: products.length },
    { value: "protein", label: "Protein", count: products.filter(p => p.category === "protein").length },
    { value: "pre-workout", label: "Pre-Workout", count: products.filter(p => p.category === "pre-workout").length },
    { value: "amino-acids", label: "Amino Acids", count: products.filter(p => p.category === "amino-acids").length },
    { value: "vitamins", label: "Vitamin & Minerals", count: products.filter(p => p.category === "vitamins").length },
    { value: "performance", label: "Hiệu suất", count: products.filter(p => p.category === "performance").length },
    { value: "weight-gain", label: "Tăng cân", count: products.filter(p => p.category === "weight-gain").length },
    { value: "recovery", label: "Phục hồi", count: products.filter(p => p.category === "recovery").length },
  ];
}

// Function to extract unique brands from products
function getBrandOptions(products: Product[]) {
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  return [
    { value: "all", label: "Tất cả" },
    ...uniqueBrands.map(brand => ({ value: brand as string, label: brand as string })),
  ];
}

// Sort options
const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
  { value: "name-desc", label: "Tên: Z-A" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

export default async function SupplementsPage() {
  // Fetch supplements from the API
  const { products, error } = await getSupplementsProducts();
  
  // Generate category and brand options based on available products
  const categories = getCategoryOptions(products);
  const brands = getBrandOptions(products);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Error display if API call failed */}
      {error && (
        <div className="container py-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-500 mb-6">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Error loading products</p>
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
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Bộ lọc</h3>
                <SlidersHorizontal className="w-5 h-5 text-slate-400" />
              </div>
              
              {/* Categories */}
              <div className="mb-8">
                <h4 className="text-white font-medium mb-3">Danh mục</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center justify-between">
                      <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 mr-2 accent-red-500" 
                          defaultChecked={category.value === "all"}
                        />
                        {category.label}
                      </label>
                      <span className="text-sm text-slate-500">({category.count})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-white font-medium mb-3">Khoảng giá</h4>
                <div className="px-2">
                  <div className="h-1 bg-slate-700 rounded-full mb-2 relative">
                    <div className="absolute h-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full w-2/3"></div>
                    <div className="absolute w-4 h-4 bg-white rounded-full border-2 border-red-500 -top-1.5 left-0"></div>
                    <div className="absolute w-4 h-4 bg-white rounded-full border-2 border-amber-500 -top-1.5 left-2/3"></div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>300.000₫</span>
                    <span>900.000₫</span>
                  </div>
                </div>
              </div>
              
              {/* Brands */}
              <div className="mb-8">
                <h4 className="text-white font-medium mb-3">Thương hiệu</h4>
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
              </div>
              
              {/* Rating */}
              <div className="mb-8">
                <h4 className="text-white font-medium mb-3">Đánh giá</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 mr-2 accent-red-500" 
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
                          {rating === 1 && <span className="ml-1 text-slate-400">trở lên</span>}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Apply Filters Button */}
              <Button className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white">
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
          
          {/* Product Listing */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            {/* Top Controls */}
{/* Top Controls */}
<SupplementsTopControls />
              {/* Featured Products */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Sản phẩm nổi bật</h3>
                <a href="#" className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm font-medium">
                  Xem tất cả <ChevronDown className="w-4 h-4 rotate-270" />
                </a>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.isBestseller).slice(0, 3).map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300"
                  >
                    <div className="relative h-60 overflow-hidden">
                      {product.salePrice && (
                        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
                          Sale
                        </div>
                      )}
                      {product.isNew && (
                        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-sm font-medium px-2 py-1 rounded">
                          Mới
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="flex items-center gap-1 mb-1">
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
                        <div className="text-red-500 text-sm font-medium">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {product.salePrice ? (
                            <>
                              <span className="text-lg font-bold text-white">{new Intl.NumberFormat('vi-VN').format(product.salePrice)}₫</span>
                              <span className="text-sm text-slate-500 line-through">{new Intl.NumberFormat('vi-VN').format(product.price)}₫</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-white">{new Intl.NumberFormat('vi-VN').format(product.price)}₫</span>
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
            </div>
              {/* All Products */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Tất cả sản phẩm</h3>
                <div className="text-sm text-slate-400">
                  Hiển thị {products.length} sản phẩm
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300"
                  >
                    <div className="relative h-60 overflow-hidden">
                      {product.salePrice && (
                        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
                          Sale
                        </div>
                      )}
                      {product.isNew && (
                        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-sm font-medium px-2 py-1 rounded">
                          Mới
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="flex items-center gap-1 mb-1">
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
                        <div className="text-red-500 text-sm font-medium">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {product.salePrice ? (
                            <>
                              <span className="text-lg font-bold text-white">{new Intl.NumberFormat('vi-VN').format(product.salePrice)}₫</span>
                              <span className="text-sm text-slate-500 line-through">{new Intl.NumberFormat('vi-VN').format(product.price)}₫</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-white">{new Intl.NumberFormat('vi-VN').format(product.price)}₫</span>
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
              
              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-slate-800" disabled>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-red-500">
                    2
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-red-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}