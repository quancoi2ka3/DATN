@echo off
echo Starting Rasa Chatbot for Sun Movement...
echo.

start cmd /k "cd /d d:\DATN\DATN\sun-movement-chatbot && rasa_env_310\Scripts\activate && rasa run --cors "*" --enable-api -p 5005"
timeout 5
start cmd /k "cd /d d:\DATN\DATN\sun-movement-chatbot && rasa_env_310\Scripts\activate && rasa run actions"

echo.
echo Rasa servers are now running!
echo Main server: http://localhost:5005
echo Action server: http://localhost:5055
echo.
echo Press any key to stop all servers...
pause

taskkill /f /im python.exe
