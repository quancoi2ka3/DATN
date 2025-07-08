import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseScrollOptions {
  threshold?: number;
  throttleMs?: number;
}

/**
 * Optimized scroll hook that prevents infinite re-renders
 * and memory leaks while providing smooth scroll detection
 */
export function useScroll({ threshold = 50, throttleMs = 16 }: UseScrollOptions = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Use refs to maintain stable references across renders
  const thresholdRef = useRef(threshold);
  const throttleMsRef = useRef(throttleMs);
  const lastScrollTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  
  // Update refs when props change
  thresholdRef.current = threshold;
  throttleMsRef.current = throttleMs;

  // Optimized scroll handler using RAF and throttling
  const handleScroll = useCallback(() => {
    const now = Date.now();
    
    // Cancel any pending RAF
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Throttle check
    if (now - lastScrollTimeRef.current < throttleMsRef.current) {
      rafIdRef.current = requestAnimationFrame(handleScroll);
      return;
    }
    
    lastScrollTimeRef.current = now;
    
    rafIdRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > thresholdRef.current;
      
      // Only update state if values actually changed
      setScrollY(prev => prev !== currentScrollY ? currentScrollY : prev);
      setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
    });
  }, []);

  useEffect(() => {
    // Set initial values
    const initialScrollY = window.scrollY;
    setScrollY(initialScrollY);
    setScrolled(initialScrollY > threshold);

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { 
      passive: true,
      capture: false 
    });
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Cancel any pending animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []); // Empty dependency array prevents re-registration

  return { scrolled, scrollY };
}
