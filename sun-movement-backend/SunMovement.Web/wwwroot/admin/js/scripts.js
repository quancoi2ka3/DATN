// Admin scripts
window.addEventListener('DOMContentLoaded', event => {
    // Toggle the side navigation
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        // Add event listener
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.querySelector('#sidebar-wrapper').classList.toggle('active');
        });
    }

    // Highlight active menu item
    const path = window.location.pathname;
    const activateMenuItem = () => {
        const menuItems = document.querySelectorAll('#sidebar-wrapper a.list-group-item');
        menuItems.forEach(item => {
            if (item.getAttribute('href') === path) {
                item.classList.add('active');
            }
        });
    };
    activateMenuItem();

    // Initialize any data tables if the plugin exists
    if (typeof $.fn.DataTable !== 'undefined') {
        $('.admin-data-table').DataTable({
            responsive: true
        });
    }

    // Initialize any tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    if (tooltipTriggerList.length) {
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    }

    // Enhance form controls
    const enhanceFormControls = () => {
        // Convert selects to select2 if available
        if (typeof $.fn.select2 !== 'undefined') {
            $('.select2-enable').select2({
                theme: 'bootstrap-5'
            });
        }
    };
    enhanceFormControls();
});
