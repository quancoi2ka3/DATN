@echo off
echo =====================================================
echo    XÓA CÁC FILE .BAT KHÔNG CẦN THIẾT
echo =====================================================
echo.

:: Thiết lập màu sắc
color 0E

echo [CẢNH BÁO] Script này sẽ xóa các file .bat không cần thiết.
echo Các file cần giữ lại được liệt kê trong KEEP_BAT_FILES.md
echo Các file sẽ xóa được liệt kê trong DELETE_BAT_FILES.md
echo.
echo Vui lòng kiểm tra danh sách trước khi tiếp tục.
echo.
echo Tiếp tục thực hiện dọn dẹp? (Nhấn Y để tiếp tục hoặc N để thoát)
choice /c YN /m "Lựa chọn của bạn"
if %errorlevel% equ 2 (
    echo Bạn đã chọn không tiếp tục. Thoát script.
    exit /b
)

echo.
echo [BƯỚC 1] Di chuyển các file .bat quan trọng sang thư mục an toàn...
echo ----------------------------------------------
echo.

if not exist "d:\DATN\DATN\important_bat_files" (
    mkdir "d:\DATN\DATN\important_bat_files"
    echo Đã tạo thư mục important_bat_files
)

:: Di chuyển các file quan trọng
echo Đang sao lưu các file quan trọng...

:: Khởi động và dừng hệ thống
copy "d:\DATN\DATN\start-full-system.bat" "d:\DATN\DATN\important_bat_files\" >nul
copy "d:\DATN\DATN\stop-all-services.bat" "d:\DATN\DATN\important_bat_files\" >nul
copy "d:\DATN\DATN\restart-specific-service.bat" "d:\DATN\DATN\important_bat_files\" >nul

:: Quản lý chatbot
copy "d:\DATN\DATN\start-action-server.bat" "d:\DATN\DATN\important_bat_files\" >nul
copy "d:\DATN\DATN\train-vietnamese-chatbot.bat" "d:\DATN\DATN\important_bat_files\" >nul
copy "d:\DATN\DATN\create-dummy-data.bat" "d:\DATN\DATN\important_bat_files\" >nul
copy "d:\DATN\DATN\test-vietnamese-chatbot-advanced.bat" "d:\DATN\DATN\important_bat_files\" >nul

:: Khởi động thành phần riêng lẻ
copy "d:\DATN\DATN\start-backend-server.bat" "d:\DATN\DATN\important_bat_files\" >nul
copy "d:\DATN\DATN\check-system-status.bat" "d:\DATN\DATN\important_bat_files\" >nul

:: Hỗ trợ quan trọng
copy "d:\DATN\DATN\fix-rasa-503-error.bat" "d:\DATN\DATN\important_bat_files\" >nul
copy "d:\DATN\DATN\check-rasa-status.bat" "d:\DATN\DATN\important_bat_files\" >nul

echo [OK] Đã sao lưu các file quan trọng.
echo.

echo [BƯỚC 2] Xóa các file .bat không cần thiết...
echo ----------------------------------------------
echo.

