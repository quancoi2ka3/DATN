"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { ChevronDown, ShoppingCart, Heart, Share2, Star, Plus, Minus, ArrowRight, Filter, Flame, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCart } from "@/lib/cart-context";
// Category options for filter
const categories = [
  { value: "all", label: "Tất cả" },
  { value: "tops", label: "Áo" },
  { value: "bottoms", label: "Quần" },
  { value: "outerwear", label: "Áo khoác" },
  { value: "accessories", label: "Phụ kiện" },
];

// Sort options
const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
  { value: "name-desc", label: "Tên: Z-A" },
];

// Pre-generated flame positions to avoid hydration mismatch
const FLAME_POSITIONS = [
  { left: 25.01, width: 10.19, height: 73.09, opacity: 0.71, duration: 1.76, delay: 1.88 },
  { left: 40.00, width: 13.18, height: 54.11, opacity: 0.55, duration: 2.95, delay: 1.98 },
  { left: 43.71, width: 24.12, height: 68.49, opacity: 0.59, duration: 3.20, delay: 0.99 },
  { left: 60.39, width: 10.78, height: 59.62, opacity: 0.56, duration: 3.30, delay: 1.47 },
  { left: 15.25, width: 22.91, height: 53.10, opacity: 0.97, duration: 1.98, delay: 0.98 },
  { left: 53.07, width: 25.48, height: 27.38, opacity: 0.83, duration: 3.97, delay: 0.83 },
  { left: 34.33, width: 25.50, height: 41.78, opacity: 0.91, duration: 3.25, delay: 1.53 },
  { left: 66.55, width: 34.07, height: 27.97, opacity: 0.89, duration: 3.34, delay: 1.27 },
  { left: 3.49, width: 39.72, height: 36.75, opacity: 0.54, duration: 1.48, delay: 1.85 },
  { left: 32.28, width: 32.76, height: 21.13, opacity: 0.88, duration: 3.40, delay: 1.30 }
];

// Enhanced SportwearProductCard component with fire and energy effects
interface SportswearProductCardProps {
  product: Product & {
    details?: string;
    colors?: string[];
    sizes?: string[];
  };
}

// Pre-generated flame positions for product cards
const PRODUCT_FLAME_POSITIONS = [
  { left: 15.2, width: 8.5, height: 45.3, opacity: 0.85, duration: 1.25 },
  { left: 35.7, width: 12.3, height: 52.8, opacity: 0.92, duration: 1.75 },
  { left: 55.4, width: 9.8, height: 38.9, opacity: 0.78, duration: 1.42 },
  { left: 75.1, width: 14.2, height: 48.7, opacity: 0.88, duration: 1.68 },
  { left: 25.9, width: 10.7, height: 41.5, opacity: 0.83, duration: 1.34 },
  { left: 45.6, width: 13.8, height: 55.2, opacity: 0.95, duration: 1.89 },
  { left: 65.3, width: 11.4, height: 43.1, opacity: 0.81, duration: 1.56 },
  { left: 85.0, width: 9.2, height: 39.8, opacity: 0.76, duration: 1.23 },
  { left: 5.8, width: 15.1, height: 49.6, opacity: 0.89, duration: 1.72 },
  { left: 95.2, width: 8.9, height: 37.4, opacity: 0.74, duration: 1.18 }
];

