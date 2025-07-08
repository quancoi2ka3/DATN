"use client";

import { useEffect, useRef, useState } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({ 
  children, 
  speed = 0.5, 
  className = '' 
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const speedRef = useRef(speed);
  
  // Update speed ref when prop changes
  speedRef.current = speed;

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speedRef.current;
        
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          setOffsetY(rate);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `translateY(${offsetY}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  className?: string;
}

export function FloatingElement({
  children,
  direction = 'up',
  duration = 3,
  delay = 0,
  className = ''
}: FloatingElementProps) {
  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(-10px)';
      case 'down':
        return 'translateY(10px)';
      case 'left':
        return 'translateX(-10px)';
      case 'right':
        return 'translateX(10px)';
      default:
        return 'translateY(-10px)';
    }
  };

  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        animation: `float-${direction} ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      {children}
      <style jsx>{`
        @keyframes float-${direction} {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: ${getTransform()};
          }
        }
      `}</style>
    </div>
  );
}

interface MouseTrackingProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

export function MouseTracking({ 
  children, 
  intensity = 0.05, 
  className = '' 
}: MouseTrackingProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * intensity;
        const deltaY = (e.clientY - centerY) * intensity;
        
        setTransform({ x: deltaX, y: deltaY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }}
    >
      {children}
    </div>
  );
}

// Stagger children animation
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1, 
  className = '' 
}: StaggerContainerProps) {
  return (
    <div className={`stagger-container ${className}`}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <div
              key={index}
              style={{
                animationDelay: `${index * staggerDelay}s`
              }}
              className="stagger-item"
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
