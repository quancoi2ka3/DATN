"use client";

import { useEffect } from 'react';

// CSS Optimizer để giảm unused CSS
export function CSSOptimizer() {
  useEffect(() => {
    // Remove unused CSS classes
    const removeUnusedCSS = () => {
      const unusedClasses = [
        '.unused-class',
        '.deprecated-style',
        '.old-animation',
        '.legacy-component'
      ];

      unusedClasses.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          element.classList.remove(selector.replace('.', ''));
        });
      });
    };

    // Optimize CSS animations
    const optimizeAnimations = () => {
      const animatedElements = document.querySelectorAll('[data-animate]');
      
      animatedElements.forEach(element => {
        // Add will-change for better performance
        (element as HTMLElement).style.willChange = 'transform, opacity';
        
        // Remove will-change after animation
        setTimeout(() => {
          (element as HTMLElement).style.willChange = 'auto';
        }, 1000);
      });
    };

    // Reduce layout shifts
    const preventLayoutShifts = () => {
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        if (!(img as HTMLElement).style.aspectRatio && img.width && img.height) {
          (img as HTMLElement).style.aspectRatio = `${img.width} / ${img.height}`;
        }
      });
    };

    // Execute optimizations
    removeUnusedCSS();
    optimizeAnimations();
    preventLayoutShifts();
  }, []);

  return null;
}

// Critical CSS injector
export function CriticalCSSInjector() {
  useEffect(() => {
    // Inject critical CSS inline
    const criticalCSS = `
      .critical-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        background: #f3f4f6;
        border-radius: 0.5rem;
      }
      
      .critical-text {
        font-family: 'SF Pro Display', sans-serif;
        font-size: 1rem;
        color: #6b7280;
      }
      
      .critical-spinner {
        width: 2rem;
        height: 2rem;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null;
}

// CSS purger utility
export function CSSPurger() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Analyze CSS usage
      const analyzeCSSUsage = () => {
        const allStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
        const usedClasses = new Set();
        
        // Get all used classes
        document.querySelectorAll('*').forEach(element => {
          element.classList.forEach(className => {
            usedClasses.add(className);
          });
        });

        console.log(`📊 CSS Analysis: ${usedClasses.size} classes in use`);
        
        // Find potentially unused classes
        const allClasses = new Set();
        allStyles.forEach(style => {
          const cssText = style.textContent || '';
          const classMatches = cssText.match(/\.[a-zA-Z][a-zA-Z0-9_-]*/g);
          if (classMatches) {
            classMatches.forEach(match => {
              allClasses.add(match.substring(1));
            });
          }
        });

        const unusedClasses = Array.from(allClasses).filter(className => 
          !usedClasses.has(className)
        );

        if (unusedClasses.length > 0) {
          console.warn(`⚠️ Potentially unused CSS classes: ${unusedClasses.length} found`);
          console.log('Unused classes:', unusedClasses.slice(0, 10));
        }
      };

      setTimeout(analyzeCSSUsage, 3000);
    }
  }, []);

  return null;
}

// Animation optimizer
export function AnimationOptimizer() {
  useEffect(() => {
    // Optimize animations for performance
    const optimizeAnimations = () => {
      const animatedElements = document.querySelectorAll('[data-animate]');
      
      animatedElements.forEach(element => {
        // Add GPU acceleration
        (element as HTMLElement).style.transform = 'translateZ(0)';
        (element as HTMLElement).style.willChange = 'transform, opacity';
        
        // Use requestAnimationFrame for smooth animations
        const animate = () => {
          element.classList.add('animate');
          (element as HTMLElement).style.willChange = 'auto';
        };
        
        requestAnimationFrame(animate);
      });
    };

    // Reduce motion for users who prefer it
    const handleReducedMotion = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
      }
    };

    optimizeAnimations();
    handleReducedMotion();

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', handleReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotion);
    };
  }, []);

  return null;
}

// Layout shift prevention
export function LayoutShiftPreventer() {
  useEffect(() => {
    // Prevent layout shifts by reserving space
    const preventLayoutShifts = () => {
      const images = document.querySelectorAll('img[data-width][data-height]');
      
      images.forEach(img => {
        const width = img.getAttribute('data-width');
        const height = img.getAttribute('data-height');
        
        if (width && height) {
          (img as HTMLElement).style.aspectRatio = `${width} / ${height}`;
          (img as HTMLElement).style.width = '100%';
          (img as HTMLElement).style.height = 'auto';
        }
      });

      // Reserve space for dynamic content
      const dynamicElements = document.querySelectorAll('[data-reserve-space]');
      
      dynamicElements.forEach(element => {
        const height = element.getAttribute('data-reserve-space');
        if (height) {
          (element as HTMLElement).style.minHeight = height;
        }
      });
    };

    // Monitor layout shifts
    const observeLayoutShifts = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              const layoutShift = entry as any;
              if (layoutShift.value > 0.1) {
                console.warn(`⚠️ Layout shift detected: ${layoutShift.value.toFixed(3)}`);
              }
            }
          }
        });

        try {
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Layout shift observer not supported');
        }
      }
    };

    preventLayoutShifts();
    observeLayoutShifts();
  }, []);

  return null;
}

// Main CSS optimizer
export function MainCSSOptimizer() {
  return (
    <>
      <CSSOptimizer />
      <CriticalCSSInjector />
      <CSSPurger />
      <AnimationOptimizer />
      <LayoutShiftPreventer />
    </>
  );
} 