"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dumbbell, Flame, Heart, Users, Zap, Award, Clock, Star, CheckCircle, Phone, MessageCircle } from "lucide-react";

// Messenger link
const MESSENGER_LINK = "https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0";

// Component for bouncing consultation button
const ConsultationButton = ({ children, className = "", variant = "default", intensity = "normal", ...props }: any) => {
  const handleClick = () => {
    window.open(MESSENGER_LINK, '_blank');
  };

  const getAnimationStyle = () => {
    switch (intensity) {
      case "strong":
        return {
          animation: 'heartbeat 1.8s ease-in-out infinite, bounce-heartbeat 2.5s ease-in-out infinite',
          animationDelay: '0.2s, 0.8s'
        };
      case "gentle":
        return {
          animation: 'heartbeat 3.5s ease-in-out infinite, bounce-heartbeat 4s ease-in-out infinite',
          animationDelay: '1s, 1.5s'
        };
      default:
        return {
          animation: 'heartbeat 2.5s ease-in-out infinite, bounce-heartbeat 3s ease-in-out infinite',
          animationDelay: '0.5s, 1s'
        };
    }
  };

  const heartbeatKeyframes = `
    @keyframes heartbeat {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
      }
      14% {
        transform: scale(1.1);
        box-shadow: 0 0 0 5px rgba(249, 115, 22, 0.5);
      }
      28% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(249, 115, 22, 0.3);
      }
      42% {
        transform: scale(1.1);
        box-shadow: 0 0 0 15px rgba(249, 115, 22, 0.1);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 20px rgba(249, 115, 22, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
      }
    }

    @keyframes bounce-heartbeat {
      0%, 100% {
        transform: translateY(0) scale(1);
      }
      10% {
        transform: translateY(-5px) scale(1.05);
      }
      20% {
        transform: translateY(0) scale(1);
      }
      30% {
        transform: translateY(-3px) scale(1.03);
      }
      40% {
        transform: translateY(0) scale(1);
      }
      50% {
        transform: translateY(-8px) scale(1.08);
      }
      60% {
        transform: translateY(0) scale(1);
      }
      70% {
        transform: translateY(-2px) scale(1.02);
      }
      80% {
        transform: translateY(0) scale(1);
      }
    }
  `;

  return (
    <>
      <style jsx>{heartbeatKeyframes}</style>
      <Button 
        {...props}
        onClick={handleClick}
        variant={variant}
        className={`relative overflow-hidden transition-all duration-300 ${className}`}
        style={getAnimationStyle()}
        onMouseEnter={(e) => {
          e.currentTarget.style.animation = 'none';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          const animStyle = getAnimationStyle();
          e.currentTarget.style.animation = animStyle.animation;
        }}
      >
        {children}
      </Button>
    </>
  );
};

