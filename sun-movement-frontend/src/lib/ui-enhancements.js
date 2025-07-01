"use client";

/**
 * Utilities for enhancing UI elements with animations and interactions
 */

// Header scroll effect
export const enhanceHeader = () => {
  const header = document.querySelector('header');
  const topBar = document.querySelector('.top-bar');
  
  if (!header || !topBar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
      topBar.classList.add('top-bar-hidden');
    } else {
      header.classList.remove('header-scrolled');
      topBar.classList.remove('top-bar-hidden');
    }
  });
};

// Button ripple effect
export const addButtonEffects = () => {
  const buttons = document.querySelectorAll('.btn, .btn-primary-enhanced');
  
  buttons.forEach(button => {
    button.classList.add('btn-ripple');
    
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
        ripple.remove();
      }, 600);
    });
  });
};

// Initialize enhanced navigation
export const enhanceNavigation = () => {
  const navItems = document.querySelectorAll('.nav-item, [href]');
  
  navItems.forEach(item => {
    if (item.tagName.toLowerCase() === 'a') {
      item.classList.add('header-nav-item');
    }
  });
};

// Initialize all UI enhancements
export const initUIEnhancements = () => {
  if (typeof window !== 'undefined') {
    enhanceHeader();
    addButtonEffects();
    enhanceNavigation();
  }
};

export default initUIEnhancements;
