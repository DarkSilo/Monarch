@echo off
setlocal
cd /d "%~dp0inventory"
echo.
echo ==================================================================================
echo  Monarch - Inventory Service (Port 8082)
echo ==================================================================================
echo [INFO] Starting Inventory Service...
echo [INFO] Listening on http://localhost:8082
echo [INFO] Health check: http://localhost:8082/health/inventory
echo [INFO] Database: MongoDB required
echo.
echo [TIP] Press Ctrl+C to stop this service
echo.
npm start
pause
