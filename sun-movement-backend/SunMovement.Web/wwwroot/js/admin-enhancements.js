// Enhanced admin functionality
$(document).ready(function() {
    // Initialize DataTables with enhanced options
    if ($.fn.DataTable) {
        $('.datatable').DataTable({
            responsive: true,
            language: {
                search: "<i class='fas fa-search'></i>",
                searchPlaceholder: "Search...",
                lengthMenu: "Show _MENU_ entries",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                infoEmpty: "Showing 0 to 0 of 0 entries",
                infoFiltered: "(filtered from _MAX_ total entries)",
                paginate: {
                    first: "<i class='fas fa-angle-double-left'></i>",
                    previous: "<i class='fas fa-angle-left'></i>",
                    next: "<i class='fas fa-angle-right'></i>",
                    last: "<i class='fas fa-angle-double-right'></i>"
                }
            },
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
            dom: '<"top"fl>rt<"bottom"ip><"clear">',
            drawCallback: function() {
                // Add tooltips to action buttons after table draws
                $('[data-bs-toggle="tooltip"]').tooltip();
            }
        });
    }

    // Initialize Select2 for enhanced dropdowns if available
    if ($.fn.select2) {
        $('.select2').select2({
            theme: 'bootstrap-5'
        });
    }

    // File input previews
    $('.custom-file-input').on('change', function() {
        var fileName = $(this).val().split('\\').pop();
        $(this).siblings('.custom-file-label').addClass('selected').html(fileName);
        
        // Show image preview if it's an image
        var fileInput = this;
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var previewContainer = $(fileInput).closest('.form-group').find('.image-preview');
                if (previewContainer.length) {
                    previewContainer.attr('src', e.target.result);
                } else {
                    $('<img class="image-preview img-fluid rounded mt-2" src="' + e.target.result + '">').insertAfter($(fileInput).closest('.custom-file'));
                }
            }
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    // Confirmation dialogs
    $('[data-confirm]').on('click', function(e) {
        if (!confirm($(this).data('confirm'))) {
            e.preventDefault();
        }
    });

    // Card actions toggle
    $('.card-header-action').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.card').find('.card-body').slideToggle();
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
    });

    // Form validation feedback
    $('form').submit(function() {
        $(this).find(':input').filter(function() {
            return !this.value;
        }).closest('.form-group').addClass('was-validated');
    });

    // Rich text editor initialization if available
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '.richtext',
            height: 300,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
    }
});
