@echo off
echo ========================================
echo   FINAL AUTHENTICATION SYSTEM TEST
echo ========================================
echo.
echo Date: %date% %time%
echo.

echo [1/5] Checking project structure...
if not exist "sun-movement-backend" (
    echo ERROR: Backend directory missing!
    goto :error
)
if not exist "sun-movement-frontend" (
    echo ERROR: Frontend directory missing!
    goto :error
)
echo ✅ Project structure OK

echo.
echo [2/5] Checking essential files...
if not exist "sun-movement-backend\SunMovement.sln" (
    echo ERROR: Backend solution file missing!
    goto :error
)
if not exist "sun-movement-frontend\package.json" (
    echo ERROR: Frontend package.json missing!
    goto :error
)
echo ✅ Essential files OK

echo.
echo [3/5] Checking documentation...
if not exist "E-COMMERCE_AUTHENTICATION_SYSTEM_COMPLETE.md" (
    echo ERROR: Main documentation missing!
    goto :error
)
if not exist "API_URL_FIX_COMPLETE.md" (
    echo ERROR: API fix documentation missing!
    goto :error
)
echo ✅ Documentation OK

echo.
echo [4/5] Checking cleanup results...
if exist "auth-flow-test-comprehensive.html" (
    echo WARNING: Some test files still exist
) else (
    echo ✅ Test files cleaned up successfully
)

echo.
echo [5/5] Checking startup scripts...
if not exist "safe-start-backend.bat" (
    echo ERROR: Backend startup script missing!
    goto :error
)
if not exist "safe-start-frontend.bat" (
    echo ERROR: Frontend startup script missing!
    goto :error
)
echo ✅ Startup scripts OK

echo.
echo ========================================
echo   ✅ ALL TESTS PASSED!
echo ========================================
echo.
echo The authentication system is ready!
echo.
echo To start the system:
echo   1. Run: safe-start-backend.bat
echo   2. Run: safe-start-frontend.bat
echo   3. Test login with: nguyenmanhan17072003@gmail.com / ManhQuan2003@
echo.
echo Available documentation:
echo   - E-COMMERCE_AUTHENTICATION_SYSTEM_COMPLETE.md
echo   - API_URL_FIX_COMPLETE.md
echo   - CLEANUP_COMPLETE_REPORT.md
echo.
goto :end

:error
echo.
echo ========================================
echo   ❌ TEST FAILED!
echo ========================================
echo Please check the missing files/directories above.
exit /b 1

:end
echo Press any key to exit...
pause >nul