const SportswearProductCard = ({ product }: SportswearProductCardProps) => {  const { addToCart, isLoading } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [showFireEffect, setShowFireEffect] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add fire effect when hovering
    if (isHovering) {
      const timer = setTimeout(() => {
        setShowFireEffect(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowFireEffect(false);
    }
  }, [isHovering]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product, quantity, selectedSize, selectedColor);
      
      // Create an energetic pulse effect when adding to cart
      if (cardRef.current) {
        cardRef.current.classList.add('energy-burst');
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.classList.remove('energy-burst');
          }
        }, 700);
      }
      
      // Show success message
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAdding(false);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div 
      ref={cardRef}
      className="fitness-card bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden shadow-xl border-l-4 border-l-red-500 transform transition-all hover:scale-[1.01] streak-container"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="relative h-80 w-full rounded-md overflow-hidden mb-4 group">
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-${isHovering ? '70' : '40'} transition-opacity`}></div>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-cover transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
              />
              
              {/* Fire effect on image hover */}
              {showFireEffect && (
                <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden pointer-events-none z-20">
                  {PRODUCT_FLAME_POSITIONS.map((flame, i) => (
                    <div 
                      key={i}
                      className="absolute bottom-0 rounded-full bg-gradient-to-t from-orange-500 to-red-500 flame-effect"
                      style={{
                        left: `${flame.left}%`,
                        width: `${flame.width}px`,
                        height: `${flame.height}px`,
                        opacity: flame.opacity,
                        animationDuration: `${flame.duration}s`,
                        filter: 'blur(3px)',
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="absolute top-2 right-2 z-20 flex gap-2">
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors radial-menu-item">
                  <Heart className="h-5 w-5 text-white" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors radial-menu-item">
                  <Share2 className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 z-20">
                <div className="flex items-center fire-gradient pulse-glow px-3 py-1 rounded-full text-sm font-bold">
                  <Star className="h-4 w-4 mr-1 fill-white" />
                  4.8/5
                </div>
              </div>
            </div>
            
            {/* Image gallery */}
            {product.colors && product.colors.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-gray-700 cursor-pointer hover:border-red-500 hover-lift">
                    <Image
                      src={product.imageUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 100px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="fire-gradient text-white p-3 rounded-t-lg flex justify-between items-center">
              <h3 className="text-2xl font-bold tracking-tight">{product.name}</h3>
              <div className="text-lg font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm pulse-glow">
                #{product.category}
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-b-lg">
              <div className="mb-4">
                <h4 className="font-semibold text-red-400 mb-1 flex items-center">
                  <span className="inline-block w-1 h-5 bg-red-500 mr-2 pulse-glow"></span>
                  Chất liệu:
                </h4>
                <p className="text-white text-opacity-90">{product.description}</p>
              </div>
              
              {product.details && (
                <div className="mb-6 bg-slate-700/50 p-3 rounded-lg border-l-2 border-red-500 streak-container">
                  <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                    <span className="inline-block w-1 h-5 bg-red-500 mr-2"></span>
                    Đặc điểm:
                  </h4>
                  <div className="whitespace-pre-line text-white text-opacity-80 text-sm">
                    {product.details}
                  </div>
                  <div className="streak-effect"></div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {product.colors && (
                  <div>
                    <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                      <span className="inline-block w-1 h-5 bg-red-500 mr-2"></span>
                      Màu sắc:
                    </h4>
                    <div className="flex gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full border-2 transition-all transform ${
                            selectedColor === color 
                              ? 'border-red-500 scale-110 pulse-glow' 
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                          style={{ 
                            backgroundColor: color === 'white' ? '#ffffff' : 
                                            color === 'black' ? '#000000' : 
                                            color === 'gray' ? '#6b7280' :
                                            color === 'navy' ? '#0c4a6e' : color 
                          }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Màu ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {product.sizes && (
                  <div>
                    <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                      <span className="inline-block w-1 h-5 bg-red-500 mr-2"></span>
                      Kích cỡ:
                    </h4>
                    <div className="flex gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          className={`h-10 w-10 flex items-center justify-center border-2 rounded-lg transition-all hover-lift ${
                            selectedSize === size
                              ? 'bg-red-500 text-white border-red-500 pulse-glow'
                              : 'border-gray-600 text-white hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-700 pt-4">
                <div className="flex items-center gap-x-4">
                  <div className="text-2xl font-bold text-white fire-text">
                    {product.price.toLocaleString()} <span className="text-red-400 text-sm">VNĐ</span>
                  </div>
                  
                  <div className="flex items-center h-10 border border-slate-600 rounded-lg overflow-hidden">
                    <button 
                      className="w-10 h-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                      onClick={decreaseQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-10 h-full flex items-center justify-center bg-slate-700 text-white">
                      {quantity}
                    </div>
                    <button 
                      className="w-10 h-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                      onClick={increaseQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <Button 
                  className="fire-button burning-button bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-2 h-12 rounded-lg shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
                  onClick={handleAddToCart}
                >
                  <span className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Thêm vào giỏ hàng</span>
                  </span>
                  <span className="streak-effect"></span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="streak-effect"></div>
    </div>
  );
};

