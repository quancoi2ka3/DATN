"use client";

import { useEffect, useRef, useState } from 'react';

// Performance monitoring và optimization
export function PerformanceOptimizer() {
  const [isOptimized, setIsOptimized] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      images.forEach((img) => imageObserver.observe(img));
    };

    // Optimize animations
    const optimizeAnimations = () => {
      const animatedElements = document.querySelectorAll('[data-animate]');
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            animationObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      animatedElements.forEach((el) => animationObserver.observe(el));
    };

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/images/hero-bg.webp',
        '/images/logo.webp',
        '/fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf'
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = src.includes('fonts') ? 'font' : 'image';
        link.href = src;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Optimize scroll performance
    const optimizeScroll = () => {
      let ticking = false;
      
      const updateScrollProgress = () => {
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
          const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          scrollProgress.style.width = `${scrolled}%`;
        }
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollProgress);
          ticking = true;
        }
      };

      window.addEventListener('scroll', requestTick, { passive: true });
    };

    // Execute optimizations
    optimizeImages();
    optimizeAnimations();
    preloadCriticalResources();
    optimizeScroll();
    setIsOptimized(true);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return null; // Component này không render gì
}

// Resource preloader cho critical resources
export function CriticalResourcePreloader() {
  useEffect(() => {
    // Preload critical CSS
    const preloadCriticalCSS = () => {
      const criticalStyles = [
        '/styles/critical.css',
        '/styles/header.css'
      ];

      criticalStyles.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // Preload critical JavaScript
    const preloadCriticalJS = () => {
      const criticalScripts = [
        '/js/core.js',
        '/js/utils.js'
      ];

      criticalScripts.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    preloadCriticalCSS();
    preloadCriticalJS();
  }, []);

  return null;
}

// Bundle size analyzer
export function BundleAnalyzer() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Monitor bundle chunks
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('chunks/')) {
            console.log(`📦 Chunk loaded: ${entry.name} (${(entry.duration / 1000).toFixed(2)}s)`);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported');
      }

      return () => observer.disconnect();
    }
  }, []);

  return null;
}

// Memory usage monitor
export function MemoryMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        
        if (usedMB > 100) {
          console.warn(`⚠️ High memory usage: ${usedMB}MB / ${totalMB}MB`);
        }
      };

      const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);

  return null;
}

// Network performance monitor
export function NetworkMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      
      if (connection) {
        console.log(`🌐 Network: ${connection.effectiveType} (${connection.downlink}Mbps)`);
        
        connection.addEventListener('change', () => {
          console.log(`🌐 Network changed: ${connection.effectiveType} (${connection.downlink}Mbps)`);
        });
      }
    }
  }, []);

  return null;
}

// Main performance optimizer component
export function MainPerformanceOptimizer() {
  return (
    <>
      <PerformanceOptimizer />
      <CriticalResourcePreloader />
      <BundleAnalyzer />
      <MemoryMonitor />
      <NetworkMonitor />
    </>
  );
} 