@echo off
chcp 65001 >nul
echo ============================================
echo    XUẤT MÔ TẢ DATABASE SANG FILE EXCEL
echo ============================================
echo.

cd /d "d:\DATN\DATN\scripts"

echo 🚀 Đang chạy script Python...
d:\DATN\DATN\.venv\Scripts\python.exe final_excel_export.py

echo.
echo ============================================
echo ✅ HOÀN THÀNH!
echo.
echo 📄 File Excel đã được tạo tại:
echo    d:\DATN\DATN\docs\Database_Tables_Description.xlsx
echo.
echo 📋 Hướng dẫn sử dụng:
echo    d:\DATN\DATN\docs\Database_Excel_Guide.md
echo ============================================
echo.
pause
