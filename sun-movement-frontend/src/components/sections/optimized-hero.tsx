"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, memo, Suspense } from "react";
import { ChevronRight, Play, ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Slides data - simplified for better performance
const heroSlides = [
  {
    id: 1,
    image: "/images/home-slide-3.webp",
    subtitle: "UNLOCK YOUR POTENTIAL",
    title: "Cân bằng hơn, linh hoạt hơn",
    description: "Phương pháp luyện tập khoa học giúp bạn đạt được thể trạng tốt nhất.",
    cta: "ĐĂNG KÝ NGAY",
    link: "/dich-vu",
    bgGradient: "from-red-600/40 via-orange-500/30 to-transparent"
  },
  {
    id: 2,
    image: "/images/home-slide-1.webp",
    subtitle: "STRENGTH TRAINING",
    title: "Xây dựng sức mạnh từng ngày",
    description: "Các bài tập sức mạnh được thiết kế riêng biệt cho từng cấp độ.",
    cta: "KHÁM PHÁ",
    link: "/dich-vu",
    bgGradient: "from-blue-600/40 via-purple-500/30 to-transparent"
  },
  {
    id: 3,
    image: "/images/home-slide-2.webp",
    subtitle: "MIND & BODY BALANCE",
    title: "Tìm lại sự cân bằng bên trong",
    description: "Các lớp học yoga và thiền định giúp cải thiện sức khỏe toàn diện.",
    cta: "TÌM HIỂU THÊM",
    link: "/dich-vu",
    bgGradient: "from-green-600/40 via-teal-500/30 to-transparent"
  }
];

// Separate component for slide indicators
const SlideIndicators = memo(({ slides, activeSlide, onSlideChange }: {
  slides: typeof heroSlides;
  activeSlide: number;
  onSlideChange: (index: number) => void;
}) => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => onSlideChange(index)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          index === activeSlide 
            ? 'bg-white scale-125' 
            : 'bg-white/50 hover:bg-white/75'
        }`}
        aria-label={`Slide ${index + 1}`}
      />
    ))}
  </div>
));

SlideIndicators.displayName = 'SlideIndicators';

// Main component with reduced complexity
export function OptimizedHeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Preload hero images
  useEffect(() => {
    heroSlides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      if (index === 0) {
        img.loading = 'eager';
      }
    });
  }, []);

  // Auto-rotate slides with longer interval for better UX
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 8000); // Increased to 8 seconds
    };

    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    changeSlide((activeSlide + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    changeSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length);
  };

  const changeSlide = (newSlide: number) => {
    if (newSlide === activeSlide) return;
    
    setIsTransitioning(true);
    setActiveSlide(newSlide);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <section 
      className="hero-section relative h-[85vh] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="banner"
      aria-label="Hero carousel"
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="hero-background absolute inset-0 hero-image-loaded"
              style={{
                backgroundImage: `url('${slide.image}')`
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`} />
          </div>
        ))}
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div 
              className={`transition-all duration-700 ease-out ${
                isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
              }`}
            >
              <p className="hero-text text-sm font-medium text-white/95 mb-2 tracking-wider uppercase">
                {currentSlide.subtitle}
              </p>
              <h1 className="hero-text text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {currentSlide.title}
              </h1>
              <p className="hero-text text-xl text-white/95 mb-8 leading-relaxed">
                {currentSlide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="hero-button bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Link href={currentSlide.link}>
                    {currentSlide.cta}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 bg-red-600 border-white text-white hover:bg-black hover:text-sunred px-8 py-3 text-lg rounded-full transition-all duration-300 backdrop-blur-sm"
                  asChild
                >
                  <Link href="https://www.youtube.com/@SUNMovementVN">
                    <Play className="mr-2 h-5 w-5" />
                    Xem Video
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronRight className="w-6 h-6 rotate-180" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <SlideIndicators 
        slides={heroSlides}
        activeSlide={activeSlide}
        onSlideChange={changeSlide}
      />

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 right-8 z-20 animate-bounce">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">Cuộn xuống</span>
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>
      </div>
    </section>
  );
}
