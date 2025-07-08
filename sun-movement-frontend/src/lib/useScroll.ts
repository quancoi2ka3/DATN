import { useState, useEffect, useCallback, useRef } from 'react';
import { throttle } from './throttle';

export interface UseScrollOptions {
  threshold?: number;
  throttleMs?: number;
}

export function useScroll({ threshold = 50, throttleMs = 16 }: UseScrollOptions = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Use refs to store stable references
  const thresholdRef = useRef(threshold);
  const throttleMsRef = useRef(throttleMs);
  
  // Update refs when props change
  thresholdRef.current = threshold;
  throttleMsRef.current = throttleMs;

  // Create throttled function with stable reference
  const throttledScrollHandler = useRef(
    throttle(() => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > thresholdRef.current);
    }, throttleMsRef.current)
  );

  // Update throttle timing if throttleMs changes significantly
  useEffect(() => {
    throttledScrollHandler.current = throttle(() => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > thresholdRef.current);
    }, throttleMsRef.current);
  }, [throttleMs]);

  const handleScroll = useCallback(() => {
    throttledScrollHandler.current();
  }, []);

  useEffect(() => {
    // Set initial values only once
    const initialScrollY = window.scrollY;
    setScrollY(initialScrollY);
    setScrolled(initialScrollY > threshold);

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array - only run once

  return { scrolled, scrollY };
}