interface SportswearSectionProps {
  products: Product[];
}

export function SportswearSection({ products }: SportswearSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products || []);
  const [sortBy, setSortBy] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  // Pre-generated particles to avoid hydration mismatch
  const [backgroundParticles] = useState(() => [
    { id: 0, style: { left: '25.01%', width: '25px', height: '45px', opacity: 0.8, animationDuration: '2.5s', animationDelay: '0.2s' } },
    { id: 1, style: { left: '45.33%', width: '18px', height: '38px', opacity: 0.7, animationDuration: '3.2s', animationDelay: '0.8s' } },
    { id: 2, style: { left: '65.78%', width: '32px', height: '52px', opacity: 0.9, animationDuration: '1.8s', animationDelay: '1.5s' } },
    { id: 3, style: { left: '15.42%', width: '22px', height: '41px', opacity: 0.6, animationDuration: '2.9s', animationDelay: '0.5s' } },
    { id: 4, style: { left: '85.67%', width: '28px', height: '48px', opacity: 0.8, animationDuration: '2.1s', animationDelay: '1.2s' } },
    { id: 5, style: { left: '35.89%', width: '20px', height: '36px', opacity: 0.7, animationDuration: '3.5s', animationDelay: '0.3s' } },
    { id: 6, style: { left: '55.12%', width: '26px', height: '44px', opacity: 0.9, animationDuration: '2.3s', animationDelay: '1.8s' } },
    { id: 7, style: { left: '75.45%', width: '24px', height: '39px', opacity: 0.8, animationDuration: '2.7s', animationDelay: '0.7s' } },
    { id: 8, style: { left: '5.23%', width: '30px', height: '50px', opacity: 0.6, animationDuration: '1.9s', animationDelay: '1.1s' } },
    { id: 9, style: { left: '95.78%', width: '19px', height: '42px', opacity: 0.7, animationDuration: '3.1s', animationDelay: '0.4s' } },
    { id: 10, style: { left: '12.34%', width: '27px', height: '46px', opacity: 0.8, animationDuration: '2.6s', animationDelay: '1.6s' } },
    { id: 11, style: { left: '42.67%', width: '21px', height: '37px', opacity: 0.9, animationDuration: '2.4s', animationDelay: '0.9s' } },
    { id: 12, style: { left: '72.90%', width: '29px', height: '49px', opacity: 0.7, animationDuration: '3.3s', animationDelay: '1.3s' } },
    { id: 13, style: { left: '82.45%', width: '23px', height: '43px', opacity: 0.8, animationDuration: '2.0s', animationDelay: '0.6s' } },
    { id: 14, style: { left: '92.11%', width: '25px', height: '40px', opacity: 0.6, animationDuration: '2.8s', animationDelay: '1.4s' } }
  ]);

  const [modalBackgroundParticles] = useState(() => [
    { id: 0, style: { left: '20%', width: '12px', height: '35px', opacity: 0.8, animationDuration: '1.5s' } },
    { id: 1, style: { left: '40%', width: '15px', height: '42px', opacity: 0.9, animationDuration: '2.0s' } },
    { id: 2, style: { left: '60%', width: '10px', height: '38px', opacity: 0.7, animationDuration: '1.8s' } },
    { id: 3, style: { left: '80%', width: '18px', height: '45px', opacity: 0.8, animationDuration: '2.2s' } },
    { id: 4, style: { left: '10%', width: '14px', height: '40px', opacity: 0.75, animationDuration: '1.7s' } }
  ]);

  const [productBackgroundParticles] = useState(() => [
    { id: 0, style: { left: '15%', width: '15px', height: '35px', opacity: 0.8, animationDuration: '2.5s' } },
    { id: 1, style: { left: '35%', width: '12px', height: '42px', opacity: 0.9, animationDuration: '2.8s' } },
    { id: 2, style: { left: '55%', width: '18px', height: '38px', opacity: 0.7, animationDuration: '2.2s' } },
    { id: 3, style: { left: '75%', width: '20px', height: '45px', opacity: 0.8, animationDuration: '3.0s' } },
    { id: 4, style: { left: '25%', width: '16px', height: '40px', opacity: 0.75, animationDuration: '2.6s' } },
    { id: 5, style: { left: '65%', width: '14px', height: '37px', opacity: 0.85, animationDuration: '2.4s' } },
    { id: 6, style: { left: '85%', width: '17px', height: '43px', opacity: 0.9, animationDuration: '2.9s' } },
    { id: 7, style: { left: '5%', width: '19px', height: '41px', opacity: 0.8, animationDuration: '2.1s' } }
  ]);
  
  // Update filtered products when products prop changes
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  
  useEffect(() => {
    // Flame effect on scroll
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        sectionRef.current.querySelectorAll('.on-scroll-flame').forEach(flame => {
          flame.classList.add('flame-effect');
        });
      } else {
        sectionRef.current.querySelectorAll('.on-scroll-flame').forEach(flame => {
          flame.classList.remove('flame-effect');
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
    // Handle filtering and sorting products
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (by id)
        break;
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-gradient-to-t from-red-500/20 to-transparent rounded-full animate-float-slow"
            style={particle.style}
          />
        ))}
      </div>
      
      {/* Fire Effect on Top */}
      <div className="absolute top-0 left-0 w-full h-20 overflow-hidden pointer-events-none">
        {FLAME_POSITIONS.map((flame, i) => (
          <div 
            key={i}
            className="absolute top-0 rounded-full bg-gradient-to-b from-orange-500 to-red-500 on-scroll-flame"
            style={{
              left: `${flame.left}%`,
              width: `${flame.width}px`,
              height: `${flame.height}px`,
              opacity: flame.opacity,
              animationDuration: `${flame.duration}s`,
              animationDelay: `${flame.delay}s`,
              filter: 'blur(8px)',
            }}
          />
        ))}
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="relative mb-16 flex flex-col items-center justify-center space-y-4 text-center z-10 strong-entrance">
          <div className="absolute -top-14 left-0 right-0 h-40 bg-red-500 opacity-10 blur-[100px] z-0 energy-burst"></div>
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 mb-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 fire-button">
              ELEVATE YOUR PERFORMANCE
            </div>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl fire-text pulse-glow dramatic-text">
              SUN SPORTSWEAR
            </h2>
            <div className="w-20 h-1 fire-gradient mx-auto my-4"></div>
            <p className="max-w-[700px] text-slate-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trang phục và phụ kiện cao cấp, thiết kế dành riêng cho những người đam mê thể thao và vận động.
            </p>
          </div>
        </div>
        
        {/* Search and filter controls */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 bg-slate-800/50 p-4 rounded-lg backdrop-blur-md border border-slate-700 streak-container">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Tìm kiếm sản phẩm..." 
          />
          
          <div className="w-full md:w-auto flex items-center gap-2">
            <Button 
              className="md:hidden flex items-center gap-2 text-white bg-slate-700 hover:bg-slate-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc</span>
            </Button>
            
            {/* Sort dropdown */}
            <div className="relative ml-auto">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 fire-button"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <span>Sắp xếp theo: {sortOptions.find(option => option.value === sortBy)?.label}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-10 border border-slate-700 streak-container">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortBy === option.value 
                            ? "bg-red-500/20 text-red-400" 
                            : "text-white hover:bg-slate-700"
                        }`}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div className="streak-effect"></div>
                </div>
              )}
            </div>
          </div>
          <div className="streak-effect"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Category filters - desktop */}
          <div className={`hidden md:block bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700 p-4 h-fit sticky top-24 streak-container`}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-red-500 mr-1 pulse-glow"></span>
              Danh mục
            </h3>
            <div className="flex flex-col gap-2 stagger-children">
              {categories.map((category) => (
                <button
                  key={category.value}
                  className={`px-4 py-3 rounded-lg text-left transition-colors ${
                    selectedCategory === category.value
                      ? "fire-gradient text-white font-medium"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <div className="flex items-center">
                    {selectedCategory === category.value && (
                      <div className="w-1 h-4 bg-white mr-2 flame-effect" style={{ filter: 'blur(1px)' }}></div>
                    )}
                    {category.label}                    <div className="ml-auto bg-slate-800/70 px-2 py-0.5 rounded-full text-xs">
                      {products.filter((p: Product) => category.value === "all" ? true : p.category === category.value).length}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="streak-effect"></div>
          </div>
          
          {/* Category filters - mobile */}
          {showFilters && (
            <div className="md:hidden bg-slate-800/90 backdrop-blur-md rounded-lg border border-slate-700 p-4 mb-4">
              <h3 className="text-lg font-bold text-white mb-2">Danh mục</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.value
                        ? "fire-gradient text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Products grid */}
          <div className="md:col-span-3">
            {/* Product count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-slate-400">
                Hiển thị <span className="text-white font-bold fire-text">{filteredProducts.length}</span> sản phẩm {selectedCategory !== "all" && (
                  <span>trong danh mục <span className="text-red-500 font-medium">{categories.find(c => c.value === selectedCategory)?.label}</span></span>
                )}
              </p>
              
              {(searchQuery || selectedCategory !== "all") && (
                <button 
                  className="text-red-400 hover:text-red-300 text-sm underline flex items-center"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSortBy("default");
                  }}
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
            
            {/* Product grid */}
            {filteredProducts.length > 0 ? (
              <div className="flex flex-col gap-8 stagger-children">
                {filteredProducts.map((product) => (
                  <SportswearProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-800/30 rounded-lg border border-slate-700">
                <p className="text-xl text-slate-400 mb-4">Không tìm thấy sản phẩm nào phù hợp.</p>
                <button 
                  className="text-red-500 hover:text-red-400 underline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSortBy("default");
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
            
            {/* Pagination or "View more" button */}
            {filteredProducts.length > 0 && (
              <div className="mt-10 flex justify-center">
                <Button className="group fire-button bg-slate-800 hover:bg-red-500 text-white border border-slate-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
                  <span>Xem thêm sản phẩm</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <span className="streak-effect"></span>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Featured Product Section with Energy Effect */}
        <div className="mt-20 relative overflow-hidden rounded-xl border border-red-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-slate-900/30"></div>
          
          {/* Energy pulses */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-red-500 opacity-30 blur-[50px] energy-burst"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-amber-500 opacity-20 blur-[60px] energy-burst" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 relative">              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src="https://localhost:5001/images/sportswear/premium-set.jpg"
                  alt="Premium Sportswear Set"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                
                {/* Fire effects */}
                <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden pointer-events-none">
                  {productBackgroundParticles.map((particle) => (
                    <div
                      key={particle.id}
                      className="absolute bg-gradient-to-t from-red-500/20 to-transparent rounded-full animate-float"
                      style={particle.style}
                    />
                  ))}
                </div>
                
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold pulse-glow">
                  NEW
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h3 className="text-3xl font-bold mb-2 fire-text-blink">Premium Sportswear Collection</h3>
              <p className="text-slate-300 mb-4">Bộ sưu tập thời trang thể thao cao cấp mới nhất, được thiết kế đặc biệt cho vận động viên chuyên nghiệp và người yêu thể thao.</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-2 rounded-lg">
                  <Flame className="h-5 w-5 text-red-500" />
                  <span className="text-white">Vải thoáng khí</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-2 rounded-lg">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span className="text-white">Chống tia UV</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-2 rounded-lg">
                  <Star className="h-5 w-5 text-cyan-500" />
                  <span className="text-white">Co giãn 4 chiều</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white fire-text">1,990,000 <span className="text-sm text-red-400">VNĐ</span></div>
                <Button className="fire-button burning-button bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  <span>Xem sản phẩm</span>
                  <span className="streak-effect"></span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}