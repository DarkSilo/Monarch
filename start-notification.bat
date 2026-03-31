@echo off
setlocal
cd /d "%~dp0notification-service"
echo.
echo ==================================================================================
echo  Monarch - Notification Service (Port 8083)
echo ==================================================================================
echo [INFO] Starting Notification Service...
echo [INFO] Listening on http://localhost:8083
echo [INFO] Health check: http://localhost:8083/health
echo [INFO] Database: MongoDB required
echo.
echo [TIP] Press Ctrl+C to stop this service
echo.
npm start
pause
