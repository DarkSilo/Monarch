@echo off
setlocal
cd /d "%~dp0Order-service\Order-service"
echo.
echo ==================================================================================
echo  Monarch - Orders Service (Port 8084)
echo ==================================================================================
echo [INFO] Starting Orders Service...
echo [INFO] Listening on http://localhost:8084
echo [INFO] Health check: http://localhost:8084/health/orders
echo [INFO] Database: MongoDB required
echo.
echo [TIP] Press Ctrl+C to stop this service
echo.
npm start
pause
