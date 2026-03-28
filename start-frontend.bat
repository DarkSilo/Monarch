@echo off
setlocal
cd /d "%~dp0frontend"
echo.
echo ==================================================================================
echo  Monarch - Frontend (Port 3000)
echo ==================================================================================
echo [INFO] Starting Frontend (Development Mode)...
echo [INFO] Browse to http://localhost:3000
echo [INFO] Hot reload enabled
echo.
echo [TIP] Press Ctrl+C to stop this service
echo.
npm run dev
pause