:: Xóa các file test không còn cần thiết
echo Đang xóa các file test không cần thiết...
if exist "d:\DATN\DATN\admin-system-full-test.bat" del "d:\DATN\DATN\admin-system-full-test.bat"
if exist "d:\DATN\DATN\analyze-lazy-loading.bat" del "d:\DATN\DATN\analyze-lazy-loading.bat"
if exist "d:\DATN\DATN\build-and-test.bat" del "d:\DATN\DATN\build-and-test.bat"
if exist "d:\DATN\DATN\check-chatbot-conflicts.bat" del "d:\DATN\DATN\check-chatbot-conflicts.bat"
if exist "d:\DATN\DATN\check-database-schema.bat" del "d:\DATN\DATN\check-database-schema.bat"
if exist "d:\DATN\DATN\check-product-stock.bat" del "d:\DATN\DATN\check-product-stock.bat"
if exist "d:\DATN\DATN\clear-cache-and-test.bat" del "d:\DATN\DATN\clear-cache-and-test.bat"
if exist "d:\DATN\DATN\comprehensive-admin-test.bat" del "d:\DATN\DATN\comprehensive-admin-test.bat"
if exist "d:\DATN\DATN\conflict-resolution-test.bat" del "d:\DATN\DATN\conflict-resolution-test.bat"
if exist "d:\DATN\DATN\debug-rasa-setup.bat" del "d:\DATN\DATN\debug-rasa-setup.bat"
if exist "d:\DATN\DATN\debug-toastr-issue.bat" del "d:\DATN\DATN\debug-toastr-issue.bat"
if exist "d:\DATN\DATN\demo-article-system.bat" del "d:\DATN\DATN\demo-article-system.bat"
if exist "d:\DATN\DATN\diagnose-rasa-connection.bat" del "d:\DATN\DATN\diagnose-rasa-connection.bat"
if exist "d:\DATN\DATN\frontend-cleanup-automation.bat" del "d:\DATN\DATN\frontend-cleanup-automation.bat"
if exist "d:\DATN\DATN\frontend-structure-analysis.bat" del "d:\DATN\DATN\frontend-structure-analysis.bat"
if exist "d:\DATN\DATN\FORCE-CSS-TEST.bat" del "d:\DATN\DATN\FORCE-CSS-TEST.bat"
if exist "d:\DATN\DATN\get-all-products.bat" del "d:\DATN\DATN\get-all-products.bat"
if exist "d:\DATN\DATN\kill-rasa-processes.bat" del "d:\DATN\DATN\kill-rasa-processes.bat"
if exist "d:\DATN\DATN\minimal-rasa-test.bat" del "d:\DATN\DATN\minimal-rasa-test.bat"
if exist "d:\DATN\DATN\post-cleanup-verification.bat" del "d:\DATN\DATN\post-cleanup-verification.bat"
if exist "d:\DATN\DATN\quick-conversation-test.bat" del "d:\DATN\DATN\quick-conversation-test.bat"
if exist "d:\DATN\DATN\quick-fix-and-train.bat" del "d:\DATN\DATN\quick-fix-and-train.bat"
if exist "d:\DATN\DATN\quick-lazy-test.bat" del "d:\DATN\DATN\quick-lazy-test.bat"
if exist "d:\DATN\DATN\quick-lazy-verification.bat" del "d:\DATN\DATN\quick-lazy-verification.bat"
if exist "d:\DATN\DATN\quick-rasa-check.bat" del "d:\DATN\DATN\quick-rasa-check.bat"
if exist "d:\DATN\DATN\quick-start-admin.bat" del "d:\DATN\DATN\quick-start-admin.bat"
if exist "d:\DATN\DATN\quick-train-and-test.bat" del "d:\DATN\DATN\quick-train-and-test.bat"
if exist "d:\DATN\DATN\run-validation.bat" del "d:\DATN\DATN\run-validation.bat"
if exist "d:\DATN\DATN\safe-retrain-model.bat" del "d:\DATN\DATN\safe-retrain-model.bat"
if exist "d:\DATN\DATN\test-admin-vietnamese.bat" del "d:\DATN\DATN\test-admin-vietnamese.bat"
if exist "d:\DATN\DATN\test-all-lazy-fixes.bat" del "d:\DATN\DATN\test-all-lazy-fixes.bat"
if exist "d:\DATN\DATN\test-backend-endpoints.ps1" del "d:\DATN\DATN\test-backend-endpoints.ps1"
if exist "d:\DATN\DATN\test-chatbot-api-endpoint.bat" del "d:\DATN\DATN\test-chatbot-api-endpoint.bat"
if exist "d:\DATN\DATN\test-chatbot-scenarios.bat" del "d:\DATN\DATN\test-chatbot-scenarios.bat"
if exist "d:\DATN\DATN\test-completed-system.bat" del "d:\DATN\DATN\test-completed-system.bat"
if exist "d:\DATN\DATN\test-contact-form.bat" del "d:\DATN\DATN\test-contact-form.bat"
if exist "d:\DATN\DATN\test-cost-price-feature.bat" del "d:\DATN\DATN\test-cost-price-feature.bat"
if exist "d:\DATN\DATN\test-database-schema.bat" del "d:\DATN\DATN\test-database-schema.bat"
if exist "d:\DATN\DATN\test-enhanced-features.bat" del "d:\DATN\DATN\test-enhanced-features.bat"
if exist "d:\DATN\DATN\test-enhanced-performance.bat" del "d:\DATN\DATN\test-enhanced-performance.bat"
if exist "d:\DATN\DATN\test-fixed-version.bat" del "d:\DATN\DATN\test-fixed-version.bat"
if exist "d:\DATN\DATN\test-gmail-email.bat" del "d:\DATN\DATN\test-gmail-email.bat"
if exist "d:\DATN\DATN\test-lazy-loading-complete.bat" del "d:\DATN\DATN\test-lazy-loading-complete.bat"
if exist "d:\DATN\DATN\test-lazy-loading-performance.bat" del "d:\DATN\DATN\test-lazy-loading-performance.bat"
if exist "d:\DATN\DATN\test-optimizations.bat" del "d:\DATN\DATN\test-optimizations.bat"
if exist "d:\DATN\DATN\test-toastr-validation.bat" del "d:\DATN\DATN\test-toastr-validation.bat"
if exist "d:\DATN\DATN\test-visual-improvements.bat" del "d:\DATN\DATN\test-visual-improvements.bat"
if exist "d:\DATN\DATN\toastr-validation-final-fix.bat" del "d:\DATN\DATN\toastr-validation-final-fix.bat"
if exist "d:\DATN\DATN\validate-stories-structure.bat" del "d:\DATN\DATN\validate-stories-structure.bat"

