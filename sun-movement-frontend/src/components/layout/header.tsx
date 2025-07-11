"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll } from "@/lib/useScrollOptimized";
import { CartIcon } from "@/components/ui/cart-icon";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth-context";
import { Menu, X, ChevronDown, Phone, Instagram, Facebook, MapPin, User, LogOut, Settings, Package } from "lucide-react";
import { initUIEnhancements } from "@/lib/ui-enhancements";

// Import custom CSS
import "@/styles/enhanced-header.css";

const mainNavItems = [
  { label: "Trang Chủ", href: "/" },
  { label: "Giới Thiệu", href: "/gioi-thieu" },
  { 
    label: "Dịch Vụ", 
    href: "/dich-vu",
    // children: [
    //   { label: "Calisthenics", href: "/dich-vu/calisthenics" },
    //   { label: "Strength", href: "/dich-vu/strength" },
    //   { label: "Yoga", href: "/dich-vu/yoga" },
    // ]
  },
  { label: "Supplements", href: "/store/supplements" },
  { label: "Sportswear", href: "/store/sportswear" },
  { label: "Sự Kiện", href: "/su-kien" },
  { label: "FAQ", href: "/faq" },
];

// Auth Section Component
function AuthSection() {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">
              {user.firstName} {user.lastName}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-slate-800 border-slate-700 text-white"
        >
          <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-700" />
          
          <DropdownMenuItem className="text-white hover:bg-slate-700">
            <User className="mr-2 h-4 w-4" />
            <Link href="/profile">Thông tin cá nhân</Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="text-white hover:bg-slate-700">
            <Package className="mr-2 h-4 w-4" />
            <Link href="/orders" prefetch={false}>Theo dõi đơn hàng</Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="text-white hover:bg-slate-700">
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings">Cài đặt</Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-slate-700" />
          
          <DropdownMenuItem 
            className="text-red-400 hover:bg-slate-700 hover:text-red-300"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <AuthModal defaultMode="login">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10"
        >
          Đăng nhập
        </Button>
      </AuthModal>
      
      <AuthModal defaultMode="register">
        <Button 
          size="sm" 
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Đăng ký
        </Button>
      </AuthModal>
    </div>
  );
}

// Mobile Auth Section Component
function MobileAuthSection() {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-md">
          <User className="h-8 w-8 p-2 bg-red-600 rounded-full text-white" />
          <div className="flex-1">
            <div className="font-medium text-white">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-slate-400">{user.email}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-slate-600 text-white hover:bg-slate-700"
            asChild
          >
            <Link href="/profile">
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <AuthModal defaultMode="login">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-slate-600 text-white hover:bg-slate-700"
        >
          Đăng nhập
        </Button>
      </AuthModal>
      
      <AuthModal defaultMode="register">
        <Button 
          size="sm" 
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Đăng ký
        </Button>
      </AuthModal>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { scrolled } = useScroll({ threshold: 50 });
  
  // Initialize UI enhancements once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const { addButtonEffects, enhanceNavigation } = require("@/lib/ui-enhancements");
        addButtonEffects();
        enhanceNavigation();
      } catch (error) {
        console.warn('UI enhancements could not be loaded:', error);
      }
    }
  }, []); // Empty dependency array - only run once

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 backdrop-blur-md border-b will-change-transform main-header",
        scrolled
          ? "bg-slate-900/95 border-slate-800 py-2 shadow-xl shadow-slate-900/20 header-scrolled"
          : "bg-gradient-to-r from-slate-900 to-slate-800 border-slate-800/50 py-4"
      )}
    >
      {/* Top Bar - only visible when not scrolled */}
      {!scrolled && (
        <div className="hidden lg:block absolute top-0 left-0 w-full bg-red-500 text-white py-1 text-center text-xs font-medium top-bar">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+84 928 232 783</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>Hai Bà Trưng, Hà Nội</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Giờ mở cửa: 6:00 - 22:00, T2-CN</span>              <div className="flex items-center gap-2">
                <Link href="https://www.instagram.com/sun.movement/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
                  <Instagram className="h-3 w-3" />
                </Link>
                <Link href="https://www.facebook.com/SUNMovementVN" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
                  <Facebook className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={cn("container flex items-center justify-between", !scrolled && "mt-5 lg:mt-0")}>
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-9 w-36">
            <Image
              src="/images/logo-white.svg"
              alt="Sun Movement"
              fill
              sizes="(max-width: 768px) 144px, 144px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex gap-1">
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-red-500 hover:scale-105 hover:shadow-lg focus:bg-red-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white hover-lift header-nav-item",
                        pathname === item.href && "bg-red-500 shadow-lg"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <CartIcon className="text-white hover:text-red-300 transition-colors" />
          
          {/* Authentication */}
          <AuthSection />
          
          {/* Contact Button */}
          <Button
            size={scrolled ? "default" : "lg"}
            className={cn(
              "hidden md:flex btn-primary-enhanced text-white border-none transition-all duration-300 hover-lift btn-ripple",
              scrolled ? "h-9 px-4" : "h-10 px-6"
            )}
            asChild
          >
            <a 
              href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Liên Hệ</span>
              </span>
            </a>
          </Button>
          
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-slate-900 border-slate-800 text-white p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/images/logo-white.svg"
                      alt="Sun Movement"
                      width={120}
                      height={35}
                      priority
                    />
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                
                <div className="flex-1 overflow-auto py-4">
                  <nav className="flex flex-col space-y-1">
                    {mainNavItems.map((item) => (
                      <div key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block px-4 py-3 hover:bg-slate-800",
                            pathname === item.href 
                              ? "text-red-500 font-medium border-l-2 border-red-500 pl-3" 
                              : "text-white"
                          )}
                        >
                          {item.label}
                        </Link>
                      </div>
                    ))}
                  </nav>
                </div>
                  <div className="p-4 border-t border-slate-800">
                  {/* Mobile Authentication */}
                  <MobileAuthSection />
                  
                  <Button className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white btn-primary-enhanced hover-lift" asChild>
                    <a 
                      href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Liên Hệ Ngay
                    </a>
                  </Button>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="text-center p-3 bg-slate-800 rounded-md">
                      <div className="text-xs text-slate-400">Giờ mở cửa</div>
                      <div className="text-sm font-medium">6:00 - 22:00</div>
                    </div>
                    <div className="text-center p-3 bg-slate-800 rounded-md">
                      <div className="text-xs text-slate-400">Hotline</div>
                      <div className="text-sm font-medium">0928232783</div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
