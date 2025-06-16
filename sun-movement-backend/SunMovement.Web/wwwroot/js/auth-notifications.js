/**
 * Authentication Error Popup Notification System
 * Provides beautiful, user-friendly popup notifications for authentication errors
 * in Vietnamese language for the Sun Movement application
 */

class AuthNotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.defaultDuration = 8000; // 8 seconds
        this.maxNotifications = 3;
        this.init();
    }

    /**
     * Initialize the notification system
     */
    init() {
        // Create notification container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'auth-notification-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-label', 'Thông báo xác thực');
            document.body.appendChild(this.container);
        }

        // Load CSS if not already loaded
        this.loadCSS();
    }

    /**
     * Load notification CSS
     */
    loadCSS() {
        const existingLink = document.querySelector('link[href*="auth-notifications.css"]');
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/auth-notifications.css';
            document.head.appendChild(link);
        }
    }

    /**
     * Show an error notification
     * @param {string} title - Notification title
     * @param {string} message - Main message
     * @param {Object} options - Additional options
     */
    showError(title, message, options = {}) {
        return this.show('error', title, message, options);
    }

    /**
     * Show a success notification
     * @param {string} title - Notification title
     * @param {string} message - Main message
     * @param {Object} options - Additional options
     */
    showSuccess(title, message, options = {}) {
        return this.show('success', title, message, options);
    }

    /**
     * Show a warning notification
     * @param {string} title - Notification title
     * @param {string} message - Main message
     * @param {Object} options - Additional options
     */
    showWarning(title, message, options = {}) {
        return this.show('warning', title, message, options);
    }

    /**
     * Show an info notification
     * @param {string} title - Notification title
     * @param {string} message - Main message
     * @param {Object} options - Additional options
     */
    showInfo(title, message, options = {}) {
        return this.show('info', title, message, options);
    }

    /**
     * Main notification display method
     * @param {string} type - Notification type (error, success, warning, info)
     * @param {string} title - Notification title
     * @param {string} message - Main message
     * @param {Object} options - Additional options
     */
    show(type, title, message, options = {}) {
        const {
            duration = this.defaultDuration,
            persistent = false,
            details = null,
            errors = null,
            fieldErrors = null,
            onClick = null,
            onClose = null
        } = options;

        // Limit number of notifications
        if (this.notifications.size >= this.maxNotifications) {
            const oldestId = this.notifications.keys().next().value;
            this.remove(oldestId);
        }

        const id = this.generateId();
        const notification = this.createNotificationElement(id, type, title, message, {
            details,
            errors,
            fieldErrors,
            persistent,
            onClick,
            onClose
        });

        this.notifications.set(id, {
            element: notification,
            type,
            title,
            message,
            timeout: null
        });

        this.container.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Highlight form fields with errors
        if (fieldErrors) {
            this.highlightFieldErrors(fieldErrors);
        }

        // Auto-dismiss if not persistent
        if (!persistent && duration > 0) {
            this.setAutoDismiss(id, duration);
        }

        // Announce to screen readers
        this.announceToScreenReader(type, title, message);

        return id;
    }

    /**
     * Create notification DOM element
     */
    createNotificationElement(id, type, title, message, options) {
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.setAttribute('data-id', id);
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-labelledby', `notification-title-${id}`);
        notification.setAttribute('aria-describedby', `notification-message-${id}`);

        const icon = this.getIcon(type);
        const closeButton = `
            <button class="auth-notification-close" aria-label="Đóng thông báo" data-close="${id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        let detailsHtml = '';
        if (options.details) {
            detailsHtml += `<div class="auth-notification-details">${options.details}</div>`;
        }

        if (options.errors && Array.isArray(options.errors)) {
            const errorList = options.errors.map(error => `<li>${error}</li>`).join('');
            detailsHtml += `
                <div class="auth-notification-details">
                    <strong>Chi tiết lỗi:</strong>
                    <ul>${errorList}</ul>
                </div>
            `;
        }

        notification.innerHTML = `
            <div class="auth-notification-header">
                <div class="auth-notification-title" id="notification-title-${id}">
                    <span class="auth-notification-icon">${icon}</span>
                    ${title}
                </div>
                ${closeButton}
            </div>
            <div class="auth-notification-message" id="notification-message-${id}">
                ${message}
            </div>
            ${detailsHtml}
            <div class="auth-notification-progress"></div>
        `;

        // Add event listeners
        const closeBtn = notification.querySelector('[data-close]');
        closeBtn.addEventListener('click', () => this.remove(id));

        if (options.onClick) {
            notification.style.cursor = 'pointer';
            notification.addEventListener('click', (e) => {
                if (!e.target.closest('[data-close]')) {
                    options.onClick();
                }
            });
        }

        return notification;
    }

    /**
     * Get icon for notification type
     */
    getIcon(type) {
        const icons = {
            error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
            success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#17a2b8" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`
        };
        return icons[type] || icons.info;
    }

    /**
     * Set auto-dismiss timer
     */
    setAutoDismiss(id, duration) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const progressBar = notification.element.querySelector('.auth-notification-progress');
        if (progressBar) {
            progressBar.style.transition = `transform ${duration}ms linear`;
            progressBar.style.transform = 'scaleX(0)';
        }

        notification.timeout = setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    /**
     * Remove notification
     */
    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        // Clear timeout
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }

        // Add removing animation
        notification.element.classList.add('removing');

        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            this.notifications.delete(id);
        }, 300);
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        this.notifications.forEach((_, id) => {
            this.remove(id);
        });
    }

    /**
     * Highlight form fields with errors
     */
    highlightFieldErrors(fieldErrors) {
        // Clear existing error highlights
        document.querySelectorAll('.form-control.error').forEach(field => {
            field.classList.remove('error');
        });

        // Add error highlights
        Object.keys(fieldErrors).forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
            if (field) {
                field.classList.add('error');
                
                // Remove error highlighting when user starts typing
                const removeError = () => {
                    field.classList.remove('error');
                    field.removeEventListener('input', removeError);
                    field.removeEventListener('change', removeError);
                };
                
                field.addEventListener('input', removeError);
                field.addEventListener('change', removeError);
            }
        });
    }

    /**
     * Announce notification to screen readers
     */
    announceToScreenReader(type, title, message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `${title}: ${message}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'auth-notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Handle API authentication errors
     */
    handleApiError(response, customMessages = {}) {
        if (!response || typeof response !== 'object') {
            this.showError(
                'Lỗi Hệ Thống',
                'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.',
                { persistent: false }
            );
            return;
        }

        const { message, errors, details } = response;
        
        // Use custom message if provided
        const errorTitle = customMessages.title || 'Lỗi Xác Thực';
        const errorMessage = customMessages.message || message || 'Đã xảy ra lỗi trong quá trình xử lý.';
        
        // Format field errors
        let fieldErrors = null;
        let errorList = null;
        
        if (errors && Array.isArray(errors)) {
            errorList = errors.map(error => {
                if (typeof error === 'string') return error;
                if (error.Description) return error.Description;
                if (error.Errors) return error.Errors.join(', ');
                return JSON.stringify(error);
            });
        } else if (errors && typeof errors === 'object') {
            fieldErrors = {};
            errorList = [];
            
            Object.keys(errors).forEach(field => {
                const fieldError = errors[field];
                if (Array.isArray(fieldError)) {
                    fieldErrors[field] = fieldError.join(', ');
                    errorList.push(`${field}: ${fieldError.join(', ')}`);
                } else {
                    fieldErrors[field] = fieldError;
                    errorList.push(`${field}: ${fieldError}`);
                }
            });
        }

        // Show notification
        this.showError(errorTitle, errorMessage, {
            errors: errorList,
            fieldErrors: fieldErrors,
            details: details,
            duration: 10000, // Longer duration for errors
            persistent: false
        });
    }

    /**
     * Handle registration errors specifically
     */
    handleRegistrationError(response) {
        const customMessages = {
            title: 'Lỗi Đăng Ký',
            message: 'Không thể hoàn tất đăng ký. Vui lòng kiểm tra thông tin và thử lại.'
        };
        this.handleApiError(response, customMessages);
    }

    /**
     * Handle login errors specifically
     */
    handleLoginError(response) {
        const customMessages = {
            title: 'Lỗi Đăng Nhập',
            message: 'Không thể đăng nhập. Vui lòng kiểm tra email và mật khẩu.'
        };
        this.handleApiError(response, customMessages);
    }

    /**
     * Handle email verification errors specifically
     */
    handleVerificationError(response) {
        const customMessages = {
            title: 'Lỗi Xác Thực Email',
            message: 'Không thể xác thực email. Vui lòng kiểm tra mã xác thực.'
        };
        this.handleApiError(response, customMessages);
    }
}

// Create global instance
window.AuthNotifications = new AuthNotificationSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthNotificationSystem;
}
