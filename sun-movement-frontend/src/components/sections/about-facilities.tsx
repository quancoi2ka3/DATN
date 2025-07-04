"use client";

import { Building, Wifi, Car, Coffee, Music, Shield, Dumbbell, Users, Heart, Clock, Bath } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const FacilitiesSection = () => {
  const facilities = [
    {
      icon: Dumbbell,
      title: "Phòng Gym Hiện Đại",
      description: "Trang bị máy móc tiên tiến từ các thương hiệu hàng đầu thế giới",
      image: "/images/gioithieu/khuvucstrength.webp",
      color: "from-red-500 to-red-400"
    },
    {
      icon: Heart,
      title: "Phòng Yoga & Meditation",
      description: "Không gian yên tĩnh cho việc thư giãn và rèn luyện tinh thần",
      image: "/images/gioithieu/khuvucyoga.webp",
      color: "from-emerald-500 to-emerald-400"
    },
    {
      icon: Users,
      title: "Sân Tập Nhóm",
      description: "Khu vực rộng rãi cho các hoạt động tập luyện theo nhóm",
      image: "/images/gioithieu/khonggiancalis.webp",
      color: "from-blue-500 to-blue-400"
    },
    {
      icon: Bath,
      title: "Phòng Tắm & Thay Đồ",
      description: "Tiện nghi đầy đủ với tủ khóa an toàn và vòi sen nước nóng",
      image: "/images/gioithieu/phongtam.webp",
      color: "from-purple-500 to-purple-400"
    }
  ];

  const amenities = [
    {
      icon: Wifi,
      title: "WiFi Miễn Phí",
      description: "Kết nối internet tốc độ cao"
    },
    {
      icon: Car,
      title: "Bãi Đỗ Xe",
      description: "Chỗ đỗ xe máy và ô tô an toàn"
    },
    {
      icon: Coffee,
      title: "Quầy Nước",
      description: "Đồ uống bổ sung năng lượng"
    },
    {
      icon: Music,
      title: "Hệ Thống Âm Thanh",
      description: "Âm nhạc động lực cho buổi tập"
    },
    {
      icon: Shield,
      title: "An Ninh 24/7",
      description: "Hệ thống camera giám sát toàn bộ"
    },
    {
      icon: Building,
      title: "Thang Máy",
      description: "Thuận tiện di chuyển giữa các tầng"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-blue-500/20">
            <Building className="h-5 w-5 text-blue-500" />
            <span className="text-blue-400 font-semibold uppercase tracking-wide text-sm">Cơ Sở Vật Chất</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Không Gian Tập Luyện 
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent block mt-2">
              Hiện Đại & Tiện Nghi
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 leading-relaxed">
            Với diện tích hơn 1000m², Sun Movement cung cấp môi trường tập luyện chuyên nghiệp 
            cùng các tiện ích đầy đủ cho trải nghiệm tuyệt vời nhất.
          </p>
        </div>

        {/* Main Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {facilities.map((facility, index) => (
            <div 
              key={index}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-border-smooth duration-500 hover:transform hover:scale-[1.02] transition-transform-smooth"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"></div>
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${facility.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <facility.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {facility.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Amenities Grid */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Tiện Ích Đi Kèm
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <div 
                key={index}
                className="group flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors-smooth duration-300 hover:transform hover:translateY-[-2px] transition-transform-smooth"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-400 transition-all duration-300">
                  <amenity.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {amenity.title}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Trải Nghiệm Ngay Hôm Nay
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Đến và cảm nhận không gian tập luyện đẳng cấp cùng đội ngũ hỗ trợ chuyên nghiệp của chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:transform hover:scale-105">
                <Link href={"https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"}>Đăng Ký Tham Quan</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