echo [OK] Đã xóa các file test không cần thiết.
echo.

:: Xóa các file khởi động trùng lặp
echo Đang xóa các file khởi động trùng lặp...
if exist "d:\DATN\DATN\start-backend-enhanced.bat" del "d:\DATN\DATN\start-backend-enhanced.bat"
if exist "d:\DATN\DATN\start-enhanced-frontend.bat" del "d:\DATN\DATN\start-enhanced-frontend.bat"
if exist "d:\DATN\DATN\start-fixed-rasa-chatbot.bat" del "d:\DATN\DATN\start-fixed-rasa-chatbot.bat"
if exist "d:\DATN\DATN\start-improved-chatbot.bat" del "d:\DATN\DATN\start-improved-chatbot.bat"
if exist "d:\DATN\DATN\start-rasa-only.bat" del "d:\DATN\DATN\start-rasa-only.bat"
if exist "d:\DATN\DATN\start-rasa-with-logging.bat" del "d:\DATN\DATN\start-rasa-with-logging.bat"
if exist "d:\DATN\DATN\start-simple-chatbot.bat" del "d:\DATN\DATN\start-simple-chatbot.bat"
if exist "d:\DATN\DATN\start-system-port-5001.bat" del "d:\DATN\DATN\start-system-port-5001.bat"
if exist "d:\DATN\DATN\start-website-with-chatbot.bat" del "d:\DATN\DATN\start-website-with-chatbot.bat"
if exist "d:\DATN\DATN\start-website-with-chatbot-advanced.bat" del "d:\DATN\DATN\start-website-with-chatbot-advanced.bat"
if exist "d:\DATN\DATN\safe-start-backend.bat" del "d:\DATN\DATN\safe-start-backend.bat"
if exist "d:\DATN\DATN\safe-start-frontend.bat" del "d:\DATN\DATN\safe-start-frontend.bat"
if exist "d:\DATN\DATN\safe-website-start.bat" del "d:\DATN\DATN\safe-website-start.bat"

echo [OK] Đã xóa các file khởi động trùng lặp.
echo.

:: Xóa các file train chatbot trùng lặp
echo Đang xóa các file train chatbot trùng lặp...
if exist "d:\DATN\DATN\stop-and-retrain-rasa.bat" del "d:\DATN\DATN\stop-and-retrain-rasa.bat"
if exist "d:\DATN\DATN\stop-and-train-rasa.bat" del "d:\DATN\DATN\stop-and-train-rasa.bat"
if exist "d:\DATN\DATN\stop-rasa-before-train.bat" del "d:\DATN\DATN\stop-rasa-before-train.bat"
if exist "d:\DATN\DATN\stop-rasa-processes.bat" del "d:\DATN\DATN\stop-rasa-processes.bat"
if exist "d:\DATN\DATN\train-and-start-rasa.bat" del "d:\DATN\DATN\train-and-start-rasa.bat"
if exist "d:\DATN\DATN\fix-rasa-environment.bat" del "d:\DATN\DATN\fix-rasa-environment.bat"
if exist "d:\DATN\DATN\fix-stories-and-validate.bat" del "d:\DATN\DATN\fix-stories-and-validate.bat"

echo [OK] Đã xóa các file train chatbot trùng lặp.
echo.

:: Xóa các file triển khai và tích hợp đã hoàn thành
echo Đang xóa các file triển khai và tích hợp đã hoàn thành...
if exist "d:\DATN\DATN\create-backend-images.bat" del "d:\DATN\DATN\create-backend-images.bat"
if exist "d:\DATN\DATN\deploy-inventory-system.bat" del "d:\DATN\DATN\deploy-inventory-system.bat"
if exist "d:\DATN\DATN\integrated-system-complete.bat" del "d:\DATN\DATN\integrated-system-complete.bat"
if exist "d:\DATN\DATN\update-product-stock.bat" del "d:\DATN\DATN\update-product-stock.bat"

