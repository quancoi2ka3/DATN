"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, ArrowRight, CheckCircle } from "lucide-react";

export function ContactCTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Submitted email:", email);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950"></div>
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,#ff3e00,transparent)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_500px_at_80%_80%,#ff3e00,transparent)]"></div>
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* CTA Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Bắt Đầu Hành Trình Của Bạn Ngay Hôm Nay
            </h2>
            
            <div className="w-20 h-1 bg-red-500 mb-8"></div>
            
            <p className="text-slate-300 mb-8">
              Trở thành phiên bản tốt nhất của chính mình với các chương trình huấn luyện 
              được cá nhân hóa và đội ngũ huấn luyện viên chuyên nghiệp tại Sun Movement.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4 mt-1">
                  <MapPin className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Địa Chỉ</h3>
                  <p className="text-slate-300">Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4 mt-1">
                  <Phone className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Hotline</h3>
                  <p className="text-slate-300">08999139393</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4 mt-1">
                  <Mail className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <p className="text-slate-300">contact@sunmovement.vn</p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-none" asChild>
              <a 
                href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="flex items-center gap-2">
                  Liên Hệ Ngay
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </Button>
          </div>
          
          {/* Newsletter Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">
              Đăng Ký Nhận Tin
            </h3>
            
            <p className="text-slate-300 mb-6">
              Nhận thông tin về các chương trình khuyến mãi, sự kiện và bài viết mới nhất từ Sun Movement.
            </p>
            
            {submitted ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-green-400 font-semibold mb-2">Đăng ký thành công!</h4>
                <p className="text-green-300 text-sm">Cảm ơn bạn đã đăng ký. Chúng tôi sẽ gửi thông tin mới nhất đến email của bạn.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  />
                </div>
                
                <LoadingButton 
                  type="submit" 
                  isLoading={isLoading}
                  loadingText="Đang đăng ký..."
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-none transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Đăng Ký
                  </span>
                </LoadingButton>
                
                <p className="text-xs text-slate-400 mt-4">
                  Bằng cách đăng ký, bạn đồng ý với <Link href="/privacy-policy" className="text-red-400 hover:underline">Chính sách bảo mật</Link> của chúng tôi.
                </p>
              </form>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h4 className="text-white font-medium mb-4">Theo dõi chúng tôi</h4>
              <div className="flex gap-4">                <a 
                  href="https://www.facebook.com/SUNMovementVN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a 
                  href="https://www.instagram.com/sun.movement/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>                <a 
                  href="https://www.youtube.com/@SUNMovementVN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}