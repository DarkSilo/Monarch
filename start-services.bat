@echo off
echo.
echo ==================================================================================
echo  Monarch - Starting All Services
echo ==================================================================================
echo.
echo Launching 6 services in separate windows...
echo.

cd /d "%~dp0"

start "API Gateway" cmd /k "cd api-gateway && npm start"
timeout /t 2 /nobreak

start "Authentication" cmd /k "cd authentication && npm start"
timeout /t 2 /nobreak

start "Inventory" cmd /k "cd inventory && npm start"
timeout /t 2 /nobreak

start "Orders" cmd /k "cd Order-service\Order-service && npm start"
timeout /t 2 /nobreak

start "Notifications" cmd /k "cd notification-service && npm start"
timeout /t 2 /nobreak

start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==================================================================================
echo  Services Launched
echo ==================================================================================
echo.
echo URLs:
echo   Frontend (port 3000):       http://localhost:3000
echo   API Gateway (port 8080):    http://localhost:8080
echo   Authentication (port 8081): http://localhost:8081
echo   Inventory (port 8082):      http://localhost:8082
echo   Notifications (port 8083):  http://localhost:8083
echo   Orders (port 8084):         http://localhost:8084
echo.
pause
