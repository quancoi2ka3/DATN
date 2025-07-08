/**
 * Performance monitoring utility for React components
 * Helps detect infinite re-renders and excessive state updates
 */

export class RenderMonitor {
  private renderCounts = new Map<string, number>();
  private renderTimes = new Map<string, number[]>();
  private warningThreshold = 10;
  private enabled = process.env.NODE_ENV === 'development';

  trackRender(componentName: string, props?: any) {
    if (!this.enabled) return;

    const now = Date.now();
    const count = this.renderCounts.get(componentName) || 0;
    const newCount = count + 1;
    
    this.renderCounts.set(componentName, newCount);
    
    // Track render times
    const times = this.renderTimes.get(componentName) || [];
    times.push(now);
    
    // Keep only last 20 render times
    if (times.length > 20) {
      times.shift();
    }
    this.renderTimes.set(componentName, times);

    // Check for excessive renders in short time
    if (times.length >= 5) {
      const recentTimes = times.slice(-5);
      const timeSpan = recentTimes[recentTimes.length - 1] - recentTimes[0];
      
      if (timeSpan < 1000) { // 5 renders in less than 1 second
        console.warn(`⚠️ Potential infinite re-render detected in ${componentName}`);
        console.warn(`5 renders in ${timeSpan}ms`);
        console.warn('Props:', props);
      }
    }

    // Warn if component has rendered too many times
    if (newCount > this.warningThreshold) {
      console.warn(`⚠️ Component ${componentName} has rendered ${newCount} times`);
      
      if (newCount % 50 === 0) {
        console.warn('Recent render times:', times);
        console.warn('Props:', props);
      }
    }
  }

  getRenderCount(componentName: string): number {
    return this.renderCounts.get(componentName) || 0;
  }

  reset(componentName?: string) {
    if (componentName) {
      this.renderCounts.delete(componentName);
      this.renderTimes.delete(componentName);
    } else {
      this.renderCounts.clear();
      this.renderTimes.clear();
    }
  }

  getAllStats() {
    const stats: Record<string, { count: number; avgInterval: number }> = {};
    
    for (const [name, count] of this.renderCounts) {
      const times = this.renderTimes.get(name) || [];
      let avgInterval = 0;
      
      if (times.length > 1) {
        const totalTime = times[times.length - 1] - times[0];
        avgInterval = totalTime / (times.length - 1);
      }
      
      stats[name] = { count, avgInterval };
    }
    
    return stats;
  }
}

export const renderMonitor = new RenderMonitor();

/**
 * Hook to monitor component renders
 */
export function useRenderMonitor(componentName: string, dependencies?: any[]) {
  if (process.env.NODE_ENV === 'development') {
    renderMonitor.trackRender(componentName, dependencies);
  }
}

export default renderMonitor;
