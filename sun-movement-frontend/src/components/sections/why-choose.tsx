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
      title: "Không gian & Thiết bị hiện đại",
      description: "Không gian tập luyện rộng rãi với các thiết bị hiện đại nhất, được thiết kế tối ưu cho cả mục tiêu tăng cơ và đốt mỡ.",
      icon: Dumbbell,
      color: "from-red-600 to-red-500",
      stats: "1500m²",
      statLabel: "Diện tích"
    },
    {
      id: "coaches",
      title: "Huấn luyện viên chuyên nghiệp",
      description: "Đội ngũ HLV giàu kinh nghiệm, được đào tạo chuyên sâu về khoa học thể thao và dinh dưỡng, luôn đồng hành cùng bạn.",
      icon: PersonStanding,
      color: "from-amber-500 to-orange-500",
      stats: "10+",
      statLabel: "HLV chuyên nghiệp"
    },
    {
      id: "programs",
      title: "Chương trình cá nhân hóa",
      description: "Lịch trình tập luyện và dinh dưỡng được thiết kế riêng theo thể trạng, mục tiêu và khả năng của từng người.",
      icon: Scroll,
      color: "from-cyan-500 to-blue-500",
      stats: "100%",
      statLabel: "Cá nhân hóa"
    },
    {
      id: "community",
      title: "Cộng đồng năng động",
      description: "Trở thành thành viên SUN MOVEMENT, bạn sẽ gia nhập vào một cộng đồng đam mê tập luyện, luôn truyền cảm hứng và động lực.",
      icon: Users,
      color: "from-emerald-500 to-green-500",
      stats: "500+",
      statLabel: "Thành viên"
    },
  ];

  const benefits = [
    {
      id: "results",
      title: "Kết quả nhanh chóng",
      description: "Phương pháp tập luyện khoa học giúp bạn đạt được kết quả nhanh hơn và bền vững hơn.",
      icon: Clock,
    },
    {
      id: "health",
      title: "Sức khỏe toàn diện",
      description: "Chúng tôi không chỉ chú trọng vẻ ngoài mà còn cân bằng sức khỏe cả về thể chất và tinh thần.",
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
          src="/images/pattern-grid.png" 
          alt="Background pattern" 
          fill 
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
            Chúng tôi không chỉ là nơi tập luyện, mà còn là nơi định hình lối sống khoẻ mạnh và cân bằng. 
            Với môi trường chuyên nghiệp, trang thiết bị hiện đại, cùng đội ngũ huấn luyện viên tận tâm.
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
            <div className="text-3xl md:text-4xl font-bold fire-text energy-burst">5+</div>
            <div className="text-gray-400 mt-1">Năm kinh nghiệm</div>
            
            {/* Small flame effect */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 pointer-events-none opacity-70">
              <div className="absolute bottom-0 w-4 h-10 bg-gradient-to-t from-red-500 to-orange-400 rounded-full filter blur-[2px] flame-effect"></div>
            </div>
          </div>
          <div className="text-center p-4 relative">
            <div className="text-3xl md:text-4xl font-bold fire-text energy-burst">1500+</div>
            <div className="text-gray-400 mt-1">Khách hàng</div>
            
            {/* Small flame effect */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 pointer-events-none opacity-70">
              <div className="absolute bottom-0 w-4 h-10 bg-gradient-to-t from-red-500 to-orange-400 rounded-full filter blur-[2px] flame-effect"></div>
            </div>
          </div>
          <div className="text-center p-4 relative">
            <div className="text-3xl md:text-4xl font-bold fire-text energy-burst">15+</div>
            <div className="text-gray-400 mt-1">Chương trình</div>
            
            {/* Small flame effect */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 pointer-events-none opacity-70">
              <div className="absolute bottom-0 w-4 h-10 bg-gradient-to-t from-red-500 to-orange-400 rounded-full filter blur-[2px] flame-effect"></div>
            </div>
          </div>
          <div className="text-center p-4 relative">
            <div className="text-3xl md:text-4xl font-bold fire-text energy-burst">98%</div>
            <div className="text-gray-400 mt-1">Khách hàng hài lòng</div>
            
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
