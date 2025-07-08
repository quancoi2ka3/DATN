import { useRef, useEffect } from 'react';

/**
 * Performance monitoring utilities for React components
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private renderCounts = new Map<string, number>();
  private reRenderReasons = new Map<string, string[]>();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  logRender(componentName: string, reason?: string) {
    const count = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, count + 1);
    
    if (reason) {
      const reasons = this.reRenderReasons.get(componentName) || [];
      reasons.push(reason);
      this.reRenderReasons.set(componentName, reasons);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Performance] ${componentName} rendered ${count + 1} times`, reason ? `Reason: ${reason}` : '');
    }
  }

  getStats() {
    return {
      renderCounts: Object.fromEntries(this.renderCounts),
      reRenderReasons: Object.fromEntries(this.reRenderReasons)
    };
  }

  reset() {
    this.renderCounts.clear();
    this.reRenderReasons.clear();
  }
}

// Hook to monitor component re-renders
export function useRenderMonitor(componentName: string, dependencies?: any[]) {
  const monitor = PerformanceMonitor.getInstance();
  const prevDeps = useRef(dependencies);
  
  useEffect(() => {
    let reason = 'mount';
    
    if (prevDeps.current && dependencies) {
      const changedDeps = dependencies.filter((dep, index) => 
        dep !== prevDeps.current![index]
      );
      
      if (changedDeps.length > 0) {
        reason = `dependency change: ${changedDeps.map((_, i) => `dep[${i}]`).join(', ')}`;
      }
    }
    
    monitor.logRender(componentName, reason);
    prevDeps.current = dependencies;
  });
}
