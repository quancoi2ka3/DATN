/*
POPUP ERROR NOTIFICATION FIX - COMPLETE SOLUTION
================================================

ISSUE: Registration form errors only appear in browser console instead of popup notifications
SOLUTION: Enhanced error handling with guaranteed popup display and fallback system

Apply these changes to: sun-movement-backend/SunMovement.Web/Views/Account/Register.cshtml
*/

// 1. ENHANCED FORM SUBMISSION HANDLER (Replace existing form submit handler)
$('form').on('submit', function(e) {
    e.preventDefault();
    
    const form = $(this);
    const submitBtn = form.find('button[type="submit"]');
    const originalBtnText = submitBtn.html();
    
    // Show loading state
    submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...');
    
    // Clear previous error highlights
    $('.form-control.error').removeClass('error');
    
    // CLIENT-SIDE VALIDATION FIRST - KEY FIX #1
    let isValid = true;
    let errorMessages = [];
    
    // Validate required fields
    form.find('input[required]').each(function() {
        if (!$(this).val().trim()) {
            $(this).addClass('error');
            isValid = false;
            errorMessages.push($(this).attr('name') + ' là bắt buộc');
        }
    });
    
    // Validate password requirements
    const password = $('#Password').val();
    if (password && password.length < 8) {
        $('#Password').addClass('error');
        isValid = false;
        errorMessages.push('Mật khẩu phải có ít nhất 8 ký tự');
    }
    
    // IMMEDIATE POPUP FOR CLIENT VALIDATION - KEY FIX #2
    if (!isValid) {
        submitBtn.prop('disabled', false).html(originalBtnText);
        
        // Show popup notification for validation errors
        if (window.AuthNotifications && window.AuthNotifications.showError) {
            window.AuthNotifications.showError(
                'Lỗi Thông Tin Đăng Ký',
                'Vui lòng kiểm tra và điền đầy đủ thông tin bắt buộc',
                {
                    duration: 5000,
                    details: errorMessages.join('\n')
                }
            );
        } else {
            // FALLBACK ALERT - KEY FIX #3
            alert('❌ Lỗi Thông Tin Đăng Ký:\n\n' + errorMessages.join('\n'));
        }
        return; // STOP HERE - don't send AJAX
    }
    
    // Continue with AJAX only if validation passes
    const formData = new FormData(this);
    
    $.ajax({
        url: form.attr('action'),
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            // Show success notification
            if (window.AuthNotifications && window.AuthNotifications.showSuccess) {
                window.AuthNotifications.showSuccess(
                    'Đăng Ký Thành Công!',
                    'Tài khoản của bạn đã được tạo thành công. Chào mừng bạn đến với Sun Movement!',
                    {
                        duration: 5000,
                        onClick: function() {
                            window.location.href = '/';
                        }
                    }
                );
            } else {
                alert('✅ Đăng Ký Thành Công!\n\nTài khoản của bạn đã được tạo thành công. Chào mừng bạn đến với Sun Movement!');
            }
            
            // Redirect after short delay
            setTimeout(function() {
                window.location.href = '/';
            }, 2000);
        },
        
        // 2. ENHANCED ERROR HANDLER - KEY FIX #4
        error: function(xhr, status, error) {
            // ENHANCED ERROR LOGGING
            console.log('❌ AJAX Error occurred:', {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText,
                error: error
            });
            
            let errorResponse = null;
            let errorMessage = 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.';
            
            // IMPROVED ERROR PARSING - KEY FIX #5
            try {
                if (xhr.responseText && xhr.responseText.trim().startsWith('{')) {
                    errorResponse = JSON.parse(xhr.responseText);
                    console.log('✅ Parsed JSON error response:', errorResponse);
                } else {
                    console.log('⚠️ Non-JSON response received, parsing HTML...');
                    
                    // Handle non-JSON responses (like HTML error pages)
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = xhr.responseText;
                    var errorText = tempDiv.textContent || tempDiv.innerText || '';
                    
                    // Extract specific error messages
                    if (errorText.includes('Password') || errorText.includes('password')) {
                        errorMessage = 'Mật khẩu không đáp ứng yêu cầu bảo mật:\n• Ít nhất 8 ký tự\n• Có chữ hoa và chữ thường\n• Có số và ký tự đặc biệt';
                    } else if (errorText.includes('Email') || errorText.includes('email')) {
                        errorMessage = 'Email không hợp lệ hoặc đã được sử dụng.';
                    } else if (xhr.status === 400) {
                        errorMessage = 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại tất cả các trường.';
                    }
                    
                    errorResponse = {
                        message: errorMessage,
                        status: xhr.status,
                        errors: [errorMessage]
                    };
                }
            } catch (e) {
                console.log('❌ Error parsing response:', e);
                errorResponse = {
                    message: errorMessage,
                    status: xhr.status,
                    errors: [errorMessage]
                };
            }
            
            // ALWAYS SHOW POPUP NOTIFICATION - KEY FIX #6
            if (xhr.status === 400) {
                // Validation errors - show detailed popup
                var popupTitle = 'Lỗi Thông Tin Đăng Ký';
                var popupMessage = errorResponse.message || errorMessage;
                var popupDetails = '';
                
                if (errorResponse && errorResponse.errors) {
                    if (Array.isArray(errorResponse.errors)) {
                        popupDetails = errorResponse.errors.join('\n• ');
                    } else if (typeof errorResponse.errors === 'object') {
                        // Handle ModelState errors from ASP.NET Core
                        var errorList = [];
                        for (var key in errorResponse.errors) {
                            if (errorResponse.errors[key] && Array.isArray(errorResponse.errors[key])) {
                                errorList = errorList.concat(errorResponse.errors[key]);
                            }
                        }
                        popupDetails = errorList.join('\n• ');
                    }
                }
                
                // SHOW POPUP WITH FALLBACK - KEY FIX #7
                if (window.AuthNotifications && window.AuthNotifications.showError) {
                    window.AuthNotifications.showError(
                        popupTitle,
                        popupMessage,
                        {
                            duration: 10000,
                            details: popupDetails ? '• ' + popupDetails : 'Vui lòng kiểm tra lại tất cả các trường.'
                        }
                    );
                } else {
                    // FALLBACK ALERT if notification system fails
                    var alertMsg = '❌ ' + popupTitle + ':\n\n' + popupMessage;
                    if (popupDetails) {
                        alertMsg += '\n\nChi tiết:\n• ' + popupDetails;
                    }
                    alert(alertMsg);
                }
            } else if (xhr.status === 409) {
                // Conflict (e.g., email already exists)
                if (window.AuthNotifications && window.AuthNotifications.showError) {
                    window.AuthNotifications.showError(
                        'Email Đã Tồn Tại',
                        'Email này đã được sử dụng. Vui lòng sử dụng email khác.',
                        {
                            duration: 8000,
                            onClick: function() {
                                window.location.href = '/Account/Login';
                            }
                        }
                    );
                } else {
                    alert('❌ Email Đã Tồn Tại:\n\nEmail này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.');
                }
            } else if (xhr.status >= 500) {
                // Server errors
                if (window.AuthNotifications && window.AuthNotifications.showError) {
                    window.AuthNotifications.showError(
                        'Lỗi Hệ Thống',
                        'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau ít phút.',
                        {
                            duration: 10000,
                            persistent: false
                        }
                    );
                } else {
                    alert('❌ Lỗi Hệ Thống:\n\nĐã xảy ra lỗi máy chủ. Vui lòng thử lại sau ít phút.');
                }
            } else {
                // General errors - ALWAYS show popup
                if (window.AuthNotifications && window.AuthNotifications.showError) {
                    window.AuthNotifications.showError(
                        'Lỗi Đăng Ký',
                        errorResponse.message || errorMessage,
                        {
                            duration: 8000,
                            details: xhr.status ? 'Mã lỗi: ' + xhr.status : 'Vui lòng thử lại sau.'
                        }
                    );
                } else {
                    alert('❌ Lỗi Đăng Ký:\n\n' + (errorResponse.message || errorMessage) + '\n\n' + (xhr.status ? 'Mã lỗi: ' + xhr.status : 'Vui lòng thử lại sau.'));
                }
            }
            
            // Re-enable submit button
            submitBtn.prop('disabled', false).html(originalBtnText);
        }
    });
});

