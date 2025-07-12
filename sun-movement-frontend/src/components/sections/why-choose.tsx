"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building, PersonStanding, Award, Scroll, Dumbbell, Users, Clock, Heart, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export function WhyChooseSection() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);
  const [cardParticles, setCardParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  const features = [
    {
      id: "facilities",
      title: "Đa dạng hoạt động tập luyện",
      description: "Cung cấp đầy đủ các bộ môn: Calisthenics, Strength Training, Yoga, Conditioning, Mobility cùng các hoạt động ngoại khóa và retreat.",
      icon: Dumbbell,
      color: "from-red-600 to-red-500",
      stats: "5+",
      statLabel: "Bộ môn chính"
    },
    {
      id: "coaches",
      title: "Đội ngũ sáng lập chuyên nghiệp",
      description: "3 Co-founder chuyên sâu từng lĩnh vực: Lê Hoàng Trung (Nutrition), Nguyễn Đình Hưng (Calisthenics), Nguyễn Đức Bình (Yoga).",
      icon: PersonStanding,
      color: "from-amber-500 to-orange-500",
      stats: "3",
      statLabel: "Co-founder"
    },
    {
      id: "programs",
      title: "Triết lý 'Kỷ luật - Tự do - Sáng tạo'",
      description: "Xây dựng nền tảng đạo đức vững chắc, phát triển kỷ luật bản thân, tự do trong thể hiện và sáng tạo trong tập luyện.",
      icon: Scroll,
      color: "from-cyan-500 to-blue-500",
      stats: "3",
      statLabel: "Giá trị cốt lõi"
    },
    {
      id: "community",
      title: "Cộng đồng 'Vì sức khỏe cộng đồng'",
      description: "Sứ mệnh 'Vì sức khỏe cộng đồng, vì Việt Nam văn minh sống!' - xây dựng cộng đồng tập luyện tích cực và ý thức cao.",
      icon: Users,
      color: "from-emerald-500 to-green-500",
      stats: "1",
      statLabel: "Sứ mệnh"
    },
  ];

  const benefits = [
    {
      id: "results",
      title: "Tầm nhìn phát triển hàng đầu",
      description: "Sun Movement định hướng phát triển thành một tổ chức hàng đầu cung cấp các dịch vụ về giáo dục thể dục, sinh luyện, dinh dưỡng, thẩm mỹ.",
      icon: Clock,
    },
    {
      id: "health",
      title: "Nền tảng đạo đức vững chắc",
      description: "Xây dựng trên những giá trị cốt lõi về kỷ luật, tự do và sáng tạo, tạo nền tảng đạo đức vững chắc cho mọi hoạt động.",
      icon: Heart,
    },
  ];

  useEffect(() => {
    // Generate background particles
    const newBackgroundParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 30 + 10}px`,
        height: `${Math.random() * 60 + 20}px`,
        opacity: 0.5 + Math.random() * 0.5,
        animationDuration: `${Math.random() * 3 + 1}s`,
        animationDelay: `${Math.random() * 2}s`,
      }
    }));
    setBackgroundParticles(newBackgroundParticles);

    // Generate card particles
    const newCardParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 20 + 5}px`,
        height: `${Math.random() * 40 + 10}px`,
        opacity: 0.6 + Math.random() * 0.4,
        animationDuration: `${Math.random() * 2 + 0.5}s`,
      }
    }));
    setCardParticles(newCardParticles);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-gradient-to-t from-red-500/20 to-transparent rounded-full animate-float-slow"
            style={particle.style}
          />
        ))}
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-10 streak-container">
        <Image 
          src="/images/dichvu/Strength-Thumb.webp" 
          alt="Background pattern" 
          fill 
          sizes="100vw"
          className="object-cover"
        />
        <div className="streak-effect"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16 max-w-3xl mx-auto strong-entrance">
          <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-semibold mb-4 border border-red-500/20 fire-button">
            WHY CHOOSE US
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6 dramatic-text">
            Lý do bạn nên chọn
            <span className="block text-5xl md:text-6xl mt-2 fire-text pulse-glow">
              SUN MOVEMENT
            </span>
          </h2>
          
          <div className="w-20 h-1 fire-gradient mx-auto my-6"></div>
          
          <p className="text-gray-300 text-lg">
            Sun Movement được xây dựng bởi 3 co-founder chuyên nghiệp với sứ mệnh "Vì sức khỏe cộng đồng, vì Việt Nam văn minh sống!". 
            Chúng tôi kết hợp đa dạng bộ môn từ Calisthenics, Strength Training, Yoga, Conditioning đến Mobility, 
            cùng các hoạt động ngoại khóa và retreat để tạo nên một cộng đồng tập luyện toàn diện.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 stagger-children">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="fitness-card bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border-l-4 border-l-red-500 shadow-lg group hover:shadow-xl transition-all"
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="relative streak-container">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="streak-effect"></div>
                <div className="p-6 relative">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white pulse-glow`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-auto bg-slate-700/70 px-3 py-1 rounded-full flex flex-col items-center energy-burst">
                      <span className="font-bold text-white text-lg fire-text-blink">{feature.stats}</span>
                      <span className="text-gray-400 text-xs">{feature.statLabel}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors dramatic-text">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <button className="text-red-400 font-semibold flex items-center text-sm group-hover:text-white transition-colors power-shake">
                      Tìm hiểu thêm
                      <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  {/* Fire Effect for active card */}
                  {activeFeature === feature.id && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {cardParticles.map((particle) => (
                        <div
                          key={particle.id}
                          className="absolute bg-gradient-to-t from-red-500/10 to-transparent rounded-full animate-float"
                          style={particle.style}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional benefits */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto stagger-children">
          {benefits.map((benefit) => (
            <div 
              key={benefit.id}
              className="flex items-start p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-lg border border-red-500/20 hover-lift streak-container"
            >
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white mr-4 pulse-glow">
                <benefit.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 dramatic-text">
                  {benefit.title}
                </h3>
                <p className="text-gray-400">
                  {benefit.description}
                </p>
              </div>
              <div className="streak-effect"></div>
            </div>
          ))}
        </div>
        
        {/* Statistics with fire effects */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 bg-slate-800/50 rounded-xl p-6 max-w-5xl mx-auto backdrop-blur-sm border border-slate-700 streak-container">
          <div className="text-center p-4 relative">
            <div className="text-3xl text-sunred md:text-4xl font-bold fire-text energy-burst">3</div>
            <div className="text-gray-400 mt-1">Co-founder</div>
            
            {/* Small flame effect */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 pointer-events-none opacity-70">
              <div className="absolute bottom-0 w-4 h-10 bg-gradient-to-t from-red-500 to-orange-400 rounded-full filter blur-[2px] flame-effect"></div>
            </div>
          </div>
          <div className="text-center p-4 relative">
            <div className="text-3xl text-sunred md:text-4xl font-bold fire-text energy-burst">5+</div>
            <div className="text-gray-400 mt-1">Bộ môn chính</div>
            
            {/* Small flame effect */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 pointer-events-none opacity-70">
              <div className="absolute bottom-0 w-4 h-10 bg-gradient-to-t from-red-500 to-orange-400 rounded-full filter blur-[2px] flame-effect"></div>
            </div>
          </div>
          <div className="text-center p-4 relative">
            <div className="text-3xl text-sunred md:text-4xl font-bold fire-text energy-burst">1</div>
            <div className="text-gray-400 mt-1">Sứ mệnh lớn</div>
            
            {/* Small flame effect */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 pointer-events-none opacity-70">
              <div className="absolute bottom-0 w-4 h-10 bg-gradient-to-t from-red-500 to-orange-400 rounded-full filter blur-[2px] flame-effect"></div>
            </div>
          </div>
          <div className="text-center p-4 relative">
            <div className="text-3xl text-sunred md:text-4xl font-bold fire-text energy-burst">100%</div>
            <div className="text-gray-400 mt-1">Tận tâm</div>
            
            {/* Small flame effect */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 pointer-events-none opacity-70">
              <div className="absolute bottom-0 w-4 h-10 bg-gradient-to-t from-red-500 to-orange-400 rounded-full filter blur-[2px] flame-effect"></div>
            </div>
          </div>
          
          <div className="streak-effect"></div>
        </div>
      </div>
    </section>
  );
}
