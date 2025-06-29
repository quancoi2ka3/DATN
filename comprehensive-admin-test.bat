@echo off
chcp 65001 > nul
echo.
echo =====================================================
echo     KIỂM THỬ ADMIN INTERFACE TOÀN DIỆN
echo =====================================================
echo.

set PROJECT_PATH=d:\DATN\DATN\sun-movement-backend

echo Starting comprehensive admin interface test...
echo.

echo [STEP 1] Building project...
cd /d "%PROJECT_PATH%"
dotnet build --configuration Release --verbosity quiet
if %errorlevel% neq 0 (
    echo ❌ Build failed
    goto :error
)
echo ✅ Build successful

echo.
echo [STEP 2] Checking admin controllers...
echo.
for %%f in ("%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Controllers\*Controller.cs") do (
    echo   ✅ %%~nf
)

echo.
echo [STEP 3] Checking critical admin views...
echo.

rem CouponsAdmin views
if exist "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\CouponsAdmin\Index.cshtml" (
    echo   ✅ CouponsAdmin/Index.cshtml
) else (
    echo   ❌ CouponsAdmin/Index.cshtml MISSING
)

if exist "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\CouponsAdmin\Create.cshtml" (
    echo   ✅ CouponsAdmin/Create.cshtml
) else (
    echo   ❌ CouponsAdmin/Create.cshtml MISSING
)

if exist "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\CouponsAdmin\Edit.cshtml" (
    echo   ✅ CouponsAdmin/Edit.cshtml
) else (
    echo   ❌ CouponsAdmin/Edit.cshtml MISSING
)

if exist "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\CouponsAdmin\Details.cshtml" (
    echo   ✅ CouponsAdmin/Details.cshtml
) else (
    echo   ❌ CouponsAdmin/Details.cshtml MISSING
)

rem SuppliersAdmin views
if exist "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\SuppliersAdmin\Create.cshtml" (
    echo   ✅ SuppliersAdmin/Create.cshtml
) else (
    echo   ❌ SuppliersAdmin/Create.cshtml MISSING
)

rem InventoryAdmin views
if exist "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\InventoryAdmin\Index.cshtml" (
    echo   ✅ InventoryAdmin/Index.cshtml
) else (
    echo   ❌ InventoryAdmin/Index.cshtml MISSING
)

if exist "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\InventoryAdmin\LowStock.cshtml" (
    echo   ✅ InventoryAdmin/LowStock.cshtml
) else (
    echo   ❌ InventoryAdmin/LowStock.cshtml MISSING
)

echo.
echo [STEP 4] Checking layout and resources...
echo.

if exist "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml" (
    echo   ✅ _AdminLayout.cshtml
    findstr /i "toastr" "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml" >nul
    if %errorlevel% equ 0 (
        echo   ✅ Toastr included in layout
    ) else (
        echo   ❌ Toastr NOT included in layout
    )
) else (
    echo   ❌ _AdminLayout.cshtml MISSING
)

echo.
echo [STEP 5] Checking JavaScript validation...
echo.

findstr /i "validation\|toastr\|EndDate.*StartDate" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\CouponsAdmin\Create.cshtml" >nul
if %errorlevel% equ 0 (
    echo   ✅ JavaScript validation found in CouponsAdmin/Create
) else (
    echo   ❌ JavaScript validation NOT found in CouponsAdmin/Create
)

echo.
echo [STEP 6] Checking controller validation...
echo.

findstr /i "ModelState.AddModelError\|EndDate.*StartDate" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Controllers\CouponsAdminController.cs" >nul
if %errorlevel% equ 0 (
    echo   ✅ Server-side validation found in CouponsAdminController
) else (
    echo   ❌ Server-side validation NOT found in CouponsAdminController
)

echo.
echo =====================================================
echo              TESTING INSTRUCTIONS
echo =====================================================
echo.
echo Để kiểm thử admin interface:
echo.
echo 1. Khởi động backend server:
echo    cd /d %PROJECT_PATH%
echo    dotnet run --urls="http://localhost:5000"
echo.
echo 2. Truy cập admin interface:
echo    URL: http://localhost:5000/Admin
echo.
echo 3. Kiểm thử các chức năng sau:
echo.
echo    A. QUẢN LÝ MÃ GIẢM GIÁ (/Admin/CouponsAdmin):
echo       - Xem danh sách mã giảm giá
echo       - Tạo mã giảm giá mới:
echo         * Kiểm tra validation ngày (EndDate > StartDate)
echo         * Kiểm tra validation phần trăm (≤ 100%%)
echo         * Kiểm tra auto-generated coupon code
echo         * Kiểm tra thông báo toastr
echo       - Chỉnh sửa mã giảm giá
echo       - Xem chi tiết và xóa mã giảm giá
echo.
echo    B. QUẢN LÝ NHÀ CUNG CẤP (/Admin/SuppliersAdmin):
echo       - Xem danh sách nhà cung cấp
echo       - Thêm nhà cung cấp mới:
echo         * Kiểm tra validation các trường bắt buộc
echo         * Kiểm tra validation email và phone
echo         * Kiểm tra thông báo lỗi/thành công
echo.
echo    C. QUẢN LÝ KHO HÀNG (/Admin/InventoryAdmin):
echo       - Xem danh sách sản phẩm trong kho
echo       - Kiểm tra cảnh báo sản phẩm sắp hết hàng
echo       - Test các chức năng nhập/xuất kho
echo.
echo    D. KIỂM THỬ UI/UX:
echo       - Kiểm tra responsive design
echo       - Kiểm tra navigation sidebar
echo       - Kiểm tra DataTables pagination
echo       - Kiểm tra modal dialogs
echo       - Kiểm tra form validation real-time
echo.
echo =====================================================
echo           EXPECTED VALIDATION BEHAVIORS
echo =====================================================
echo.
echo 1. Khi tạo mã giảm giá:
echo    - Ngày kết thúc tự động điều chỉnh nếu ≤ ngày bắt đầu
echo    - Hiển thị toastr.info khi auto-adjust
echo    - Hiển thị toastr.error khi validation fail
echo    - Không submit form nếu dữ liệu không hợp lệ
echo.
echo 2. Khi nhập phần trăm giảm giá:
echo    - Không cho phép > 100%%
echo    - Hiển thị lỗi client-side và server-side
echo.
echo 3. Khi thêm nhà cung cấp:
echo    - Validation email format
echo    - Validation phone number
echo    - Kiểm tra tên nhà cung cấp trùng lặp
echo.
echo =====================================================
goto :end

:error
echo.
echo ❌ Test failed! Please check the errors above.
echo.
pause
exit /b 1

:end
echo.
echo ✅ All checks completed!
echo.
echo Hệ thống admin đã sẵn sàng để kiểm thử thực tế.
echo Chạy backend server và truy cập http://localhost:5000/Admin
echo.
pause
