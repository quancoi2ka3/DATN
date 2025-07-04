@echo off
echo =====================================================
echo     Retrain Rasa Model with Updated Data
echo =====================================================
echo.

echo Step 1: Navigate to Rasa directory
cd /d d:\DATN\DATN\sun-movement-chatbot

echo Step 2: Activate environment
call rasa_env_310\Scripts\activate

echo Step 3: Validate updated data
echo Validating NLU and story data...
rasa data validate
if %errorlevel% neq 0 (
    echo ⚠ Data validation found issues. Check the warnings above.
    pause
)

echo.
echo Step 4: Backup old model
if exist "models\*.tar.gz" (
    if not exist "models\backup" mkdir "models\backup"
    copy "models\*.tar.gz" "models\backup\" >nul 2>&1
    echo ✓ Old model backed up
)

echo.
echo Step 5: Train new model with updated data
echo This may take a few minutes...
rasa train --force
if %errorlevel% neq 0 (
    echo ✗ Training failed!
    echo Restoring backup model...
    if exist "models\backup\*.tar.gz" (
        copy "models\backup\*.tar.gz" "models\" >nul 2>&1
    )
    pause
    exit /b 1
)

echo ✓ Training completed successfully!
echo.

echo Step 6: Test the new model
echo Testing with sample conversation...
echo.
echo Testing "xin chào"...
echo xin chào | rasa shell nlu

echo.
echo Testing "tôi cần tư vấn sản phẩm"...
echo tôi cần tư vấn sản phẩm | rasa shell nlu

echo.
echo Step 7: Start server with new model
echo Starting Rasa server...
rasa run --cors "*" --enable-api -p 5005

pause
