@echo off
echo Installing dependencies for testing...
echo.

if exist "rasa_env_310\Scripts\activate" (
    echo Using Rasa Python environment...
    call rasa_env_310\Scripts\activate
    pip install pyyaml requests
) else (
    echo Using system Python...
    pip install pyyaml requests
)

echo.
echo Dependencies installed successfully!
echo You can now run test_chatbot_accuracy.py
echo.
pause
