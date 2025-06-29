"use client";

import { cn } from "@/lib/utils";

// Base Skeleton Component
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

// Section Skeleton for large components
export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Title skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          
          {/* Content grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 text-center space-y-8">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
      {/* Background image skeleton */}
      <Skeleton className="absolute inset-0 -z-10" />
    </div>
  );
}

// Testimonials Skeleton
export function TestimonialsSkeleton() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Product Section Skeleton
export function ProductSkeleton() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Events Section Skeleton
export function EventsSkeleton() {
  return (
    <div className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-8 w-56 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Contact CTA Skeleton
export function ContactCTASkeleton() {
  return (
    <div className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
      <div className="container mx-auto px-4 text-center space-y-8">
        <Skeleton className="h-8 w-80 mx-auto bg-white/20" />
        <Skeleton className="h-4 w-96 mx-auto bg-white/20" />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-12 w-40 bg-white/20" />
          <Skeleton className="h-12 w-40 bg-white/20" />
        </div>
      </div>
    </div>
  );
}
