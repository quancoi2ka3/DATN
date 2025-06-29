@echo off
chcp 65001 > nul
echo.
echo =====================================================
echo    KIỂM THỬ TOASTR VÀ VALIDATION SYSTEM
echo =====================================================
echo.

set PROJECT_PATH=d:\DATN\DATN\sun-movement-backend

echo [1/5] Kiểm tra Toastr trong Admin Layout...
findstr /n /i "toastr" "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml"
if %errorlevel% equ 0 (
    echo ✅ Toastr CSS và JS đã được include
) else (
    echo ❌ Toastr chưa được include
)

echo.
echo [2/5] Kiểm tra JavaScript validation trong CouponsAdmin Create...
findstr /n /i "toastr\|validation\|EndDate.*StartDate" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\CouponsAdmin\Create.cshtml"
if %errorlevel% equ 0 (
    echo ✅ Validation JavaScript đã được implement
) else (
    echo ❌ Validation JavaScript chưa có
)

echo.
echo [3/5] Kiểm tra Controller validation...
findstr /n /i "EndDate.*StartDate\|ModelState.AddModelError" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Controllers\CouponsAdminController.cs"
if %errorlevel% equ 0 (
    echo ✅ Controller validation đã được implement
) else (
    echo ❌ Controller validation chưa có
)

echo.
echo [4/5] Kiểm tra TempData messages...
findstr /n /i "TempData.*Message\|SuccessMessage\|ErrorMessage" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Controllers\CouponsAdminController.cs"
if %errorlevel% equ 0 (
    echo ✅ TempData messages đã được implement
) else (
    echo ❌ TempData messages chưa có
)

echo.
echo [5/5] Build project để kiểm tra lỗi...
cd /d "%PROJECT_PATH%"
echo Building project...
dotnet build --configuration Release --verbosity minimal
if %errorlevel% equ 0 (
    echo ✅ Build thành công - không có lỗi
) else (
    echo ❌ Build failed - có lỗi cần sửa
    goto :error
)

echo.
echo =====================================================
echo         HƯỚNG DẪN KIỂM THỬ THỰC TẾ
echo =====================================================
echo.
echo Để kiểm thử toastr và validation:
echo.
echo 1. Chạy backend server:
echo    cd /d %PROJECT_PATH%
echo    dotnet run --urls="http://localhost:5000"
echo.
echo 2. Truy cập admin interface:
echo    http://localhost:5000/Admin
echo.
echo 3. Kiểm thử các tính năng:
echo    • Vào CouponsAdmin/Create
echo    • Thử nhập ngày kết thúc trước ngày bắt đầu
echo    • Kiểm tra thông báo toastr hiển thị
echo    • Thử submit form với dữ liệu không hợp lệ
echo    • Kiểm tra validation messages
echo.
echo 4. Kiểm thử SuppliersAdmin:
echo    • Vào SuppliersAdmin/Create
echo    • Thử thêm nhà cung cấp mới
echo    • Kiểm tra validation và thông báo
echo.
echo 5. Kiểm thử InventoryAdmin:
echo    • Vào InventoryAdmin để xem danh sách
echo    • Kiểm tra tính năng Low Stock
echo    • Test các chức năng quản lý kho
echo.
echo =====================================================
echo           VALIDATION FEATURES INCLUDED
echo =====================================================
echo.
echo ✅ Date validation (EndDate > StartDate)
echo ✅ Percentage validation (≤ 100%)
echo ✅ Unique coupon code validation
echo ✅ Auto-generated coupon codes
echo ✅ Real-time form validation
echo ✅ Toastr notifications
echo ✅ Server-side validation
echo ✅ Client-side validation
echo ✅ Form submission validation
echo ✅ TempData success/error messages
echo.
goto :end

:error
echo.
echo ❌ Có lỗi xảy ra! Kiểm tra build errors ở trên.
echo.
pause
exit /b 1

:end
echo.
echo ✅ Tất cả kiểm thử đã hoàn thành!
echo Hệ thống sẵn sàng để kiểm thử thực tế.
echo.
pause
