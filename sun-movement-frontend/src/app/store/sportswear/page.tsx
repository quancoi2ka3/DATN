import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SportswearSection } from "@/components/sections/sportswear";
import { OptimizedProductCard } from "@/components/ui/optimized-product-card";
import { Product } from "@/lib/types";
import { ProductDto } from "@/lib/adapters";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

// For development only - handle self-signed certificates
// This should be removed in production


export const metadata: Metadata = {
  title: "Quần áo thể thao | Sun Movement",
  description: "Trang phục và phụ kiện thể thao chất lượng cao, thiết kế riêng cho cộng đồng Sun Movement",
};

// Sample fallback data in case API fails
const fallbackSportswearProducts: Product[] = [
  {
    id: "fallback-1",
    name: "Training T-Shirt",
    description: "Áo phông chất liệu thoáng khí cho các buổi tập",
    price: 350000,
    salePrice: null,
    imageUrl: "/images/sportswear/sportswear-1.jpg",
    category: "tops",
    subCategory : "t-shirts",
    isNew: true,
    isBestseller: true,
  },
  {
    id: "fallback-2",
    name: "Performance Shorts",
    description: "Quần short thể thao co giãn 4 chiều",
    price: 420000,
    salePrice: null,
    imageUrl: "/images/sportswear/sportswear-2.jpg",
    category: "bottoms",
    subCategory : "t-shirts",
    isNew: false,
    isBestseller: true,
  }
];

// Server-side data fetching function with error handling
async function getSportswearProducts(): Promise<{products: Product[], error?: string}> {
  try {
    // For development, use HTTPS with SSL verification disabled
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    // Disable SSL verification for development
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - This is a Node.js specific property
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    
    const response = await fetch(`${backendUrl}/api/products/category/sportswear`, { 
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable cache to ensure fresh data
    });
    
    if (!response.ok) {
      // Enhanced error handling with status code
      const errorText = await response.text();
      throw new Error(`Failed to fetch sportswear products (${response.status}): ${errorText || 'Unknown error'}`);
    }
    
    const data: ProductDto[] = await response.json();
    console.log("Successfully fetched data:", data.length, "products");
    
    // Map backend model to frontend model
    return {
      products: data.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        salePrice: item.discountPrice || null,
        imageUrl: item.imageUrl || "/images/default-product.jpg", // Fallback image
        category: item.category,
        subCategory: item.subCategory || "general",
        details: item.specifications || "",
        isBestseller: !!item.isFeatured
      })),
      error: undefined
    };
  } catch (error) {
    console.error("Error fetching sportswear products:", error);
    // Return fallback data in case of errors with error message
    return {
      products: fallbackSportswearProducts,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

export default async function SportswearPage() {
  // Fetch sportswear products
  const { products, error } = await getSportswearProducts();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full container py-6 px-4 md:px-6">
        <Breadcrumbs 
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cửa hàng", href: "/store" },
            { label: "Quần áo thể thao",href: "/store/sportswear" },
          ]} 
        />
        {error && (
          <div className="flex items-center gap-2 text-yellow-600 mt-4 p-2 bg-yellow-50 rounded-md">
            <AlertCircle size={18} />
            <p>Hiển thị dữ liệu dự phòng: {error}</p>
          </div>
        )}
      </div>
      <SportswearSection products={products} />
    </main>
  );
}