@echo off
setlocal
cd /d "%~dp0api-gateway"
echo.
echo ==================================================================================
echo  Monarch - API Gateway (Port 8080)
echo ==================================================================================
echo [INFO] Starting API Gateway...
echo [INFO] Listening on http://localhost:8080
echo [INFO] Health check: http://localhost:8080/health
echo.
echo [TIP] Press Ctrl+C to stop this service
echo.
npm start
pause
