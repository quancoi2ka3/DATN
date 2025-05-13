"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { ChevronRight, Play, Flame, Dumbbell, Timer } from "lucide-react";

// Slides data for the dynamic hero section
const heroSlides = [
  {
    id: 1,
    image: "/images/home-slide-2.jpg",
    subtitle: "UNLOCK YOUR FULL POTENTIAL",
    title: "Cân bằng hơn, linh hoạt hơn",
    description: "Phương pháp luyện tập khoa học giúp bạn đạt được thể trạng tốt nhất và sức khỏe bền vững.",
    cta: "ĐĂNG KÝ NGAY",
    link: "/dang-ky-ngay",
    icon: <Flame className="h-5 w-5" />
  },
  {
    id: 2,
    image: "/images/strength.jpg",
    subtitle: "STRENGTH TRAINING",
    title: "Xây dựng sức mạnh từng ngày",
    description: "Các bài tập sức mạnh được thiết kế riêng biệt cho từng cấp độ và mục tiêu của bạn.",
    cta: "KHÁM PHÁ",
    link: "/dich-vu",
    icon: <Dumbbell className="h-5 w-5" />
  },
  {
    id: 3,
    image: "/images/yoga.jpg",
    subtitle: "MIND & BODY BALANCE",
    title: "Tìm lại sự cân bằng bên trong",
    description: "Các lớp học yoga và thiền định giúp bạn cải thiện sức khỏe tinh thần và thể chất.",
    cta: "TÌM HIỂU THÊM",
    link: "/dich-vu",
    icon: <Timer className="h-5 w-5" />
  }
];

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);
  const flameRef = useRef<HTMLDivElement>(null);
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  // Create flame movement effect
  useEffect(() => {
    if (!flameRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!flameRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = flameRef.current.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      // Calculate offset to make flames move slightly with mouse
      const offsetX = (x - 0.5) * 30;
      const offsetY = (y - 0.5) * 30;
      
      flameRef.current.style.setProperty('--flame-offset-x', `${offsetX}px`);
      flameRef.current.style.setProperty('--flame-offset-y', `${offsetY}px`);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random particles only on client-side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 30 + 10}px`,
        height: `${Math.random() * 100 + 50}px`,
        opacity: 0.7 + Math.random() * 0.3,
        animationDuration: `${Math.random() * 3 + 1}s`,
        animationDelay: `${Math.random() * 2}s`,
      }
    }));
    
    setParticles(newParticles);
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === activeSlide) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 300);
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <section className="relative h-[85vh] overflow-hidden" ref={flameRef}>
      {/* Animated background */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-in-out ${isTransitioning ? 'scale-110' : 'scale-100'}`}
        style={{ backgroundImage: `url('${currentSlide.image}')` }}
      />
      
      {/* Fire overlay effect */}
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black/90 to-transparent opacity-50"></div>
      
      {/* Fire particles for bottom of the hero */}
      <div className="absolute bottom-0 left-0 w-full h-40 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bottom-0 rounded-full bg-gradient-to-t from-orange-500 to-red-500 flame-effect"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 100 + 50}px`,
              opacity: 0.7 + Math.random() * 0.3,
              animationDuration: `${Math.random() * 3 + 1}s`,
              animationDelay: `${Math.random() * 2}s`,
              filter: 'blur(8px)',
              transform: 'translateX(var(--flame-offset-x)) translateY(var(--flame-offset-y))'
            }}
          />
        ))}
      </div>
      
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-gradient-to-t from-red-500/20 to-transparent rounded-full animate-float"
            style={particle.style}
          />
        ))}
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      
      {/* Energetic lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 opacity-80"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-transparent opacity-80"></div>
      </div>
      
      {/* Dynamic content */}
      <div className="container relative z-10 flex h-full items-center">
        <div className={`max-w-3xl transition-all duration-700 ${isTransitioning ? 'opacity-0 -translate-y-12' : 'opacity-100 translate-y-0'}`}>
          <div className="mb-6">
            <span className="inline-block fire-gradient pulse-glow px-4 py-1 text-sm font-bold tracking-wider text-white rounded-full">
              {currentSlide.subtitle}
            </span>
          </div>
          
          <h1 className="mb-6 font-sans text-5xl font-extrabold leading-tight tracking-tighter fire-text-blink dramatic-text text-white md:text-6xl lg:text-7xl">
            {currentSlide.title}
          </h1>
          
          <p className="mb-8 max-w-xl text-lg text-slate-300">
            {currentSlide.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 stagger-children">
            <Button 
              size="lg" 
              className="group relative overflow-hidden fire-button burning-button px-8 py-6 text-md font-bold bg-red-500 hover:bg-red-600"
              asChild
            >
              <Link href={currentSlide.link}>
                <span className="relative z-10 flex items-center">
                  {currentSlide.icon}
                  <span className="ml-2">{currentSlide.cta}</span>
                </span>
                <span className="streak-effect"></span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white hover-lift bg-transparent text-white hover:bg-white/10"
            >
              <Play className="mr-2 h-4 w-4 fill-white" />
              Xem video
            </Button>
          </div>
          
          {/* Slide indicators */}
          <div className="mt-16 flex items-center gap-3">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                className={`relative h-[3px] transition-all ${
                  index === activeSlide ? "w-12 bg-red-500 pulse-glow" : "w-6 bg-white/50 hover:bg-white/80"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation arrows with fire effect */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        <button 
          onClick={prevSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-red-500 hover:border-transparent fire-button"
          aria-label="Previous slide"
        >
          <ChevronRight className="h-6 w-6 rotate-180" />
        </button>
        <button 
          onClick={nextSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-red-500 hover:border-transparent fire-button"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      
      {/* Energetic stat counters */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="container">
          <div className="flex justify-center gap-6 mb-10">
            <div className="bg-black/50 backdrop-blur-md px-5 py-3 rounded-t-lg border-t-2 border-red-500 flex flex-col items-center">
              <div className="text-xl font-bold text-white energy-burst">5000+</div>
              <div className="text-xs text-slate-300">Thành viên</div>
            </div>
            <div className="bg-black/50 backdrop-blur-md px-5 py-3 rounded-t-lg border-t-2 border-orange-500 flex flex-col items-center">
              <div className="text-xl font-bold text-white energy-burst">15+</div>
              <div className="text-xs text-slate-300">Năm kinh nghiệm</div>
            </div>
            <div className="bg-black/50 backdrop-blur-md px-5 py-3 rounded-t-lg border-t-2 border-yellow-500 flex flex-col items-center">
              <div className="text-xl font-bold text-white energy-burst">100%</div>
              <div className="text-xs text-slate-300">Hài lòng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
