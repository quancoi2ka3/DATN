@echo off
echo ===== Fixed and Retraining Sun Movement Enhanced Chatbot =====

cd /d D:\DATN\DATN\sun-movement-chatbot

echo.
echo 1. Training the chatbot model...
rasa train

echo.
echo 2. Starting the actions server in a new window...
start cmd /k "cd /d D:\DATN\DATN\sun-movement-chatbot && rasa run actions"

echo.
echo 3. Starting the Rasa server in a new window...
start cmd /k "cd /d D:\DATN\DATN\sun-movement-chatbot && rasa run --enable-api --cors \"*\""

echo.
echo Chatbot training and startup complete!
echo.
echo - Actions server is running on http://localhost:5055
echo - Rasa server is running on http://localhost:5005
echo.
echo You can now interact with the chatbot via the REST API or connect with the frontend.
echo.

pause
