// Enhanced scroll progress with better visibility
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', function() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = Math.min((scrolled / scrollHeight) * 100, 100);
      scrollProgress.style.width = progress + '%';
    }
  }, { passive: true });
  
  // Add enhanced classes to buttons when page loads
  window.addEventListener('DOMContentLoaded', function() {
    // Find all buttons and add enhanced classes
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent && btn.textContent.includes('Xem chi tiết')) {
        btn.classList.add('btn-enhanced-ux', 'force-gradient-btn');
      }
    });
    
    // Find all product cards and add enhanced classes
    const cards = document.querySelectorAll('[class*="group"][class*="relative"][class*="bg-white"]');
    cards.forEach(card => {
      card.classList.add('product-card-enhanced', 'force-enhanced-hover');
    });
  });
}
