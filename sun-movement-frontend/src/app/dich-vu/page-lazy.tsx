"use client";

import { Suspense } from "react";
import { LazyOnScroll, SectionSkeleton } from "@/components/ui/lazy-skeleton";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Dumbbell, Heart, Users } from "lucide-react";

// Hero Section for Services
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-red-600 hover:bg-red-100 px-8 py-4 h-auto rounded-lg font-medium text-lg">
              <Star className="mr-2 h-5 w-5" />
              Đăng ký ngay
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 h-auto rounded-lg font-medium text-lg">
              Tư vấn miễn phí
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Services Grid
function ServicesGridSection() {
  const services = [
    {
      id: 1,
      title: "Calisthenics",
      description: "Tập luyện với trọng lượng cơ thể, phát triển sức mạnh và sự linh hoạt tự nhiên",
      icon: <Users className="h-8 w-8" />,
      price: "800.000",
      duration: "60 phút",
      level: "Mọi trình độ",
      features: ["Xây dựng sức mạnh cơ bản", "Cải thiện tính linh hoạt", "Không cần thiết bị"]
    },
    {
      id: 2,
      title: "Strength Training",
      description: "Xây dựng cơ bắp và sức mạnh với các bài tập tạ và thiết bị chuyên nghiệp",
      icon: <Dumbbell className="h-8 w-8" />,
      price: "900.000",
      duration: "75 phút",
      level: "Trung cấp",
      features: ["Tăng khối lượng cơ", "Phát triển sức mạnh", "Thiết bị chuyên nghiệp"]
    },
    {
      id: 3,
      title: "Yoga",
      description: "Cân bằng thể chất và tinh thần, tăng cường sự linh hoạt và thư giãn",
      icon: <Heart className="h-8 w-8" />,
      price: "600.000",
      duration: "90 phút",
      level: "Mọi trình độ",
      features: ["Thư giãn tinh thần", "Tăng tính linh hoạt", "Cân bằng cơ thể"]
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
            <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold ml-4">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
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
                
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg">
                  Đăng ký ngay
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// CTA Section
function ServicesCTASection() {
  return (
    <div className="py-16 bg-gradient-to-br from-orange-500 to-red-600">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu hành trình của bạn?
          </h2>
          <p className="text-xl text-slate-200 mb-4">
            Trở thành phiên bản tốt nhất của chính mình cùng Sun Movement ngay hôm nay
          </p>
          <p className="text-orange-400 font-medium mb-8">
            🎯 Tiết kiệm đến 40% chi phí - Chỉ dành cho 100 thành viên đầu tiên!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button className="bg-white text-red-600 hover:bg-red-100 px-8 py-4 h-auto rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all">
              <Star className="mr-2 h-5 w-5" />
              Đăng ký ngay - Tiết kiệm 1.000.000đ
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
              <span>Cam kết hoàn tiền 100%</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
              <span>Không ràng buộc hợp đồng dài hạn</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
              <span>Buổi tập đầu tiên miễn phí</span>
            </div>
          </div>
        </div>
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