// 3. ENHANCED NOTIFICATION SYSTEM INITIALIZATION - KEY FIX #8
$(document).ready(function() {
    // Wait for notification system to load and initialize properly
    setTimeout(function() {
        if (!window.AuthNotifications) {
            console.error('⚠️ Notification system not loaded! Creating fallback...');
            
            // CREATE FALLBACK NOTIFICATION SYSTEM
            window.AuthNotifications = {
                showError: function(title, message, options) {
                    var alertMsg = '❌ ' + title + ':\n\n' + message;
                    if (options && options.details) {
                        alertMsg += '\n\n' + options.details;
                    }
                    alert(alertMsg);
                },
                showSuccess: function(title, message, options) {
                    alert('✅ ' + title + ':\n\n' + message);
                },
                showWarning: function(title, message, options) {
                    alert('⚠️ ' + title + ':\n\n' + message);
                },
                handleRegistrationError: function(errorResponse) {
                    var errorMsg = '❌ Lỗi đăng ký:\n\n';
                    if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
                        errorMsg += errorResponse.errors.join('\n');
                    } else {
                        errorMsg += errorResponse.message || 'Vui lòng kiểm tra lại thông tin.';
                    }
                    alert(errorMsg);
                }
            };
        } else {
            console.log('✅ Notification system loaded successfully');
        }
    }, 100);
});

/*
SUMMARY OF KEY FIXES:
=====================

1. Client-side validation BEFORE AJAX request
2. Immediate popup for validation errors  
3. Fallback alert system if notification library fails
4. Enhanced AJAX error handler with better logging
5. Improved error response parsing (JSON + HTML)
6. ALWAYS show popup notifications for ALL error types
7. Multiple fallback layers to ensure errors are NEVER silent
8. Enhanced notification system initialization with fallback

RESULT: Users will ALWAYS see popup notifications instead of console-only errors!
*/
