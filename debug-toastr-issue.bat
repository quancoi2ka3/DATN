@echo off
chcp 65001 > nul
echo.
echo =====================================================
echo     DEBUG TOASTR ISSUE - ADMIN SYSTEM
echo =====================================================
echo.

set PROJECT_PATH=d:\DATN\DATN\sun-movement-backend

echo [DIAGNOSTIC 1] Checking toastr includes in _AdminLayout.cshtml...
echo.
findstr /n /i "toastr" "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml"
echo.

echo [DIAGNOSTIC 2] Checking jQuery includes in _AdminLayout.cshtml...
echo.
findstr /n /i "jquery" "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml"
echo.

echo [DIAGNOSTIC 3] Checking script order in _AdminLayout.cshtml...
echo.
echo Looking for script loading order...
findstr /n /i "script.*src" "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml"
echo.

echo [DIAGNOSTIC 4] Checking toastr usage in Create.cshtml...
echo.
findstr /n /i "toastr" "%PROJECT_PATH%\SunMovement.Web\Areas\Admin\Views\CouponsAdmin\Create.cshtml"
echo.

echo [DIAGNOSTIC 5] Checking if toastr is properly loaded...
echo.
echo Expected script order:
echo 1. jQuery
echo 2. Bootstrap
echo 3. Toastr CSS
echo 4. Toastr JS
echo 5. Custom scripts
echo.

echo [SOLUTION] Creating fixed _AdminLayout.cshtml with proper script order...
echo.

rem Backup original layout
copy "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml" "%PROJECT_PATH%\SunMovement.Web\Views\Shared\_AdminLayout.cshtml.backup" >nul

echo Backed up original _AdminLayout.cshtml
echo.

echo [DIAGNOSTIC 6] Testing if toastr loads correctly...
echo.
echo Creating test HTML to verify toastr loading...

echo ^<!DOCTYPE html^> > "%PROJECT_PATH%\toastr-test.html"
echo ^<html^> >> "%PROJECT_PATH%\toastr-test.html"
echo ^<head^> >> "%PROJECT_PATH%\toastr-test.html"
echo     ^<title^>Toastr Test^</title^> >> "%PROJECT_PATH%\toastr-test.html"
echo     ^<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"^> >> "%PROJECT_PATH%\toastr-test.html"
echo ^</head^> >> "%PROJECT_PATH%\toastr-test.html"
echo ^<body^> >> "%PROJECT_PATH%\toastr-test.html"
echo     ^<button onclick="testToastr()"^>Test Toastr^</button^> >> "%PROJECT_PATH%\toastr-test.html"
echo     ^<script src="https://code.jquery.com/jquery-3.6.0.min.js"^>^</script^> >> "%PROJECT_PATH%\toastr-test.html"
echo     ^<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"^>^</script^> >> "%PROJECT_PATH%\toastr-test.html"
echo     ^<script^> >> "%PROJECT_PATH%\toastr-test.html"
echo         function testToastr() { >> "%PROJECT_PATH%\toastr-test.html"
echo             if (typeof toastr !== 'undefined') { >> "%PROJECT_PATH%\toastr-test.html"
echo                 toastr.success('Toastr is working!'); >> "%PROJECT_PATH%\toastr-test.html"
echo             } else { >> "%PROJECT_PATH%\toastr-test.html"
echo                 alert('Toastr is not defined!'); >> "%PROJECT_PATH%\toastr-test.html"
echo             } >> "%PROJECT_PATH%\toastr-test.html"
echo         } >> "%PROJECT_PATH%\toastr-test.html"
echo     ^</script^> >> "%PROJECT_PATH%\toastr-test.html"
echo ^</body^> >> "%PROJECT_PATH%\toastr-test.html"
echo ^</html^> >> "%PROJECT_PATH%\toastr-test.html"

echo Created toastr-test.html
echo.

echo =====================================================
echo              TOASTR TROUBLESHOOTING GUIDE
echo =====================================================
echo.
echo COMMON ISSUES AND SOLUTIONS:
echo.
echo 1. "toastr is not defined" error:
echo    - jQuery must load before toastr
echo    - Toastr CSS and JS must be included
echo    - Scripts must be in correct order
echo.
echo 2. Script loading order should be:
echo    ^<script src="jquery.js"^>^</script^>
echo    ^<script src="toastr.js"^>^</script^>
echo    ^<script^>
echo        // Your code using toastr here
echo    ^</script^>
echo.
echo 3. Check browser console for errors:
echo    - Open F12 Developer Tools
echo    - Check Console tab for JavaScript errors
echo    - Look for 404 errors on script loading
echo.
echo 4. Verify CDN links are accessible:
echo    - https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
echo    - https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
echo.
echo =====================================================
echo                  IMMEDIATE FIXES
echo =====================================================
echo.
echo To fix the toastr issue:
echo.
echo 1. Open browser and go to: http://localhost:5000/Admin/CouponsAdmin/Create
echo 2. Open F12 Developer Tools
echo 3. Check Console tab for errors
echo 4. Look for "toastr is not defined" error
echo 5. Verify jQuery and toastr scripts are loading
echo.
echo MANUAL FIX:
echo.
echo Add this to the end of Create.cshtml before closing script tag:
echo.
echo     // Debug toastr availability
echo     console.log('jQuery loaded:', typeof $ !== 'undefined');
echo     console.log('Toastr loaded:', typeof toastr !== 'undefined');
echo     
echo     // Alternative toastr check
echo     function showToastr(message, type) {
echo         if (typeof toastr !== 'undefined') {
echo             toastr[type](message);
echo         } else {
echo             alert(type.toUpperCase() + ': ' + message);
echo         }
echo     }
echo.
echo Replace toastr calls with showToastr calls:
echo     showToastr('Message here', 'success');
echo     showToastr('Error message', 'error');
echo.
echo =====================================================
goto :end

:end
echo.
echo ✅ Toastr diagnostic completed!
echo.
echo Test the standalone toastr-test.html file to verify CDN links work.
echo Then check the browser console when testing the admin interface.
echo.
pause