echo [OK] Đã xóa các file triển khai và tích hợp đã hoàn thành.
echo.

:: Xóa các file cấu hình email đã hoàn thành
echo Đang xóa các file cấu hình email đã hoàn thành...
if exist "d:\DATN\DATN\email-setup-guide.bat" del "d:\DATN\DATN\email-setup-guide.bat"
if exist "d:\DATN\DATN\gmail-app-password-setup.bat" del "d:\DATN\DATN\gmail-app-password-setup.bat"
if exist "d:\DATN\DATN\gmail-smtp-setup.bat" del "d:\DATN\DATN\gmail-smtp-setup.bat"
if exist "d:\DATN\DATN\professional-email-setup.bat" del "d:\DATN\DATN\professional-email-setup.bat"
if exist "d:\DATN\DATN\resend-setup.bat" del "d:\DATN\DATN\resend-setup.bat"
if exist "d:\DATN\DATN\sendgrid-5min-setup.bat" del "d:\DATN\DATN\sendgrid-5min-setup.bat"
if exist "d:\DATN\DATN\switch-email-service.bat" del "d:\DATN\DATN\switch-email-service.bat"
if exist "d:\DATN\DATN\zoho-local-dev-quick-setup.bat" del "d:\DATN\DATN\zoho-local-dev-quick-setup.bat"
if exist "d:\DATN\DATN\zoho-mail-setup.bat" del "d:\DATN\DATN\zoho-mail-setup.bat"

echo [OK] Đã xóa các file cấu hình email đã hoàn thành.
echo.

echo [BƯỚC 3] Tạo file README hướng dẫn...
echo ----------------------------------------------
echo.

echo # HỆ THỐNG SUN MOVEMENT - HƯỚNG DẪN NHANH> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo ## File Script Quản Lý Hệ Thống>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo Các file script (.bat) sau đây được sử dụng để quản lý hệ thống Sun Movement:>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo ### Khởi động và dừng hệ thống>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **start-full-system.bat**: Khởi động đầy đủ hệ thống (Backend + Frontend + Chatbot + Action Server)>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **stop-all-services.bat**: Dừng tất cả các dịch vụ>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **restart-specific-service.bat**: Khởi động lại một dịch vụ cụ thể>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo ### Quản lý chatbot>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **train-vietnamese-chatbot.bat**: Train lại chatbot tiếng Việt>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **start-action-server.bat**: Khởi động Rasa Action Server riêng biệt>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **create-dummy-data.bat**: Tạo dữ liệu mẫu cho chatbot>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **test-vietnamese-chatbot-advanced.bat**: Kiểm tra chatbot với các kịch bản nâng cao>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo ### Khởi động thành phần riêng lẻ>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **start-backend-server.bat**: Khởi động backend>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo ### Kiểm tra và sửa lỗi>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **check-system-status.bat**: Kiểm tra trạng thái hệ thống>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **check-rasa-status.bat**: Kiểm tra trạng thái Rasa>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - **fix-rasa-503-error.bat**: Sửa lỗi 503 của Rasa>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo ## Tài liệu hướng dẫn chi tiết>> "d:\DATN\DATN\README_BAT_FILES.md"
echo.>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - [VIETNAMESE_CHATBOT_ADVANCED_GUIDE.md](./VIETNAMESE_CHATBOT_ADVANCED_GUIDE.md): Hướng dẫn chi tiết về quản lý và vận hành chatbot>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - [VIETNAMESE_CHATBOT_INTEGRATION_COMPLETED.md](./VIETNAMESE_CHATBOT_INTEGRATION_COMPLETED.md): Thông tin về quá trình tích hợp chatbot>> "d:\DATN\DATN\README_BAT_FILES.md"
echo - [RASA_CHATBOT_INTEGRATION_GUIDE.md](./RASA_CHATBOT_INTEGRATION_GUIDE.md): Hướng dẫn tích hợp chatbot với frontend và backend>> "d:\DATN\DATN\README_BAT_FILES.md"

echo [OK] Đã tạo file README_BAT_FILES.md

echo.
echo [HOÀN TẤT] Đã xóa các file .bat không cần thiết!
echo Các file quan trọng đã được sao lưu vào thư mục: d:\DATN\DATN\important_bat_files
echo Tổng quan về các file .bat còn lại có trong: d:\DATN\DATN\README_BAT_FILES.md
echo.
echo Cảm ơn bạn đã sử dụng công cụ dọn dẹp này!
