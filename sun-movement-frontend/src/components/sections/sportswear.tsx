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

// Fallback sportswear in case no products are provided
const fallbackSportswear: Product[] = [
  {
    id: "sw1",
    name: "Performance Training Shirt",
    description: "Áo tập luyện cao cấp với công nghệ thoáng khí, thích hợp cho mọi hoạt động thể thao.",
    price: 350000,
    imageUrl: "/images/sportswear/casual-white.webp",
    StockQuantity: 100,
    category: "tops",
  },
  {
    id: "sw2",
    name: "Athletic Shorts", 
    description: "Quần short thể thao co giãn 4 chiều, mang lại sự thoải mái tối đa khi vận động.",
    price: 280000,
    imageUrl: "/images/sportswear/short.webp",
    StockQuantity: 100,
    category: "bottoms",
  },
  {
    id: "sw3",
    name: "Sport Tank Top",
    description: "Áo ba lỗ thể thao nam thiết kế năng động, chất liệu thấm hút mồ hôi tốt.",
    price: 250000,
    StockQuantity: 100,
    imageUrl: "/images/sportswear/tank-top.webp",
    category: "tops",
  },
];

// Props interface for the SportswearSection component
interface SportswearSectionProps {
  products?: Product[]; // Optional because it could be used in homepage without products
}

// Main sportswear categories
const mainCategories = [
  { name: "Áo thể thao", icon: "/images/sportswear/tops.jpg" },
  { name: "Quần thể thao", icon: "/images/sportswear/bottoms.jpg" },
  { name: "Áo khoác", icon: "/images/sportswear/outerwear.jpg" },
  { name: "Phụ kiện", icon: "/images/sportswear/accessories.jpg" },
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
    StockQuantity: (item as any).StockQuantity ?? (item as any).StockQuantity ?? 0,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 100) + 10,
    sizes: [],
    colors: []
  }));
};

// Mock product service for fallback
const mockProductService = {
  async getSportswearProducts(): Promise<BackendProduct[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fallbackSportswear.map(product => ({
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

export function SportswearSection({ products }: SportswearSectionProps) {
  // State for managing products and loading
  const [displayProducts, setDisplayProducts] = useState<Product[]>(fallbackSportswear);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sportswear from backend
  useEffect(() => {
    const fetchSportswear = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching sportswear from backend...');
        const sportswear = await mockProductService.getSportswearProducts();
        
        if (sportswear.length > 0) {
          console.log('Successfully fetched sportswear:', sportswear.length);
          const formattedSportswear = convertBackendToFrontend(sportswear);
          setDisplayProducts(formattedSportswear);
          
          // Get featured products
          const featured = formattedSportswear.filter(p => p.isFeatured);
          setFeaturedProducts(featured.length > 0 ? featured.slice(0, 3) : formattedSportswear.slice(0, 3));
        } else {
          console.log('No sportswear found, using fallback data');
          setDisplayProducts(fallbackSportswear);
          setFeaturedProducts(fallbackSportswear.slice(0, 3));
          setError('Không thể tải dữ liệu sản phẩm. Hiển thị dữ liệu mẫu.');
        }
      } catch (err) {
        console.error('Error fetching sportswear:', err);
        setDisplayProducts(fallbackSportswear);
        setFeaturedProducts(fallbackSportswear.slice(0, 3));
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
      fetchSportswear();
    }
  }, [products]);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Trang phục thể thao
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Trang phục thể thao chất lượng cao, thiết kế hiện đại cho mọi hoạt động vận động.
          </p>
        </div>

        {/* Categories section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {mainCategories.map((category, index) => (
            <Link href="/store/sportswear" key={index}>
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
          <Link href="/store/sportswear">
            <Button className="gap-2 px-6 py-6 text-lg" size="lg">
              Xem tất cả sản phẩm <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
