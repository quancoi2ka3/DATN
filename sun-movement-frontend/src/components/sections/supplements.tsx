"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { OptimizedProductCard } from "@/components/ui/optimized-product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// Define backend product type
interface BackendProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  category: string;
  subCategory?: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
}

// Fallback supplements in case no products are provided
const fallbackSupplements: Product[] = [
  {
    id: "1",
    name: "Whey Protein Isolate",
    description: "Protein whey đạm tinh khiết hấp thu nhanh, hỗ trợ tăng cơ hiệu quả.",
    price: 850000,
    imageUrl: "/images/supplements/protein.jpg",
    category: "protein",
  },
  {
    id: "5",
    name: "Creatine Monohydrate",
    description: "Tăng sức mạnh và hiệu suất tập luyện, hỗ trợ phát triển cơ bắp nhanh chóng.",
    price: 400000,
    imageUrl: "/images/supplements/creatine.jpg",
    category: "performance",
  },
  {
    id: "3",
    name: "BCAA 2:1:1",
    description: "Hỗ trợ phục hồi cơ bắp và giảm đau nhức sau tập luyện cường độ cao.",
    price: 450000,
    imageUrl: "/images/supplements/bcaa.jpg",
    category: "amino-acids",
  },
];

// Props interface for the SupplementsSection component
interface SupplementsSectionProps {
  products?: Product[]; // Optional because it could be used in homepage without products
}

// Main supplement categories
const mainCategories = [
  { name: "Protein", icon: "/images/supplements/protein.jpg" },
  { name: "Pre-Workout", icon: "/images/supplements/pre-workout.jpg" },
  { name: "Amino Acids", icon: "/images/supplements/bcaa.jpg" },
  { name: "Vitamin & Minerals", icon: "/images/supplements/vitamins.jpg" },
];

// Helper function to convert backend products to frontend format
const convertBackendToFrontend = (backendProducts: BackendProduct[]): Product[] => {
  return backendProducts.map(item => ({
    id: item.id.toString(),
    name: item.name,
    description: item.description,
    price: item.price,
    salePrice: item.discountPrice || null,
    originalPrice: item.discountPrice ? item.price : undefined,
    imageUrl: item.imageUrl,
    category: item.category,
    subCategory: item.subCategory || "general",
    isNew: false,
    isBestseller: !!item.isBestseller,
    isFeatured: !!item.isFeatured,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 100) + 10,
    sizes: [],
    colors: []
  }));
};

// Mock product service for fallback
const mockProductService = {
  async getSupplementsProducts(): Promise<BackendProduct[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fallbackSupplements.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category.toString(),
          isBestseller: true,
          isFeatured: true
        })));
      }, 1000);
    });
  }
};

export function SupplementsSection({ products }: SupplementsSectionProps) {
  // State for managing products and loading
  const [displayProducts, setDisplayProducts] = useState<Product[]>(fallbackSupplements);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch supplements from backend
  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching supplements from backend...');
        const supplements = await mockProductService.getSupplementsProducts();
        
        if (supplements.length > 0) {
          console.log('Successfully fetched supplements:', supplements.length);
          const formattedSupplements = convertBackendToFrontend(supplements);
          setDisplayProducts(formattedSupplements);
          
          // Get featured products
          const featured = formattedSupplements.filter(p => p.isFeatured);
          setFeaturedProducts(featured.length > 0 ? featured.slice(0, 3) : formattedSupplements.slice(0, 3));
        } else {
          console.log('No supplements found, using fallback data');
          setDisplayProducts(fallbackSupplements);
          setFeaturedProducts(fallbackSupplements.slice(0, 3));
          setError('Không thể tải dữ liệu sản phẩm. Hiển thị dữ liệu mẫu.');
        }
      } catch (err) {
        console.error('Error fetching supplements:', err);
        setDisplayProducts(fallbackSupplements);
        setFeaturedProducts(fallbackSupplements.slice(0, 3));
        setError('Lỗi kết nối đến server. Hiển thị dữ liệu mẫu.');
      } finally {
        setLoading(false);
      }
    };

    // If products are provided via props, use them; otherwise fetch from API
    if (products && products.length > 0) {
      console.log('Using provided products:', products.length);
      setDisplayProducts(products);
      const bestsellers = products.filter(p => p.isBestseller);
      setFeaturedProducts(bestsellers.length > 0 ? bestsellers.slice(0, 3) : products.slice(0, 3));
      setLoading(false);
    } else {
      fetchSupplements();
    }
  }, [products]);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Thực phẩm bổ sung
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Các sản phẩm thực phẩm bổ sung chất lượng cao, giúp tối ưu hóa hiệu quả tập luyện và phục hồi.
          </p>
        </div>

        {/* Categories section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {mainCategories.map((category, index) => (
            <Link href="/store/supplements" key={index}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="relative h-32 w-full">
                  <OptimizedImage
                    src={category.icon}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured products */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(featuredProducts.length > 0 ? featuredProducts : displayProducts.slice(0, 3)).map((product) => (
              <OptimizedProductCard 
                key={product.id}
                product={product}
                variant="default"
                showWishlist={true}
              />
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="flex justify-center mt-8">
          <Link href="/store/supplements">
            <Button className="gap-2 px-6 py-6 text-lg" size="lg">
              Xem tất cả sản phẩm <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}