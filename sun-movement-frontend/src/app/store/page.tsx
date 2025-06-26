import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cửa hàng | Sun Movement",
  description: "Mua sắm các sản phẩm thực phẩm bổ sung và quần áo thể thao tại Sun Movement",
};

export default function StorePage() {
  const categories = [
    {
      name: "Thực phẩm bổ sung",
      description: "Các sản phẩm thực phẩm bổ sung chất lượng cao, giúp tối ưu hóa hiệu quả tập luyện và phục hồi.",
      image: "/images/supplements/supplements-banner.jpg",
      link: "/store/supplements",
    },    {
      name: "Sportswear",
      description: "Quần áo và phụ kiện thể thao chất lượng cao, phù hợp với mọi hoạt động thể thao và tập luyện.",
      image: "/images/sportswear-banner.jpg",
      link: "/store/sportswear",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Breadcrumbs */}        <div className="container py-6 px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Cửa hàng", href: "/store" }]} />
        </div>

        {/* Hero Banner */}
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-12">
          <Image
            src="/images/store-banner.jpg"
            alt="Sun Movement Store"
            fill
            sizes="100vw"
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center">
              Sun Movement Shop
            </h1>
            <p className="text-lg md:text-xl max-w-2xl text-center">
              Nâng cao hiệu suất tập luyện với các sản phẩm bổ sung dinh dưỡng và quần áo thể thao chất lượng cao
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="container px-4 md:px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div key={category.name} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-64 w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link 
                    href={category.link} 
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800"
                  >
                    Xem sản phẩm <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}