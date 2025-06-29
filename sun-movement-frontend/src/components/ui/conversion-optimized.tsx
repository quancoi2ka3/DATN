"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Gift, Clock, Users } from "lucide-react";

// Social proof component
export function SocialProof() {
  const [stats, setStats] = useState({
    members: 1248,
    classes: 157,
    trainers: 12
  });

  useEffect(() => {
    // Animate numbers on mount
    const animateNumber = (start: number, end: number, setter: (val: number) => void) => {
      const duration = 1000;
      const step = (end - start) / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
    };

    animateNumber(0, 1248, (val) => setStats(prev => ({ ...prev, members: val })));
    animateNumber(0, 157, (val) => setStats(prev => ({ ...prev, classes: val })));
    animateNumber(0, 12, (val) => setStats(prev => ({ ...prev, trainers: val })));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary hover-lift transition-all-smooth">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full pulse-glow">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Cộng đồng Sun Movement</h3>
            <p className="text-sm text-gray-600">Tham gia cùng hàng nghìn thành viên khác</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{stats.members.toLocaleString()}+</div>
          <div className="text-sm text-gray-600">thành viên</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.classes}+</div>
          <div className="text-sm text-gray-600">lớp học/tháng</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.trainers}</div>
          <div className="text-sm text-gray-600">huấn luyện viên</div>
        </div>
      </div>
    </div>
  );
}

// Urgency timer component
export function UrgencyTimer({ endDate }: { endDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white rounded-xl p-6 shadow-lg hover-lift transition-all-smooth">
      <div className="flex items-center gap-2 mb-4 animate-in fade-in-up">
        <Clock className="w-5 h-5" />
        <h3 className="font-semibold">Ưu đái có thời hạn!</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white/20 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs">Ngày</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs">Giờ</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs">Phút</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs">Giây</div>
        </div>
      </div>
      
      <p className="text-center mt-4 text-sm opacity-90">
        Giảm 30% cho gói tập 6 tháng - Chỉ còn lại ít suất!
      </p>
    </div>
  );
}

// Exit intent popup
export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    // Track conversion
    // Redirect to registration or show form
    window.location.href = '/dich-vu?utm_source=exit_intent&utm_medium=popup';
  };

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary to-red-600 text-white p-8">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-4 mx-auto mb-4 w-fit">
              <Gift className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Đừng bỏ lỡ cơ hội!</h2>
            <p className="text-white/90 mb-6">
              Nhận ngay voucher giảm giá <span className="font-bold text-yellow-300">20%</span> cho lần đăng ký đầu tiên
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleClaim}
                className="w-full bg-white text-primary hover:bg-gray-100 font-semibold py-3"
                size="lg"
              >
                🎁 Nhận ngay voucher 20%
              </Button>
              
              <button
                onClick={handleClose}
                className="w-full text-white/80 hover:text-white text-sm underline"
              >
                Không, cảm ơn
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Testimonial carousel
export function TestimonialCarousel() {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Mai",
      role: "Nhân viên văn phòng",
      content: "Sau 3 tháng tập tại Sun Movement, tôi cảm thấy khỏe mạnh và tự tin hơn rất nhiều. Các huấn luyện viên rất tận tâm!",
      rating: 5,
      image: "/images/testimonials/mai.jpg"
    },
    {
      id: 2,
      name: "Trần Văn Hùng",
      role: "Kỹ sư IT",
      content: "Chương trình calisthenics ở đây rất chuyên nghiệp. Tôi đã tăng được 5kg cơ bắp chỉ trong 4 tháng.",
      rating: 5,
      image: "/images/testimonials/hung.jpg"
    },
    {
      id: 3,
      name: "Lê Thị Hồng",
      role: "Giáo viên",
      content: "Lớp yoga buổi sáng giúp tôi bắt đầu ngày mới với tinh thần thoải mái và tràn đầy năng lượng.",
      rating: 5,
      image: "/images/testimonials/hong.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Khách hàng nói gì về chúng tôi</h3>
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 text-yellow-400">⭐</div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
          <img 
            src={currentTestimonial.image} 
            alt={currentTestimonial.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/default-avatar.png';
            }}
          />
        </div>
        
        <p className="text-gray-700 italic mb-4">"{currentTestimonial.content}"</p>
        
        <div>
          <div className="font-semibold text-gray-900">{currentTestimonial.name}</div>
          <div className="text-sm text-gray-600">{currentTestimonial.role}</div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Floating CTA button
export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      setIsVisible(scrolled > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right">
      <Button
        asChild
        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
      >
        <a href="/dich-vu?utm_source=floating_cta" className="flex items-center gap-2">
          🔥 Đăng ký ngay
        </a>
      </Button>
    </div>
  );
}
