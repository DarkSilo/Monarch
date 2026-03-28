@echo off
echo.
echo ==================================================================================
echo  Monarch - Installing Dependencies
echo ==================================================================================
echo.
echo This will install npm packages for all 4 services...
echo This may take 2-5 minutes depending on internet speed.
echo.

cd /d "%~dp0"

echo [1/4] API Gateway...
cd api-gateway
call npm install
cd ..

echo [2/4] Authentication Service...
cd authentication
call npm install
call npm run build
cd ..

echo [3/4] Inventory Service...
cd inventory
call npm install
call npm run build
cd ..

echo [4/4] Frontend...
cd frontend
call npm install
cd ..

echo.
echo ==================================================================================
echo  Installation Complete
echo ==================================================================================
echo.
echo All dependencies installed!
echo.
echo Next Step: Double-click start-services.bat to launch all services
echo.
pause
