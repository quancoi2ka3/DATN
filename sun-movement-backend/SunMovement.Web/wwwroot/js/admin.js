// Admin panel functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin.js loaded - DOMContentLoaded fired');
    
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    console.log('Sidebar toggle button found:', sidebarToggle);
    
    if (sidebarToggle) {
        // Check if sidebar state is saved in localStorage
        const savedState = localStorage.getItem('sb|sidebar-toggle');
        console.log('Saved sidebar state:', savedState);
        
        if (savedState === 'true') {
            document.body.classList.add('sb-sidenav-toggled');
            console.log('Applied saved toggled state');
        }
        
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Sidebar toggle clicked');
            
            document.body.classList.toggle('sb-sidenav-toggled');
            const isToggled = document.body.classList.contains('sb-sidenav-toggled');
            
            console.log('Sidebar toggled. New state:', isToggled);
            console.log('Body classes:', document.body.className);
            
            localStorage.setItem('sb|sidebar-toggle', isToggled);
        });
        
        console.log('Sidebar toggle event listener attached');
    } else {
        console.error('Sidebar toggle button not found!');
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Check if theme preference is saved
        const currentTheme = localStorage.getItem('admin-theme') || 'light';
        document.body.setAttribute('data-theme', currentTheme);
        
        // Update toggle button icon
        updateThemeIcon(currentTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('admin-theme', newTheme);
            
            // Update toggle icon
            updateThemeIcon(newTheme);
        });
    }
    
    // Function to update theme icon
    function updateThemeIcon(theme) {
        const icon = document.getElementById('themeIcon');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }

    // Initialize DataTables where present
    if ($.fn.DataTable) {
        $('.datatable').DataTable({
            responsive: true
        });
    }

    // Initialize tooltips
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Tooltip !== 'undefined') {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    // Mark active nav item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.sb-sidenav-menu .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
            link.classList.add('active');
        }
    });

    // Notifications functionality
    const notificationDropdown = document.getElementById('notificationDropdown');
    if (notificationDropdown) {
        // This would typically be populated from an API
        // For now we're just adding event listeners
        document.querySelectorAll('.notification-item .mark-read').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const item = this.closest('.notification-item');
                item.classList.remove('unread');
                
                // Update notification badge count
                const badge = document.getElementById('notificationBadge');
                if (badge) {
                    const currentCount = parseInt(badge.textContent);
                    if (currentCount > 1) {
                        badge.textContent = currentCount - 1;
                    } else {
                        badge.style.display = 'none';
                    }
                }
            });
        });
    }

    // Quick search functionality
    const quickSearch = document.getElementById('quickSearch');
    if (quickSearch) {
        quickSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                window.location.href = `/admin/search?q=${encodeURIComponent(this.value)}`;
            }
        });
    }

    // Initialize any popovers
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Popover !== 'undefined') {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }
});
