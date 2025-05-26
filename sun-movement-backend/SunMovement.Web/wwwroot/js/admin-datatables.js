// Initialize DataTables for all admin tables
$(document).ready(function() {
    // Apply DataTables to all tables with the datatable class
    $('.table').addClass('datatable');

    // Ensure DataTables is always responsive
    $('.datatable').each(function() {
        if (!$.fn.DataTable.isDataTable(this)) {
            $(this).DataTable({
                responsive: true
            });
        }
    });
});