// Component for floating consultation button with stronger heartbeat
const FloatingConsultationButton = ({ children, className = "", ...props }: any) => {
  const handleClick = () => {
    window.open(MESSENGER_LINK, '_blank');
  };

  const strongHeartbeatKeyframes = `
    @keyframes strong-heartbeat {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.8);
      }
      10% {
        transform: scale(1.15);
        box-shadow: 0 0 0 8px rgba(249, 115, 22, 0.6);
      }
      20% {
        transform: scale(1);
        box-shadow: 0 0 0 15px rgba(249, 115, 22, 0.4);
      }
      30% {
        transform: scale(1.12);
        box-shadow: 0 0 0 20px rgba(249, 115, 22, 0.2);
      }
      40% {
        transform: scale(1);
        box-shadow: 0 0 0 25px rgba(249, 115, 22, 0.1);
      }
      50% {
        transform: scale(1.2);
        box-shadow: 0 0 0 30px rgba(249, 115, 22, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
      }
    }

    @keyframes floating-bounce {
      0%, 100% {
        transform: translateY(0);
      }
      15% {
        transform: translateY(-8px);
      }
      30% {
        transform: translateY(0);
      }
      45% {
        transform: translateY(-5px);
      }
      60% {
        transform: translateY(0);
      }
      75% {
        transform: translateY(-12px);
      }
      90% {
        transform: translateY(0);
      }
    }

    @keyframes glow-pulse {
      0%, 100% {
        filter: brightness(1) drop-shadow(0 0 5px rgba(249, 115, 22, 0.5));
      }
      50% {
        filter: brightness(1.2) drop-shadow(0 0 20px rgba(249, 115, 22, 0.8));
      }
    }
  `;

  return (
    <>
      <style jsx>{strongHeartbeatKeyframes}</style>
      <Button 
        {...props}
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-2xl transition-all duration-300 ${className}`}
        style={{
          animation: 'strong-heartbeat 2s ease-in-out infinite, floating-bounce 4s ease-in-out infinite, glow-pulse 3s ease-in-out infinite',
          animationDelay: '0s, 1s, 0.5s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animation = 'none';
          e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)';
          e.currentTarget.style.filter = 'brightness(1.3) drop-shadow(0 0 25px rgba(249, 115, 22, 1))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animation = 'strong-heartbeat 2s ease-in-out infinite, floating-bounce 4s ease-in-out infinite, glow-pulse 3s ease-in-out infinite';
        }}
      >
        {children}
      </Button>
    </>
  );
};

const services = [
  {
    id: "calisthenics",
    title: "Calisthenics",
    description: "Phát triển sức mạnh, sự linh hoạt và thẩm mỹ cơ thể thông qua các bài tập với trọng lượng cơ thể.",
    image: "/images/dichvu/Calis-Thumb.webp",
    icon: Zap,
    benefits: ["Cải thiện sức mạnh cơ bản", "Tăng sự linh hoạt", "Kiểm soát cơ thể tốt hơn", "Phát triển cơ bắp hài hòa"],
    schedule: "Thứ 2, Thứ 4, Thứ 7",
    level: "Tất cả cấp độ",
    trainer: "Huấn luyện viên chuyên nghiệp",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: "strength",
    title: "Power / Strength Training",
    description: "Xây dựng sức mạnh tối đa và sức mạnh bùng nổ với các bài tập kháng lực chuyên sâu.",
    image: "/images/dichvu/Strength-Thumb.webp",
    icon: Dumbbell,
    benefits: ["Tăng sức mạnh tối đa", "Phát triển cơ bắp", "Cải thiện sức bền", "Tăng cường sức mạnh cốt lõi"],
    schedule: "Thứ 2, Thứ 3, Thứ 5, Thứ 6",
    level: "Từ cơ bản đến nâng cao",
    trainer: "Huấn luyện viên quốc tế",
    color: "from-red-600 to-amber-500",
  },
  {
    id: "yoga",
    title: "Modern Yoga",
    description: "Kết hợp yoga truyền thống với phương pháp hiện đại cho cả sức mạnh và sự cân bằng tinh thần.",
    image: "/images/dichvu/Yoga-Thumb.webp",
    icon: Heart,
    benefits: ["Cân bằng thể chất và tinh thần", "Tăng sự linh hoạt", "Giảm stress", "Cải thiện tư thế"],
    schedule: "Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Chủ nhật",
    level: "Mọi trình độ",
    trainer: "Giáo viên yoga chứng nhận",
    color: "from-purple-600 to-pink-500",
  },
  {
    id: "personal-training",
    title: "Huấn luyện cá nhân",
    description: "Chương trình huấn luyện được cá nhân hóa để đáp ứng mục tiêu cụ thể của bạn với sự hướng dẫn chuyên nghiệp.",
    image: "/images/dichvu/pt1.1.webp",
    icon: Users,
    benefits: ["Kế hoạch tập luyện cá nhân hóa", "Theo dõi tiến độ chặt chẽ", "Điều chỉnh linh hoạt", "Đạt mục tiêu nhanh chóng"],
    schedule: "Linh hoạt theo lịch của bạn",
    level: "Tùy chỉnh theo trình độ",
    trainer: "Huấn luyện viên cá nhân",
    color: "from-emerald-600 to-teal-500",
  },
];

const features = [
  {
    icon: Flame,
    title: "Động lực không ngừng",
    description: "Huấn luyện viên luôn đồng hành, thúc đẩy bạn vượt qua giới hạn bản thân mỗi ngày."
  },
  {
    icon: Users,
    title: "Cộng đồng đam mê",
    description: "Trở thành thành viên của cộng đồng những người có cùng đam mê rèn luyện và phát triển."
  },
  {
    icon: Award,
    title: "Huấn luyện viên chất lượng",
    description: "Đội ngũ huấn luyện viên giàu kinh nghiệm, được chứng nhận quốc tế với phương pháp hiện đại."
  },
  {
    icon: Clock,
    title: "Lịch tập linh hoạt",
    description: "Nhiều khung giờ tập luyện để phù hợp với lịch trình bận rộn của bạn."
  }
];

const testimonials = [
  {
    name: "Nguyễn Cao Trang",
    role: "Thành viên 1 năm",
    comment: "Sun Movement đã thay đổi hoàn toàn cách tôi nhìn nhận về tập luyện. Sau 6 tháng, tôi không chỉ khỏe mạnh hơn mà còn tự tin hơn rất nhiều.",
    avatar: "/images/testimonials/nv1.webp",
    rating: 5,
    achievement: "Giảm 15kg, tăng 20% sức mạnh"
  },
  {
    name: "Vũ Văn Hoàng",
    role: "Thành viên 2 năm",
    comment: "Các buổi tập Yoga tại đây thực sự khác biệt. Tôi cảm thấy cân bằng hơn cả về thể chất lẫn tinh thần, đặc biệt là sau những ngày làm việc căng thẳng.",
    avatar: "/images/testimonials/nv2.webp",
    rating: 5,
    achievement: "Cải thiện tư thế, giảm đau lưng"
  },
  {
    name: "Lê Văn Nghĩa",
    role: "Thành viên 6 tháng",
    comment: "Từ một người chưa từng tập luyện, các HLV tại Sun đã giúp tôi từng bước xây dựng được thói quen tập luyện khoa học và hiệu quả.",
    avatar: "/images/testimonials/nv3.webp",
    rating: 5,
    achievement: "Từ 0 pull-up lên 10 pull-up"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* CSS Styles */}
      <style jsx global>{`
        @keyframes gentleBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }

        .consultation-button:hover {
          animation: none !important;
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .floating-consultation:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        }
      `}</style>
      {/* Floating Consultation Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {/* Notification bubble */}
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg sm:block hidden"
          style={{
            animation: 'bounce 4s ease-in-out infinite',
            animationDelay: '3s',
            transform: 'translateX(-10px)'
          }}
        >
          💬 Tư vấn miễn phí!
        </div>
        
        <FloatingConsultationButton className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4">
          <MessageCircle className="h-6 w-6 mr-2" />
          <span className="hidden sm:inline">Tư vấn ngay</span>
        </FloatingConsultationButton>
      </div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/dichvu/Strength-Thumb.webp')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              CHƯƠNG TRÌNH HUẤN LUYỆN
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Đột phá giới hạn bản thân với các dịch vụ<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                huấn luyện chuyên nghiệp
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Từ người mới bắt đầu đến vận động viên chuyên nghiệp, chúng tôi cung cấp các chương trình 
              đào tạo chất lượng cao phù hợp với mọi mục tiêu và trình độ.
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConsultationButton 
                intensity="strong"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 h-auto rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Đăng ký tư vấn miễn phí
              </ConsultationButton>
              <Button variant="outline" className="border-slate-600 text-orange-500 hover:bg-slate-800 hover:text-white px-8 py-4 h-auto rounded-lg font-medium text-lg">
                <Phone className="mr-2 h-5 w-5" />
                Hotline: 08999139393
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Miễn phí buổi tập đầu tiên</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Huấn luyện viên chứng nhận quốc tế</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Cam kết hoàn tiền 100%</span>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Chương trình huấn luyện</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Tại Sun Movement, chúng tôi cung cấp nhiều chương trình huấn luyện đa dạng, 
            được thiết kế đặc biệt để đáp ứng mọi mục tiêu tập luyện của bạn.
          </p>
          
          {/* Urgency banner */}
          <div className="bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 rounded-lg p-4 mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-orange-400" />
              <span className="text-orange-400 font-medium">Chỉ còn 3 ngày!</span>
            </div>
            <p className="text-slate-300 text-sm mt-1">Ưu đãi 40% cho 100 thành viên đầu tiên đăng ký trong tháng này</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={service.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 relative">
              {/* Popular badge for first service */}
              {index === 0 && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-white text-xs font-bold">
                    PHỔ BIẾN NHẤT
                  </div>
                </div>
              )}
              
              <div className="relative h-52 w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 z-10`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 z-0"
                />
                <div className="absolute top-4 right-4 z-20">
                  <div className={`p-2 rounded-full bg-gradient-to-br ${service.color}`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-6 pb-3">
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">{service.title}</h2>
                <p className="text-slate-300 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm uppercase text-slate-400 mb-2">Lợi ích chính</h4>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-slate-300">
                        <span className="mr-2 text-red-500">•</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-red-500" />
                    <span>{service.schedule}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-red-500" />
                    <span>{service.level}</span>
                  </div>
                </div>
                
                {/* Pricing section */}
                <div className="bg-slate-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-xs line-through">2.500.000đ/tháng</div>
                      <div className="text-white font-bold">1.500.000đ/tháng</div>
                    </div>
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      -40%
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">* Ưu đãi cho thành viên mới</div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 pt-2">
                <AuthModal defaultMode="register">
                  <Button className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white font-medium shadow-lg hover:shadow-xl transition-all`}>
                    <Star className="mr-2 h-4 w-4" />
                    Đăng ký ngay - Tiết kiệm 40%
                  </Button>
                </AuthModal>
                
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Features */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tại sao chọn Sun Movement</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm tập luyện tốt nhất với các tiêu chuẩn cao nhất về chất lượng và sự chuyên nghiệp.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10"
              >
                <div className="bg-gradient-to-br from-red-600 to-amber-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Học viên nói gì về chúng tôi</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Hãy nghe những chia sẻ từ các thành viên đã và đang trải nghiệm hành trình tập luyện tại Sun Movement.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative hover:border-red-500/30 transition-all"
            >
              <div className="absolute -top-4 left-6">
                <div className="text-4xl text-red-500">&ldquo;</div>
              </div>
              
              {/* Rating stars */}
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-slate-300 mb-4 mt-3">{testimonial.comment}</p>
              
              {/* Achievement badge */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 mb-4">
                <p className="text-green-400 text-sm font-medium">Kết quả đạt được:</p>
                <p className="text-green-300 text-sm">{testimonial.achievement}</p>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden relative">
                    {/* Replace with actual avatar image if available */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-red-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Social proof counter */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-slate-800 rounded-full px-6 py-3 border border-slate-700">
            <Users className="h-5 w-5 text-green-400" />
            <span className="text-white font-medium">Đã có hơn 500+ thành viên tin tưởng Sun Movement</span>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">So sánh các loại hình tập luyện</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Tìm hiểu sự khác biệt giữa các chương trình huấn luyện của chúng tôi để lựa chọn phương pháp phù hợp nhất với mục tiêu của bạn.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-xl overflow-hidden border border-slate-700">
            <thead>
              <tr className="bg-slate-800">
                <th className="p-4 text-left text-white font-medium"></th>
                <th className="p-4 text-center text-white font-medium">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-blue-400">Calisthenics</span>
                  </div>
                </th>
                <th className="p-4 text-center text-white font-medium">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-red-600 to-amber-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-red-400">Strength Training</span>
                  </div>
                </th>
                <th className="p-4 text-center text-white font-medium">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-purple-400">Modern Yoga</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              <tr className="bg-slate-900">
                <td className="p-4 text-white font-medium">Trang thiết bị</td>
                <td className="p-4 text-center text-slate-300">Tối thiểu: thanh xà, ghế đẩy, thảm</td>
                <td className="p-4 text-center text-slate-300">Tạ tự do, máy tập, thiết bị chuyên dụng</td>
                <td className="p-4 text-center text-slate-300">Thảm yoga, khối gỗ, dây đai, gối</td>
              </tr>
              <tr className="bg-slate-800">
                <td className="p-4 text-white font-medium">Hình thức tập luyện</td>
                <td className="p-4 text-center text-slate-300">Sử dụng trọng lượng cơ thể</td>
                <td className="p-4 text-center text-slate-300">Tập luyện với tạ và thiết bị kháng lực</td>
                <td className="p-4 text-center text-slate-300">Tư thế kết hợp với hơi thở và thiền</td>
              </tr>
              <tr className="bg-slate-900">
                <td className="p-4 text-white font-medium">Mục tiêu chính</td>
                <td className="p-4 text-center text-slate-300">Sức mạnh tương đối, kiểm soát cơ thể, kỹ năng</td>
                <td className="p-4 text-center text-slate-300">Sức mạnh tối đa, tăng khối lượng cơ, sức mạnh bùng nổ</td>
                <td className="p-4 text-center text-slate-300">Cân bằng thân-tâm, linh hoạt, sức khỏe tinh thần</td>
              </tr>
              <tr className="bg-slate-800">
                <td className="p-4 text-white font-medium">Phù hợp với</td>
                <td className="p-4 text-center text-slate-300">Người muốn phát triển kỹ năng, thể hình cân đối</td>
                <td className="p-4 text-center text-slate-300">Người muốn tăng sức mạnh, khối lượng cơ và hiệu suất</td>
                <td className="p-4 text-center text-slate-300">Người cần cân bằng, linh hoạt và giảm căng thẳng</td>
              </tr>
              <tr className="bg-slate-900">
                <td className="p-4 text-white font-medium">Cường độ</td>
                <td className="p-4 text-center text-slate-300">Trung bình đến cao</td>
                <td className="p-4 text-center text-slate-300">Cao</td>
                <td className="p-4 text-center text-slate-300">Thấp đến trung bình</td>
              </tr>
              <tr className="bg-slate-800">
                <td className="p-4 text-white font-medium">Lợi ích đặc biệt</td>
                <td className="p-4 text-center text-slate-300">Có thể tập mọi lúc mọi nơi, cải thiện kiểm soát cơ thể</td>
                <td className="p-4 text-center text-slate-300">Tăng trưởng cơ nhanh, cải thiện trao đổi chất</td>
                <td className="p-4 text-center text-slate-300">Giảm stress, cải thiện tư thế và hơi thở</td>
              </tr>
            </tbody>
          </table>
        </div>
          <div className="mt-8 text-center">
          <p className="text-slate-300 mb-6">
            Vẫn chưa chắc chắn loại hình tập luyện nào phù hợp với bạn? Hãy để chúng tôi tư vấn!
          </p>
          
          <ConsultationButton 
            intensity="strong"
            className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white px-6 py-3 h-auto rounded-lg font-medium"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Đăng ký tư vấn miễn phí
          </ConsultationButton>
        </div>
      </div>

      {/* Schedule */}
      <div className="container py-16">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Lịch tập luyện</h2>
          <p className="text-slate-300 mb-8">
            Sun Movement cung cấp lịch tập linh hoạt phù hợp với thời gian của bạn.
            Các buổi tập được thiết kế để phát triển toàn diện cả về sức mạnh, sự linh hoạt và khả năng phối hợp.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-3 text-left text-white font-medium">Thời gian</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 2</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 3</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 4</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 5</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 6</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 7</th>
                  <th className="p-3 text-left text-white font-medium">Chủ nhật</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700/50">
                  <td className="p-3 font-medium text-white">8:00 - 9:30</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-red-500/10">Strength</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-slate-500/10">-</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="p-3 font-medium text-white">17:30 - 19:00</td>
                  <td className="p-3 text-slate-300 bg-red-500/10">Strength</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-red-500/10">Strength</td>
                  <td className="p-3 text-slate-300 bg-slate-500/10">-</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">19:30 - 21:00</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-red-500/10">Strength</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-slate-500/10">-</td>
                  <td className="p-3 text-slate-300 bg-slate-500/10">-</td>
                </tr>
              </tbody>
            </table>
          </div>          <div className="flex justify-center mt-8">
            <ConsultationButton 
              intensity="strong"
              className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white px-6 py-6 h-auto rounded-lg text-lg font-medium"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Đăng ký buổi tập miễn phí
            </ConsultationButton>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600/20 to-amber-500/20 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 mb-4 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              ⚡ ƯU ĐÃI CÓ HẠN - CHỈ CÒN 3 NGÀY
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu hành trình của bạn?
            </h2>
            <p className="text-xl text-slate-300 mb-4">
              Trở thành phiên bản tốt nhất của chính mình cùng Sun Movement ngay hôm nay.
            </p>
            <p className="text-orange-400 font-medium mb-8">
              🎯 Tiết kiệm đến 40% chi phí - Chỉ dành cho 100 thành viên đầu tiên!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <AuthModal defaultMode="register">
                <Button className="bg-white text-red-600 hover:bg-red-100 px-8 py-4 h-auto rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all">
                  <Star className="mr-2 h-5 w-5" />
                  Đăng ký ngay - Tiết kiệm 1.000.000đ
                </Button>
              </AuthModal>
              
            </div>
            
            {/* Final trust indicators */}
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
    </div>
  );
}
