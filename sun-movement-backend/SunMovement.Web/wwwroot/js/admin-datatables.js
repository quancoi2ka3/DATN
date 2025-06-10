// Initialize DataTables for all admin tables
$(document).ready(function() {
    // Only initialize DataTables on tables that specifically have the 'datatable' class
    $('.datatable').each(function() {
        if (!$.fn.DataTable.isDataTable(this)) {
            var tableId = $(this).attr('id');
            var defaultConfig = {
                responsive: true,
                language: {
                    "emptyTable": "Không có dữ liệu",
                    "info": "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
                    "infoEmpty": "Hiển thị 0 đến 0 của 0 mục",
                    "infoFiltered": "(lọc từ _MAX_ mục)",
                    "infoPostFix": "",
                    "thousands": ".",
                    "lengthMenu": "Hiển thị _MENU_ mục",
                    "loadingRecords": "Đang tải...",
                    "processing": "Đang xử lý...",
                    "search": "Tìm kiếm:",
                    "zeroRecords": "Không tìm thấy kết quả phù hợp",
                    "paginate": {
                        "first": "Đầu",
                        "last": "Cuối",
                        "next": "Tiếp",
                        "previous": "Trước"
                    },
                    "aria": {
                        "sortAscending": ": kích hoạt để sắp xếp cột tăng dần",
                        "sortDescending": ": kích hoạt để sắp xếp cột giảm dần"
                    }
                },
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
            };

            // Table-specific configurations
            if (tableId === 'paymentsTable') {
                defaultConfig.order = [[4, 'desc']]; // Order by date column descending
            }
            else if (tableId === 'servicesTable' || tableId === 'productsTable') {
                // Set Vietnamese language for products and services tables
                defaultConfig.language = {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json'
                };
            }

            $(this).DataTable(defaultConfig);
        }
    });
});
