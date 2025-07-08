"use client";

/**
 * Utilities for enhancing UI elements with animations and interactions
 */

// Header scroll effect - NOT USED when React handles scroll
export const enhanceHeader = () => {
  // This function is now disabled to avoid conflicts with React scroll handler
  console.warn('enhanceHeader is disabled to prevent conflicts with React scroll handler');
  return;
};

// Button ripple effect
export const addButtonEffects = () => {
  // Use a flag to prevent multiple initializations
  if (window.buttonEffectsInitialized) return;
  
  const buttons = document.querySelectorAll('.btn, .btn-primary-enhanced');
  
  buttons.forEach(button => {
    // Skip if already enhanced
    if (button.dataset.enhanced) return;
    
    button.classList.add('btn-ripple');
    button.dataset.enhanced = 'true';
    
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        if (ripple && ripple.parentNode) {
          ripple.remove();
        }
      }, 600);
    });
  });
  
  window.buttonEffectsInitialized = true;
};

// Initialize enhanced navigation
export const enhanceNavigation = () => {
  // Use a flag to prevent multiple initializations
  if (window.navigationEnhanced) return;
  
  const navItems = document.querySelectorAll('.nav-item, [href]');
  
  navItems.forEach(item => {
    if (item.tagName.toLowerCase() === 'a' && !item.dataset.enhanced) {
      item.classList.add('header-nav-item');
      item.dataset.enhanced = 'true';
    }
  });
  
  window.navigationEnhanced = true;
};

// Initialize all UI enhancements (excluding header scroll to avoid conflicts)
export const initUIEnhancements = () => {
  if (typeof window !== 'undefined') {
    // Don't call enhanceHeader() to avoid scroll listener conflicts
    addButtonEffects();
    enhanceNavigation();
  }
};

export default initUIEnhancements;
