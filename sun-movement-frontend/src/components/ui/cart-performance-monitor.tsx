"use client";

import { useCart } from "@/lib/cart-context";
import { useState, useEffect } from "react";

export function useCartPerformance() {
  const { getPerformanceMetrics } = useCart();
  const [metrics, setMetrics] = useState(getPerformanceMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getPerformanceMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [getPerformanceMetrics]);

  return metrics;
}

export function CartPerformanceMonitor() {
  const metrics = useCartPerformance();
  const [isVisible, setIsVisible] = useState(false);

  // Show performance monitor in development mode
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  if (!isVisible) return null;

  const cacheHitRate = metrics.totalRequests > 0 
    ? ((metrics.cacheHits / metrics.totalRequests) * 100).toFixed(1)
    : '0';

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="font-bold mb-2">Cart Performance</div>
      <div className="space-y-1">
        <div>Cache Hit Rate: {cacheHitRate}%</div>
        <div>Cache Hits: {metrics.cacheHits}</div>
        <div>Cache Misses: {metrics.cacheMisses}</div>
        <div>Retry Count: {metrics.retryCount}</div>
        <div>Avg Response: {metrics.averageResponseTime.toFixed(0)}ms</div>
        <div>Total Requests: {metrics.totalRequests}</div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="mt-2 text-xs opacity-60 hover:opacity-100"
      >
        Hide
      </button>
    </div>
  );
}
