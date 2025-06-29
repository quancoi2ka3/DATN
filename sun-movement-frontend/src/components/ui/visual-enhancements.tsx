"use client";

import { useEffect, useState } from 'react';

// Smooth page transitions
export function PageTransition() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fadeOut">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-red-300 border-b-transparent rounded-full animate-spin animate-reverse"></div>
      </div>
    </div>
  );
}

// Scroll progress indicator
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300 ease-out shadow-lg"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// Improved loading states for sections
export function SectionLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
    </div>
  );
}

// Card hover effects
export function EnhancedCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`
      group relative 
      bg-white rounded-xl shadow-md 
      transition-all duration-500 ease-out
      hover:shadow-2xl hover:-translate-y-2
      hover:bg-gradient-to-br hover:from-white hover:to-gray-50
      before:absolute before:inset-0 before:rounded-xl
      before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
      before:translate-x-[-100%] before:transition-transform before:duration-700
      hover:before:translate-x-[100%]
      overflow-hidden
      ${className}
    `}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Button with ripple effect
export function RippleButton({ 
  children, 
  onClick,
  className = "",
  ...props 
}: { 
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) {
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
    
    onClick?.();
  };

  return (
    <button 
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-red-500 to-red-600
        hover:from-red-600 hover:to-red-700
        text-white font-semibold
        px-8 py-3 rounded-full
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
        active:scale-95
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute inset-0 rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            transformOrigin: 'center'
          }}
        />
      ))}
    </button>
  );
}

// Image with loading effect
export function ImageWithLoading({ 
  src, 
  alt, 
  className = "",
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`
          w-full h-full object-cover
          transition-all duration-700 ease-out
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
        `}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        {...props}
      />
      
      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Không thể tải ảnh</span>
        </div>
      )}
    </div>
  );
}

// Text reveal animation
export function TextReveal({ 
  children, 
  delay = 0,
  className = "" 
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`
      transition-all duration-1000 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      ${className}
    `}>
      {children}
    </div>
  );
}
