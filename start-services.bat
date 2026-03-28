@echo off
REM ==================================================================================
REM  Monarch Microservices - Start All Services
REM ==================================================================================
REM
REM  This script starts all 4 services in separate terminal windows:
REM    - api-gateway (port 8080) - JavaScript
REM    - authentication (port 8081) - TypeScript/Node.js
REM    - inventory (port 8082) - TypeScript/Node.js
REM    - frontend (port 3000) - Next.js/React
REM
REM  Prerequisites:
REM    - Run: install-dependencies.bat (first time only)
REM    - MongoDB must be running (for auth and inventory services)
REM    - .env files must be configured with proper connection strings
REM  ==================================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ==================================================================================
echo  Monarch Project - Starting All Services
echo ==================================================================================
echo.
echo [INFO] Starting services in separate terminal windows...
echo [INFO] Close any terminal window to stop that specific service.
echo.
echo ==================================================================================
echo  Service Port Mapping:
echo ==================================================================================
echo   Frontend:          http://localhost:3000
echo   API Gateway:       http://localhost:8080
echo   Authentication:    http://localhost:8081
echo   Inventory:         http://localhost:8082
echo ==================================================================================
echo.
echo [INFO] Dependency order:
echo   1. Frontend depends on API Gateway (localhost:8080)
echo   2. API Gateway depends on Authentication (localhost:8081)
echo   3. API Gateway depends on Inventory (localhost:8082)
echo   4. Authentication requires MongoDB
echo   5. Inventory requires MongoDB
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js 20 or later from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version: 
node --version
echo.

REM Check MongoDB local connection (optional - informational only)
echo [INFO] Checking required services...
echo [DEBUG] MongoDB connection string should be set in .env files
echo.

REM ==================================================================================
REM  Starting API Gateway (port 8080)
REM ==================================================================================
echo [INFO] Starting API Gateway (port 8080)...
start "Monarch - API Gateway (8080)" cmd /k ^
    "cd /d "%~dp0api-gateway" && ^
    echo. && ^
    echo [Monarch] API Gateway Starting... && ^
    echo [Monarch] Port: 8080 && ^
    echo [Monarch] Check http://localhost:8080/health && ^
    echo. && ^
    npm start"

timeout /t 2 /nobreak

REM ==================================================================================
REM  Starting Authentication Service (port 8081)
REM ==================================================================================
echo [INFO] Starting Authentication Service (port 8081)...
start "Monarch - Authentication (8081)" cmd /k ^
    "cd /d "%~dp0authentication" && ^
    echo. && ^
    echo [Monarch] Authentication Service Starting... && ^
    echo [Monarch] Port: 8081 && ^
    echo [Monarch] Check http://localhost:8081/health/auth && ^
    echo. && ^
    npm start"

timeout /t 2 /nobreak

REM ==================================================================================
REM  Starting Inventory Service (port 8082)
REM ==================================================================================
echo [INFO] Starting Inventory Service (port 8082)...
start "Monarch - Inventory (8082)" cmd /k ^
    "cd /d "%~dp0inventory" && ^
    echo. && ^
    echo [Monarch] Inventory Service Starting... && ^
    echo [Monarch] Port: 8082 && ^
    echo [Monarch] Check http://localhost:8082/health/inventory && ^
    echo. && ^
    npm start"

timeout /t 2 /nobreak

REM ==================================================================================
REM  Starting Frontend (port 3000)
REM ==================================================================================
echo [INFO] Starting Frontend (port 3000)...
start "Monarch - Frontend (3000)" cmd /k ^
    "cd /d "%~dp0frontend" && ^
    echo. && ^
    echo [Monarch] Frontend Service Starting... && ^
    echo [Monarch] Port: 3000 && ^
    echo [Monarch] Open http://localhost:3000 in your browser && ^
    echo. && ^
    npm start"

REM ==================================================================================
REM  All Services Started
REM ==================================================================================
echo.
echo ==================================================================================
echo  All Services Started!
echo ==================================================================================
echo.
echo [SUCCESS] Terminal windows opened for each service:
echo   - Monarch - API Gateway (8080)
echo   - Monarch - Authentication (8081)
echo   - Monarch - Inventory (8082)
echo   - Monarch - Frontend (3000)
echo.
echo Access the application at: http://localhost:3000
echo.
echo Service Health Checks:
echo   - API Gateway:   http://localhost:8080/health
echo   - Frontend:      http://localhost:3000
echo.
echo [INFO] To stop a service, close its terminal window.
echo [INFO] To stop all services, close all terminal windows.
echo.
echo ==================================================================================
echo.

endlocal
pause
