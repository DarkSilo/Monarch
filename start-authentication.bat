@echo off
setlocal
cd /d "%~dp0authentication"
echo.
echo ==================================================================================
echo  Monarch - Authentication Service (Port 8081)
echo ==================================================================================
echo [INFO] Starting Authentication Service...
echo [INFO] Listening on http://localhost:8081
echo [INFO] Health check: http://localhost:8081/health/auth
echo [INFO] Database: MongoDB required
echo.
echo [TIP] Press Ctrl+C to stop this service
echo.
npm start
pause
