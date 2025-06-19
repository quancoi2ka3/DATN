"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { Product as BackendProduct, productService } from "@/services/productService";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

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
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    salePrice: item.discountPrice || null,
    imageUrl: item.imageUrl,
    category: item.category,
    subCategory: item.subCategory || "general",
    isNew: false,
    isBestseller: !!item.isBestseller
  }));
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
        const supplements = await productService.getSupplementsProducts();
        
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
                  <Image
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
              <div 
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{product.price.toLocaleString()} VNĐ</span>
                  </div>
                </div>              </div>
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