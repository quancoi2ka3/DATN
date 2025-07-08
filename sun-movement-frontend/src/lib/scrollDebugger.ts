/**
 * Debug utilities for monitoring scroll performance
 * Use this to identify scroll-related performance issues
 */

export const scrollDebugger = {
  enabled: process.env.NODE_ENV === 'development',
  
  log(message: string, data?: any) {
    if (this.enabled) {
      console.log(`[ScrollDebug] ${message}`, data || '');
    }
  },
  
  warn(message: string, data?: any) {
    if (this.enabled) {
      console.warn(`[ScrollDebug] ${message}`, data || '');
    }
  },
  
  monitorScrollEvents() {
    if (!this.enabled) return;
    
    let scrollCount = 0;
    let lastTime = Date.now();
    
    const monitor = () => {
      scrollCount++;
      const now = Date.now();
      
      if (now - lastTime > 1000) {
        console.log(`[ScrollDebug] ${scrollCount} scroll events in ${now - lastTime}ms`);
        scrollCount = 0;
        lastTime = now;
      }
    };
    
    window.addEventListener('scroll', monitor, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', monitor);
    };
  }
};

export default scrollDebugger;
