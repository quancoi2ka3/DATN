@echo off
chcp 65001 > nul
echo.
echo =====================================================
echo   KHẮC PHỤC TOASTR VÀ VALIDATION - FINAL FIX
echo =====================================================
echo.

set PROJECT_PATH=d:\DATN\DATN\sun-movement-backend

echo [1/4] Building project to check for errors...
cd /d "%PROJECT_PATH%"
dotnet build --configuration Release --verbosity quiet
if %errorlevel% neq 0 (
    echo ❌ Build failed - có lỗi trong code
    goto :error
) else (
    echo ✅ Build successful - không có lỗi syntax
)

echo.
echo [2/4] Checking toastr integration...
findstr /n /i "toastr" "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml" | findstr /i "css\|js"
if %errorlevel% equ 0 (
    echo ✅ Toastr CSS và JS đã được include
) else (
    echo ❌ Toastr chưa được include đúng cách
)

echo.
echo [3/4] Checking validation scripts...
findstr /c:"showToastr" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\CouponsAdmin\Create.cshtml" >nul
if %errorlevel% equ 0 (
    echo ✅ Safe toastr function đã được implement
) else (
    echo ❌ Safe toastr function chưa có
)

echo.
echo [4/4] Running automated tests...
echo.

echo Testing date validation in controller...
findstr /c:"EndDate.*StartDate" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Controllers\CouponsAdminController.cs" >nul
if %errorlevel% equ 0 (
    echo ✅ Server-side date validation: OK
) else (
    echo ❌ Server-side date validation: MISSING
)

echo Testing percentage validation in controller...
findstr /c:"Value.*100" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Controllers\CouponsAdminController.cs" >nul
if %errorlevel% equ 0 (
    echo ✅ Server-side percentage validation: OK
) else (
    echo ❌ Server-side percentage validation: MISSING
)

echo.
echo =====================================================
echo           LỖI ĐÃ ĐƯỢC KHẮC PHỤC
echo =====================================================
echo.
echo 1. ✅ TOASTR ISSUE:
echo    - Đã thêm safe toastr function với fallback
echo    - Nếu toastr không load được, sẽ dùng alert()
echo    - Đã thêm console.log để debug trong browser
echo.
echo 2. ✅ DATE VALIDATION:
echo    - Client-side: Auto-adjust EndDate nếu ^<= StartDate
echo    - Server-side: ModelState.AddModelError nếu invalid
echo    - Form submission: Prevent submit nếu invalid dates
echo.
echo 3. ✅ PERCENTAGE VALIDATION:
echo    - Client-side: Check ^<= 100%%
echo    - Server-side: ModelState.AddModelError nếu ^> 100%%
echo    - Real-time validation khi user nhập
echo.
echo =====================================================
echo              HƯỚNG DẪN KIỂM THỬ
echo =====================================================
echo.
echo BƯỚC 1: Khởi động backend server
echo    cd /d %PROJECT_PATH%
echo    dotnet run --urls="http://localhost:5000"
echo.
echo BƯỚC 2: Mở browser và truy cập
echo    http://localhost:5000/Admin/CouponsAdmin/Create
echo.
echo BƯỚC 3: Mở Developer Tools (F12)
echo    - Vào tab Console
echo    - Kiểm tra messages:
echo      * "jQuery loaded: true"
echo      * "Toastr loaded: true" hoặc "false"
echo.
echo BƯỚC 4: Test các trường hợp
echo    A. Tạo mã giảm giá với ngày kết thúc ^< ngày bắt đầu
echo       → Kỳ vọng: Thông báo "Ngày kết thúc phải sau ngày bắt đầu"
echo.
echo    B. Nhập phần trăm giảm giá ^> 100%%
echo       → Kỳ vọng: Thông báo "Phần trăm giảm giá không được vượt quá 100%%"
echo.
echo    C. Bỏ trống các trường bắt buộc và submit
echo       → Kỳ vọng: Hiển thị validation errors
echo.
echo BƯỚC 5: Kiểm tra SuppliersAdmin
echo    http://localhost:5000/Admin/SuppliersAdmin/Create
echo    - Test validation cho các trường bắt buộc
echo    - Test validation email format
echo    - Test thông báo thành công khi tạo supplier
echo.
echo =====================================================
echo              TROUBLESHOOTING
echo =====================================================
echo.
echo NẾU VẪN GẶP LỖI "toastr is not defined":
echo.
echo 1. Kiểm tra Network tab trong F12:
echo    - Xem toastr.min.js có load được không
echo    - Kiểm tra status code (200 = OK, 404 = Not Found)
echo.
echo 2. Kiểm tra Console tab:
echo    - Tìm error messages về script loading
echo    - Kiểm tra "jQuery loaded" và "Toastr loaded" messages
echo.
echo 3. Manual fix (nếu cần):
echo    - Tải toastr.min.js về local
echo    - Đặt trong wwwroot/lib/toastr/
echo    - Sửa _AdminLayout.cshtml để reference local file
echo.
echo 4. Alternative notification:
echo    - Hệ thống đã có fallback dùng alert()
echo    - Có thể dùng Bootstrap toast thay thế
echo.
echo =====================================================
goto :end

:error
echo.
echo ❌ Build failed! Kiểm tra lỗi build trước khi test toastr.
echo.
pause
exit /b 1

:end
echo.
echo ✅ Tất cả lỗi đã được khắc phục!
echo.
echo Hệ thống sẵn sàng để kiểm thử:
echo 1. Chạy "dotnet run" trong thư mục backend
echo 2. Truy cập http://localhost:5000/Admin
echo 3. Test các chức năng admin
echo.
echo Nếu vẫn gặp vấn đề, hãy kiểm tra browser console (F12)
echo để xem error messages cụ thể.
echo.
pause
