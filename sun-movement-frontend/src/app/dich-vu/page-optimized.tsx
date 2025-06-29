"use client";

import { Suspense } from "react";
import { LazyOnScroll, SectionSkeleton } from "@/components/ui/lazy-skeleton";

// Import chỉ hero section và critical components
import { OptimizedHeroSection } from "@/components/sections/optimized-hero";

// Lazy load các sections khác của trang dịch vụ
function ServicesHeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-orange-500 to-red-600 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Dịch Vụ Fitness Chuyên Nghiệp
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Khám phá các chương trình tập luyện được thiết kế riêng cho mục tiêu của bạn
          </p>
        </div>
      </div>
    </div>
  );
}

function ServicesGridSection() {
  // Services data
  const services = [
    {
      id: 1,
      title: "Calisthenics",
      description: "Tập luyện với trọng lượng cơ thể, phát triển sức mạnh và sự linh hoạt tự nhiên",
      image: "/images/calisthenics.jpg",
      price: "800.000",
      duration: "60 phút",
      level: "Mọi trình độ"
    },
    {
      id: 2,
      title: "Strength Training",
      description: "Xây dựng cơ bắp và sức mạnh với các bài tập tạ và thiết bị chuyên nghiệp",
      image: "/images/strength.jpg",
      price: "900.000",
      duration: "75 phút",
      level: "Trung cấp"
    },
    {
      id: 3,
      title: "Yoga",
      description: "Cân bằng thể chất và tinh thần, tăng cường sự linh hoạt và thư giãn",
      image: "/images/yoga.jpg",
      price: "600.000",
      duration: "90 phút",
      level: "Mọi trình độ"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Các Gói Dịch Vụ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn chương trình phù hợp với mục tiêu và thời gian của bạn
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Thời lượng:</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trình độ:</span>
                    <span className="font-medium">{service.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giá:</span>
                    <span className="font-bold text-orange-600">{service.price}đ/tháng</span>
                  </div>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors">
                  Đăng ký ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesCTASection() {
  return (
    <div className="py-16 bg-gradient-to-br from-orange-500 to-red-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Sẵn sàng bắt đầu hành trình của bạn?
        </h2>
        <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
          Trở thành phiên bản tốt nhất của chính mình cùng Sun Movement ngay hôm nay
        </p>
        <button className="bg-white text-red-600 hover:bg-red-100 px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all">
          Đăng ký ngay - Tiết kiệm 40%
        </button>
      </div>
    </div>
  );
}

export default function ServicesPageOptimized() {
  return (
    <div className="min-h-screen">
      {/* Critical hero section - load immediately */}
      <ServicesHeroSection />
      
      {/* Lazy load services grid */}
      <LazyOnScroll 
        fallback={<SectionSkeleton className="py-16 bg-white" />}
        rootMargin="200px"
      >
        <ServicesGridSection />
      </LazyOnScroll>
      
      {/* Lazy load CTA section */}
      <LazyOnScroll 
        fallback={
          <div className="py-16 bg-gradient-to-br from-orange-500 to-red-600">
            <div className="container mx-auto px-4 text-center space-y-8">
              <div className="h-8 w-80 bg-white/20 rounded mx-auto animate-pulse"></div>
              <div className="h-4 w-96 bg-white/20 rounded mx-auto animate-pulse"></div>
              <div className="h-12 w-48 bg-white/20 rounded mx-auto animate-pulse"></div>
            </div>
          </div>
        }
        rootMargin="100px"
      >
        <ServicesCTASection />
      </LazyOnScroll>
    </div>
  );
}
