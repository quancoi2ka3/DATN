// UI Enhancements Script
document.addEventListener("DOMContentLoaded", function() {
  // Button ripple effect
  document.addEventListener("click", function(e) {
    const target = e.target.closest(".btn, .btn-primary-enhanced, [class*='btn-']");
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    const rippleContainer = document.createElement("span");
    rippleContainer.classList.add("ripple-container");
    rippleContainer.appendChild(ripple);
    
    target.appendChild(rippleContainer);
    
    setTimeout(() => {
      rippleContainer.remove();
    }, 600);
  });
  
  // Enhanced header interactions
  const enhanceHeaderItems = () => {
    const navItems = document.querySelectorAll("a[href], [role=button]");
    
    navItems.forEach(item => {
      if (item.parentElement && 
          (item.parentElement.classList.contains("NavigationMenuItem") || 
           item.parentElement.tagName.toLowerCase() === "li")) {
        
        item.classList.add("header-nav-item");
      }
    });
  };
  
  // Handle scroll events for the header
  let lastScrollTop = 0;
  const handleHeaderScroll = () => {
    const header = document.querySelector("header");
    const topBar = document.querySelector(".top-bar");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (header) {
      // Add scroll effect to header
      if (scrollTop > 50) {
        header.classList.add("header-scrolled");
        if (topBar) topBar.classList.add("top-bar-hidden");
      } else {
        header.classList.remove("header-scrolled");
        if (topBar) topBar.classList.remove("top-bar-hidden");
      }
      
      // Add shadow based on scroll direction
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.classList.add("shadow-lg");
      } else {
        // Scrolling up
        setTimeout(() => {
          if (window.pageYOffset < lastScrollTop) {
            header.classList.remove("shadow-lg");
          }
        }, 150);
      }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };
  
  // Initialize
  enhanceHeaderItems();
  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();
  
  // Reapply enhancements after navigation/route changes
  // For SPA/Next.js route changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && 
          (mutation.target.classList.contains("NavigationMenuList") || 
           mutation.target.tagName.toLowerCase() === "header")) {
        enhanceHeaderItems();
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
