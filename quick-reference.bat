@echo off
REM ==================================================================================
REM  Monarch - Quick Reference Guide
REM ==================================================================================
REM
REM  This is a quick reference for common tasks.
REM  For detailed setup, see SETUP_GUIDE.md
REM ==================================================================================

:menu
cls
echo.
echo ==================================================================================
echo  MONARCH - Quick Reference Menu
echo ==================================================================================
echo.
echo  Services:
echo    - API Gateway       (port 8080)
echo    - Authentication    (port 8081) - Requires MongoDB
echo    - Inventory         (port 8082) - Requires MongoDB
echo    - Notifications     (port 8083) - Requires MongoDB
echo    - Orders            (port 8084) - Requires MongoDB
echo    - Frontend          (port 3000) - Next.js app
echo.
echo  Prerequisites:
echo    - Node.js 20+ (verify: node --version)
echo    - npm (verify: npm --version)
echo    - MongoDB running (local or Atlas)
echo.
echo ==================================================================================
echo  Available Commands:
echo ==================================================================================
echo.
echo  [1] Install dependencies and build
echo      - Runs: install-dependencies.bat
echo.
echo  [2] Start all services in separate windows
echo      - Runs: start-services.bat
echo.
echo  [3] Quick start (install + start)
echo      - Runs: install-dependencies.bat + start-services.bat
echo.
echo  [4] View MongoDB status check
echo      - Test MongoDB connection
echo.
echo  [5] View environment variables (.env files)
echo      - Display current .env configuration
echo.
echo  [6] Start single service (menu)
echo      - Choose and start one service
echo.
echo  [7] Open SETUP_GUIDE.md in text editor
echo      - Read full documentation
echo.
echo  [8] Exit
echo.
echo ==================================================================================
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto start
if "%choice%"=="3" goto quickstart
if "%choice%"=="4" goto mongodb_check
if "%choice%"=="5" goto view_env
if "%choice%"=="6" goto single_service
if "%choice%"=="7" goto open_guide
if "%choice%"=="8" exit /b 0

echo Invalid choice. Please try again.
pause
goto menu

REM ==================================================================================
REM  Install Dependencies
REM ==================================================================================
:install
cls
echo.
echo Installing dependencies and building all services...
echo.
call install-dependencies.bat
pause
goto menu

REM ==================================================================================
REM  Start All Services
REM ==================================================================================
:start
cls
echo.
echo Starting all services in separate terminal windows...
echo.
call start-services.bat
pause
goto menu

REM ==================================================================================
REM  Quick Start (Install + Start)
REM ==================================================================================
:quickstart
cls
echo.
echo Running quick start: Install dependencies, then start services...
echo.
call install-dependencies.bat
if errorlevel 1 (
    echo.
    echo [ERROR] Installation failed. Aborting startup.
    pause
    goto menu
)
echo.
echo Installation complete. Starting services...
echo.
call start-services.bat
pause
goto menu

REM ==================================================================================
REM  MongoDB Status Check
REM ==================================================================================
:mongodb_check
cls
echo.
echo ==================================================================================
echo  MongoDB Connection Check
echo ==================================================================================
echo.
echo Attempting to connect to MongoDB...
echo.

REM Try to ping MongoDB
where mongo >nul 2>&1
if errorlevel 1 (
    echo [INFO] MongoDB CLI not found in PATH.
    echo        This is OK if you're using MongoDB Atlas (cloud).
    echo        Just verify connection string in .env files.
    echo.
) else (
    echo [INFO] MongoDB CLI found. Checking connection...
    mongo --eval "db.adminCommand('ping')" >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Could not connect to local MongoDB.
        echo           Make sure MongoDB server is running.
        echo.
        echo           Command: mongod
    ) else (
        echo [SUCCESS] MongoDB is accessible!
    )
)

echo.
echo ==================================================================================
echo  Configuration Locations:
echo ==================================================================================
echo.
echo  Authentication:.env
echo    MONGODB_URI=mongodb://localhost:27017/monarch_auth
echo.
echo  Inventory .env:
echo    MONGODB_URI=mongodb://localhost:27017/monarch_inventory
echo.
echo  For MongoDB Atlas, use connection string format:
echo    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
echo.
echo ==================================================================================
echo.
pause
goto menu

REM ==================================================================================
REM  View Environment Variables
REM ==================================================================================
:view_env
cls
echo.
echo ==================================================================================
echo  Environment Variables
echo ==================================================================================
echo.

echo ─── API Gateway (api-gateway\.env) ───────────────────────────────────────
if exist "api-gateway\.env" (
    type "api-gateway\.env"
) else (
    echo [File not found]
)
echo.

echo ─── Authentication (authentication\.env) ─────────────────────────────────
if exist "authentication\.env" (
    type "authentication\.env"
) else (
    echo [File not found]
)
echo.

echo ─── Inventory (inventory\.env) ────────────────────────────────────────────
if exist "inventory\.env" (
    type "inventory\.env"
) else (
    echo [File not found]
)
echo.

echo ─── Notifications (notification-service\.env) ─────────────────────────────
if exist "notification-service\.env" (
    type "notification-service\.env"
) else (
    echo [File not found]
)
echo.

echo ─── Frontend (frontend\.env.local) ────────────────────────────────────────
if exist "frontend\.env.local" (
    type "frontend\.env.local"
) else (
    echo [File not found - This is OK, uses defaults]
)
echo.

echo ==================================================================================
echo.
pause
goto menu

REM ==================================================================================
REM  Single Service Menu
REM ==================================================================================
:single_service
cls
echo.
echo ==================================================================================
echo  Start Single Service
echo ==================================================================================
echo.
echo  [1] API Gateway (port 8080)
echo  [2] Authentication (port 8081)
echo  [3] Inventory (port 8082)
echo  [4] Notifications (port 8083)
echo  [5] Orders (port 8084)
echo  [6] Frontend (port 3000)
echo  [7] Back to main menu
echo.
echo ==================================================================================
echo.

set /p service_choice="Choose service (1-7): "

if "%service_choice%"=="1" (
    start "API Gateway" cmd /k "cd /d api-gateway && npm start"
    echo Started API Gateway in new window
) else if "%service_choice%"=="2" (
    start "Authentication" cmd /k "cd /d authentication && npm start"
    echo Started Authentication Service in new window
) else if "%service_choice%"=="3" (
    start "Inventory" cmd /k "cd /d inventory && npm start"
    echo Started Inventory Service in new window
) else if "%service_choice%"=="4" (
    start "Notifications" cmd /k "cd /d notification-service && npm start"
    echo Started Notification Service in new window
) else if "%service_choice%"=="5" (
    start "Orders" cmd /k "cd /d Order-service\Order-service && npm start"
    echo Started Orders Service in new window
) else if "%service_choice%"=="6" (
    start "Frontend" cmd /k "cd /d frontend && npm start"
    echo Started Frontend in new window
) else if "%service_choice%"=="7" (
    goto menu
) else (
    echo Invalid choice.
)

pause
goto menu

REM ==================================================================================
REM  Open Setup Guide
REM ==================================================================================
:open_guide
if exist "SETUP_GUIDE.md" (
    start "" "SETUP_GUIDE.md"
    echo Opening SETUP_GUIDE.md...
) else (
    echo [Error] SETUP_GUIDE.md not found
)
pause
goto menu
