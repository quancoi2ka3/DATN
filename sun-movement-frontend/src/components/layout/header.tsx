"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { Menu, X, ChevronDown, Phone, Instagram, Facebook, MapPin, User, LogOut, Settings } from "lucide-react";

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
  { 
    label: "Shop", 
    href: "#",
    children: [
      { label: "Supplements", href: "/store/supplements" },
      { label: "Sportswear", href: "/store/sportswear" },
    ]
  },
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
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md border-b",
        scrolled
          ? "bg-slate-900/95 border-slate-800 py-2 shadow-lg"
          : "bg-gradient-to-r from-slate-900 to-slate-800 border-slate-800/50 py-4"
      )}
    >
      {/* Top Bar - only visible when not scrolled */}
      {!scrolled && (
        <div className="hidden lg:block absolute top-0 left-0 w-full bg-red-500 text-white py-1 text-center text-xs font-medium">
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
              <span>Giờ mở cửa: 6:00 - 22:00, T2-CN</span>
              <div className="flex items-center gap-2">
                <Link href="https://instagram.com" className="hover:text-slate-200 transition-colors">
                  <Instagram className="h-3 w-3" />
                </Link>
                <Link href="https://facebook.com" className="hover:text-slate-200 transition-colors">
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
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex gap-1">
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                {item.children ? (
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={cn(
                        "group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-red-500 focus:bg-red-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white",
                        openDropdown === item.label && "bg-red-500",
                        pathname.startsWith(item.href) && "bg-red-500/20"
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn(
                        "ml-1 h-3 w-3 transition-transform duration-200",
                        openDropdown === item.label && "transform rotate-180"
                      )} />
                    </button>
                    
                    {openDropdown === item.label && (
                      <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-700">
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-white hover:bg-red-500"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-red-500 focus:bg-red-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-white",
                        pathname === item.href && "bg-red-500"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                )}
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
              "hidden md:flex bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-none transition-all duration-300",
              scrolled ? "h-9 px-4" : "h-10 px-6"
            )}
            asChild
          >
            <Link href="/lien-he">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Liên Hệ</span>
              </span>
            </Link>
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
                        {item.children ? (
                          <>
                            <button
                              onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                              className="flex items-center justify-between px-4 py-3 text-white hover:bg-slate-800 w-full text-left"
                            >
                              <span>{item.label}</span>
                              <ChevronDown className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                openDropdown === item.label && "transform rotate-180"
                              )} />
                            </button>
                            
                            {openDropdown === item.label && (
                              <div className="pl-4 border-l-2 border-red-500 ml-4 my-2 space-y-1">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
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
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
                  <div className="p-4 border-t border-slate-800">
                  {/* Mobile Authentication */}
                  <MobileAuthSection />
                  
                  <Button className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white" asChild>
                    <Link href="/lien-he">
                      <Phone className="mr-2 h-4 w-4" />
                      Liên Hệ Ngay
                    </Link>
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
