"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Suspense } from "react";
import dynamic from 'next/dynamic';

// Lazy load heavy sections
const FeaturesSection = dynamic(() => 
  import('@/components/sections/about-features').then(mod => ({ default: mod.FeaturesSection })),
  { 
    loading: () => <div className="h-[400px] bg-slate-800/50 animate-pulse rounded-lg mx-auto max-w-6xl"></div>,
    ssr: false
  }
);

const StatsSection = dynamic(() => 
  import('@/components/sections/about-stats').then(mod => ({ default: mod.StatsSection })),
  { 
    loading: () => <div className="h-[300px] bg-slate-800/50 animate-pulse rounded-lg mx-auto max-w-6xl"></div>,
    ssr: false
  }
);

const TeamSection = dynamic(() => 
  import('@/components/sections/about-team').then(mod => ({ default: mod.TeamSection })),
  { 
    loading: () => <div className="h-[500px] bg-slate-800/50 animate-pulse rounded-lg mx-auto max-w-6xl"></div>,
    ssr: false
  }
);

const FacilitiesSection = dynamic(() => 
  import('@/components/sections/about-facilities').then(mod => ({ default: mod.FacilitiesSection })),
  { 
    loading: () => <div className="h-[600px] bg-slate-800/50 animate-pulse rounded-lg mx-auto max-w-6xl"></div>,
    ssr: false
  }
);

const GoogleMapSection = dynamic(() => 
  import('@/components/ui/google-map').then(mod => ({ default: mod.GoogleMap })),
  { 
    loading: () => <div className="h-[400px] bg-slate-700 animate-pulse rounded-lg"></div>,
    ssr: false
  }
);

export default function AboutPageLazy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Hero Section - Critical, load immediately */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <Image 
          src="/images/gioithieu/aboutus.webp" 
          alt="Sun Movement - About Us" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 container flex flex-col justify-center items-start">
          <Breadcrumbs 
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giới thiệu", href: "/gioi-thieu" }
            ]} 
            className="mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Về Chúng Tôi</h1>
          <div className="w-24 h-1 bg-red-500 mb-6"></div>
          <p className="text-xl text-slate-200 max-w-2xl">
            Khám phá hành trình 7 năm xây dựng cộng đồng fitness hàng đầu Việt Nam
          </p>
        </div>
      </div>

      {/* Mission Section - Critical, keep immediate */}
      <section className="py-16 bg-slate-900">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              Tại đây, chúng tôi không chỉ giúp bạn tập luyện thể chất mà còn đồng hành cùng bạn trong hành trình 
              phát triển toàn diện - <strong className="text-white">từ cơ thể đến tinh thần, từ sức mạnh đến sự linh hoạt</strong>.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <a 
                  href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Liên Hệ Ngay
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 transition-all duration-300" asChild>
                <Link href="/dich-vu">
                  Khám Phá Dịch Vụ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Lazy loaded */}
      <section className="py-16 bg-slate-950">
        <div className="container">
          <Suspense fallback={<div className="h-[400px] bg-slate-800/50 animate-pulse rounded-lg"></div>}>
            <FeaturesSection />
          </Suspense>
        </div>
      </section>

      {/* Stats Section - Lazy loaded */}
      <section className="py-16 bg-slate-900">
        <div className="container">
          <Suspense fallback={<div className="h-[300px] bg-slate-800/50 animate-pulse rounded-lg"></div>}>
            <StatsSection />
          </Suspense>
        </div>
      </section>

      {/* Team Section - Lazy loaded */}
      <section className="py-16 bg-slate-950">
        <div className="container">
          <Suspense fallback={<div className="h-[500px] bg-slate-800/50 animate-pulse rounded-lg"></div>}>
            <TeamSection />
          </Suspense>
        </div>
      </section>

      {/* Facilities Section - Lazy loaded */}
      <section className="py-16 bg-slate-900">
        <div className="container">
          <Suspense fallback={<div className="h-[600px] bg-slate-800/50 animate-pulse rounded-lg"></div>}>
            <FacilitiesSection />
          </Suspense>
        </div>
      </section>

      {/* Contact & Map Section - Lazy loaded */}
      <section className="py-16 bg-slate-950">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ghé Thăm Chúng Tôi
            </h2>
            <p className="text-slate-300 text-lg">
              Hãy đến trực tiếp để trải nghiệm không gian tập luyện chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Địa Chỉ
                </h3>
                <p className="text-slate-300">
                  Số 8 Tôn Thất Thuyết, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-500" />
                  Liên Hệ
                </h3>
                <p className="text-slate-300">
                  Hotline: <a href="tel:0123456789" className="text-red-400 hover:text-red-300">0123 456 789</a>
                </p>
                <p className="text-slate-300">
                  Email: <a href="mailto:info@sunmovement.vn" className="text-red-400 hover:text-red-300">info@sunmovement.vn</a>
                </p>
              </div>

              <Button size="lg" className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white" asChild>
                <Link href="/lien-he">
                  Đặt Lịch Tư Vấn
                </Link>
              </Button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-700">
              <Suspense fallback={<div className="h-[400px] bg-slate-700 animate-pulse"></div>}>
                <GoogleMapSection />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
