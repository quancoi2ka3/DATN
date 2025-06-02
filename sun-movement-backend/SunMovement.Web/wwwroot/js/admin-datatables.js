// Initialize DataTables for all admin tables
$(document).ready(function() {
    // Only initialize DataTables on tables that specifically have the 'datatable' class
    $('.datatable').each(function() {
        if (!$.fn.DataTable.isDataTable(this)) {
            var tableId = $(this).attr('id');
            var defaultConfig = {
                responsive: true,
                language: {
                    search: "Search:",
                    searchPlaceholder: "Search...",
                    lengthMenu: "Show _MENU_ entries",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoEmpty: "Showing 0 to 0 of 0 entries",
                    infoFiltered: "(filtered from _MAX_ total entries)",
                    paginate: {
                        first: "First",
                        previous: "Previous", 
                        next: "Next",
                        last: "Last"
                    }
                },
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
            };

            // Table-specific configurations
            if (tableId === 'paymentsTable') {
                defaultConfig.order = [[4, 'desc']]; // Order by date column descending
            }

            $(this).DataTable(defaultConfig);
        }
    });
});
