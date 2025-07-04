"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock, ChevronRight, ArrowRight, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState(2025); // Default fallback year
  
  useEffect(() => {
    // Update the year on the client side
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-red-500 blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full bg-amber-500 blur-[150px]"></div>
      </div>
      
      
      
      {/* Main footer content */}
      <div className="container py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - About & Contact */}
          <div className="space-y-6">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/full-logo.svg"
                alt="Sun Movement"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            
            <p className="text-slate-300">
              SUN MOVEMENT là trung tâm thể hình chuyên nghiệp, đem đến trải nghiệm tập luyện hiện đại và hiệu quả nhất cho các tín đồ thể hình và thể thao.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                {typeof window !== 'undefined' && (
                  <a href="tel:08999139393" className="text-slate-300 hover:text-white transition-colors">
                    08999139393
                  </a>
                )}
                {typeof window === 'undefined' && (
                  <span className="text-slate-300">08999139393</span>
                )}
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <a href="mailto:contact@sunmovement.vn" className="text-slate-300 hover:text-white transition-colors">
                  contact@sunmovement.vn
                </a>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <span className="text-slate-300">6:00 - 22:00, T2-CN</span>
              </li>
            </ul>
            
            <div className="flex items-center gap-3 pt-2">              <a
                href="https://www.facebook.com/SUNMovementVN"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-red-500 transition-colors"
              >
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/sun.movement/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-red-500 transition-colors"
              >
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://www.youtube.com/@SUNMovementVN"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-red-500 transition-colors"
              >
                <Youtube size={18} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Column 2 - Links */}
          <div>
            <h3 className="text-lg text-red-500 font-bold mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500 pb-3">
              Dịch Vụ
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/dich-vu" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-red-500 transform group-hover:translate-x-1 transition-transform" />
                  <span>Calisthenics</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dich-vu" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-red-500 transform group-hover:translate-x-1 transition-transform" />
                  <span>Strength Training</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dich-vu" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-red-500 transform group-hover:translate-x-1 transition-transform" />
                  <span>Modern Yoga</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dich-vu" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-red-500 transform group-hover:translate-x-1 transition-transform" />
                  <span>Lớp tập nhóm</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dich-vu" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-red-500 transform group-hover:translate-x-1 transition-transform" />
                  <span>Huấn luyện cá nhân</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Shop */}
          <div>
            <h3 className="text-lg text-red-500 font-bold mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500 pb-3">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/sportswear" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-red-500 transform group-hover:translate-x-1 transition-transform" />
                  <span>Quần áo thể thao</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/store/supplements" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-red-500 transform group-hover:translate-x-1 transition-transform" />
                  <span>Thực phẩm bổ sung</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/store/policy" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-red-500 transform group-hover:translate-x-1 transition-transform" />
                  <span>Chính sách mua hàng</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Gallery */}
          <div>
            <h3 className="text-lg text-red-500 font-bold mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500 pb-3">
              Hình ảnh
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {/* Gallery với hình ảnh thực tế */}
              <Link 
                href="/images/home-slide-1.webp"
                className="block relative aspect-square rounded-md overflow-hidden group"
              >
                <Image
                  src="/images/home-slide-1.webp"
                  alt="Sun Movement - Không gian tập luyện"
                  fill
                  sizes="(max-width: 640px) 50vw, 120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
              
              <Link 
                href="/images/gioithieu/khuvucstrength.webp"
                className="block relative aspect-square rounded-md overflow-hidden group"
              >
                <Image
                  src="/images/gioithieu/khuvucstrength.webp"
                  alt="Sun Movement - Khu vực Strength Training"
                  fill
                  sizes="(max-width: 640px) 50vw, 120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
              
              <Link 
                href="/images/gioithieu/khuvucyoga.webp"
                className="block relative aspect-square rounded-md overflow-hidden group"
              >
                <Image
                  src="/images/gioithieu/khuvucyoga.webp"
                  alt="Sun Movement - Khu vực Yoga"
                  fill
                  sizes="(max-width: 640px) 50vw, 120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
              
              <Link 
                href="/images/gioithieu/khuvuccalis.webp"
                className="block relative aspect-square rounded-md overflow-hidden group"
              >
                <Image
                  src="/images/gioithieu/khuvuccalis.webp"
                  alt="Sun Movement - Khu vực Calisthenics"
                  fill
                  sizes="(max-width: 640px) 50vw, 120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
              
              <Link 
                href="/images/Event_handstand.webp"
                className="block relative aspect-square rounded-md overflow-hidden group"
              >
                <Image
                  src="/images/Event_handstand.webp"
                  alt="Sun Movement - Event Handstand"
                  fill
                  sizes="(max-width: 640px) 50vw, 120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
              
              <Link 
                href="/images/home-slide-3.webp"
                className="block relative aspect-square rounded-md overflow-hidden group"
              >
                <Image
                  src="/images/home-slide-3.webp"
                  alt="Sun Movement - Không gian hiện đại"
                  fill
                  sizes="(max-width: 640px) 50vw, 120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </div>
            <Link 
              href="https://www.instagram.com/sun.movement/" 
              className="inline-flex items-center mt-4 text-red-400 hover:text-red-300 transition-colors"
            >
              <span>Xem thêm hình ảnh</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        
        {/* Bottom footer / copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-slate-400 text-sm text-center md:text-left">
              &copy; {year} Sun Movement. Tất cả các quyền được bảo lưu.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <Link href="/terms" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
      
      {/* Motivational quote */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-4 relative">
        <div className="container">
          <p className="text-white text-center font-medium">
            "Vận động kiến tạo cuộc sống tốt đẹp hơn — SUN MOVEMENT"
          </p>
        </div>
      </div>
    </footer>
  );
}
