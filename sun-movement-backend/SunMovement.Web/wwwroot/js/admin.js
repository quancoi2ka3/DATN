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

    // Add API debugging functionality
    function setupApiDebugger() {
        // Add a debug panel to the admin layout
        const adminContent = document.getElementById('layoutSidenav_content');
        if (adminContent) {
            const debugPanel = document.createElement('div');
            debugPanel.id = 'apiDebugPanel';
            debugPanel.style.display = 'none';
            debugPanel.innerHTML = `
                <div class="bg-light p-3 border rounded shadow-sm">
                    <h5>API Debug Console</h5>
                    <div id="apiDebugLog" style="max-height: 200px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;"></div>
                    <button class="btn btn-sm btn-outline-danger mt-2" id="clearApiDebug">Clear Log</button>
                    <button class="btn btn-sm btn-outline-secondary mt-2" id="closeApiDebug">Close</button>
                    <button class="btn btn-sm btn-outline-primary mt-2" id="testApiConnection">Test API Connection</button>
                    <button class="btn btn-sm btn-outline-info mt-2" id="checkProductsApi">Check Products API</button>
                </div>
            `;
            
            // Add debug panel toggle to the page
            const debugButton = document.createElement('button');
            debugButton.className = 'btn btn-sm btn-info position-fixed';
            debugButton.style.right = '10px';
            debugButton.style.bottom = '10px';
            debugButton.innerHTML = '<i class="fas fa-bug"></i> Debug API';
            debugButton.id = 'toggleApiDebug';
            
            adminContent.appendChild(debugPanel);
            adminContent.appendChild(debugButton);
            
            // Setup event listeners
            document.getElementById('toggleApiDebug').addEventListener('click', function() {
                const panel = document.getElementById('apiDebugPanel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            });
            
            document.getElementById('closeApiDebug').addEventListener('click', function() {
                document.getElementById('apiDebugPanel').style.display = 'none';
            });
            
            document.getElementById('clearApiDebug').addEventListener('click', function() {
                document.getElementById('apiDebugLog').innerHTML = '';
            });
            
            document.getElementById('testApiConnection').addEventListener('click', function() {
                testApiEndpoints();
            });
            
            // Add new button handler to specifically check products API
            document.getElementById('checkProductsApi').addEventListener('click', function() {
                checkProductsApiEndpoint();
            });
            
            // Override fetch to log API calls
            const originalFetch = window.fetch;
            window.fetch = async function(url, options) {
                const startTime = performance.now();
                const logElement = document.getElementById('apiDebugLog');
                
                logElement.innerHTML += `<div style="border-bottom: 1px solid #ddd; margin-bottom: 5px; padding-bottom: 5px;">
                    <strong style="color: #007bff;">${options?.method || 'GET'}</strong> ${url}<br>
                    <small>Request time: ${new Date().toLocaleTimeString()}</small>
                </div>`;
                
                try {
                    const response = await originalFetch(url, options);
                    const endTime = performance.now();
                    const duration = Math.round(endTime - startTime);
                    
                    const responseClone = response.clone();
                    let responseBody;
                    try {
                        responseBody = await responseClone.text();
                    } catch (e) {
                        responseBody = "Unable to read response body";
                    }
                    
                    // Add response details to log
                    logElement.lastElementChild.innerHTML += `
                        <div style="margin-left: 10px;">
                            <span style="color: ${response.ok ? 'green' : 'red'};">
                                Status: ${response.status} ${response.statusText}
                            </span><br>
                            <small>Duration: ${duration}ms</small><br>
                            <details>
                                <summary>Response Body</summary>
                                <pre style="max-height: 100px; overflow-y: auto;">${responseBody}</pre>
                            </details>
                        </div>
                    `;
                    
                    logElement.scrollTop = logElement.scrollHeight;
                    return response;
                } catch (error) {
                    logElement.lastElementChild.innerHTML += `
                        <div style="margin-left: 10px; color: red;">
                            Error: ${error.message}<br>
                        </div>
                    `;
                    logElement.scrollTop = logElement.scrollHeight;
                    throw error;
                }
            };
        }
    }
    
    // Add function to test API endpoints
    async function testApiEndpoints() {
        const endpoints = [
            '/api/products',
            '/api/services',
            '/api/faqs',
            '/api/events'
        ];
        
        const logElement = document.getElementById('apiDebugLog');
        logElement.innerHTML += `<div style="border-top: 2px solid #007bff; margin-top: 10px; padding-top: 5px;">
            <strong>API Connection Test</strong> (${new Date().toLocaleTimeString()})
        </div>`;
        
        for (const endpoint of endpoints) {
            try {
                // Add cache busting
                const bustUrl = `${endpoint}?_=${Date.now()}`;
                const response = await fetch(bustUrl);
                const success = response.ok;
                const status = `${response.status} ${response.statusText}`;
                
                logElement.innerHTML += `<div style="margin-left: 10px; margin-top: 5px;">
                    <span style="color: ${success ? 'green' : 'red'};">
                        ${endpoint}: ${success ? 'Success' : 'Failed'} (${status})
                    </span>
                </div>`;
            } catch (error) {
                logElement.innerHTML += `<div style="margin-left: 10px; margin-top: 5px; color: red;">
                    ${endpoint}: Error - ${error.message}
                </div>`;
            }
        }
        
        logElement.scrollTop = logElement.scrollHeight;
    }
    
    // Add new function to specifically check products API
    async function checkProductsApiEndpoint() {
        const logElement = document.getElementById('apiDebugLog');
        logElement.innerHTML += `<div style="border-top: 2px solid #007bff; margin-top: 10px; padding-top: 5px;">
            <strong>Products API Test</strong> (${new Date().toLocaleTimeString()})
        </div>`;
        
        try {
            // Add cache busting
            const bustUrl = `/api/products?_=${Date.now()}`;
            const response = await fetch(bustUrl);
            const success = response.ok;
            const status = `${response.status} ${response.statusText}`;
            
            if (success) {
                const data = await response.json();
                const activeProducts = data.filter(p => p.isActive === true);
                const inactiveProducts = data.filter(p => p.isActive === false);
                
                logElement.innerHTML += `<div style="margin-left: 10px; margin-top: 5px;">
                    <span style="color: green;">
                        /api/products: Success (${status})
                    </span><br>
                    <span>Total products: ${data.length}</span><br>
                    <span>Active products: ${activeProducts.length}</span><br>
                    <span>Inactive products: ${inactiveProducts.length}</span><br>
                    <details>
                        <summary>Active Product IDs</summary>
                        <pre style="max-height: 100px; overflow-y: auto;">${JSON.stringify(activeProducts.map(p => ({ id: p.id, name: p.name })), null, 2)}</pre>
                    </details>
                </div>`;
            } else {
                logElement.innerHTML += `<div style="margin-left: 10px; margin-top: 5px;">
                    <span style="color: red;">
                        /api/products: Failed (${status})
                    </span>
                </div>`;
            }
        } catch (error) {
            logElement.innerHTML += `<div style="margin-left: 10px; margin-top: 5px; color: red;">
                /api/products: Error - ${error.message}
            </div>`;
        }
        
        logElement.scrollTop = logElement.scrollHeight;
    }
    
    // Setup API debugger on admin pages
    if (window.location.pathname.includes('/admin')) {
        setupApiDebugger();
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
    if (typeof $.fn.DataTable !== 'undefined') {
        // DataTable initialization moved to admin-datatables.js
    }

    // Initialize tooltips
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Tooltip !== 'undefined') {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    // Mark active nav item based on current URL
    const currentPath = window.location.pathname.toLowerCase();
    document.querySelectorAll('.sb-sidenav-menu .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (
            currentPath === href.toLowerCase() || 
            (currentPath.includes('/admin/') && href.toLowerCase().includes('/admin/') && 
             currentPath.split('/')[2] === href.toLowerCase().split('/')[2])
        )) {
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
