// Enhanced admin functionality
$(document).ready(function() {
    // DataTable initialization is now handled by admin-datatables.js
    // This file focuses on other enhancements

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
