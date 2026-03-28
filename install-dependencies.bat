@echo off
REM ==================================================================================
REM  Monarch Microservices - Install Dependencies and Build
REM ==================================================================================
REM
REM  This script installs npm dependencies for all services and builds TypeScript projects.
REM  Requires: Node.js >= 20 and npm
REM
REM  Services:
REM    - api-gateway (port 8080) - JavaScript, no build needed
REM    - authentication (port 8081) - TypeScript, requires build
REM    - inventory (port 8082) - TypeScript, requires build
REM    - frontend (port 3000) - Next.js/React, requires build
REM  ==================================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

REM Color codes for output
for /F %%A in ('copy /Z "%~f0" nul') do set "BS=%%A"

echo.
echo ==================================================================================
echo  Monarch Project - Dependency Installation and Build
echo ==================================================================================
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
echo [INFO] npm version:
npm --version
echo.

set "success_count=0"
set "fail_count=0"

REM ==================================================================================
REM  API Gateway (JavaScript - no build needed)
REM ==================================================================================
echo.
echo ==================================================================================
echo  1/4 Installing API Gateway dependencies...
echo ==================================================================================
cd /d "%~dp0api-gateway"
if not exist "package.json" (
    echo [ERROR] package.json not found in api-gateway directory
    set /a fail_count+=1
    goto inventory_install
)

echo [INFO] Current directory: !CD!
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install api-gateway dependencies
    set /a fail_count+=1
) else (
    echo [SUCCESS] API Gateway dependencies installed
    set /a success_count+=1
)

REM ==================================================================================
REM  Authentication Service (TypeScript)
REM ==================================================================================
:inventory_install
echo.
echo ==================================================================================
echo  2/4 Installing Authentication Service dependencies...
echo ==================================================================================
cd /d "%~dp0authentication"
if not exist "package.json" (
    echo [ERROR] package.json not found in authentication directory
    set /a fail_count+=1
    goto inventory_service_install
)

echo [INFO] Current directory: !CD!
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install authentication dependencies
    set /a fail_count+=1
    goto inventory_service_install
) else (
    echo [SUCCESS] Authentication dependencies installed
    set /a success_count+=1
)

echo [INFO] Building Authentication Service...
call npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build authentication service
    set /a fail_count+=1
) else (
    echo [SUCCESS] Authentication Service built successfully
    set /a success_count+=1
)

REM ==================================================================================
REM  Inventory Service (TypeScript)
REM ==================================================================================
:inventory_service_install
echo.
echo ==================================================================================
echo  3/4 Installing Inventory Service dependencies...
echo ==================================================================================
cd /d "%~dp0inventory"
if not exist "package.json" (
    echo [ERROR] package.json not found in inventory directory
    set /a fail_count+=1
    goto frontend_install
)

echo [INFO] Current directory: !CD!
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install inventory dependencies
    set /a fail_count+=1
    goto frontend_install
) else (
    echo [SUCCESS] Inventory dependencies installed
    set /a success_count+=1
)

echo [INFO] Building Inventory Service...
call npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build inventory service
    set /a fail_count+=1
) else (
    echo [SUCCESS] Inventory Service built successfully
    set /a success_count+=1
)

REM ==================================================================================
REM  Frontend (Next.js)
REM ==================================================================================
:frontend_install
echo.
echo ==================================================================================
echo  4/4 Installing Frontend dependencies...
echo ==================================================================================
cd /d "%~dp0frontend"
if not exist "package.json" (
    echo [ERROR] package.json not found in frontend directory
    set /a fail_count+=1
    goto installation_complete
)

echo [INFO] Current directory: !CD!
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    set /a fail_count+=1
    goto installation_complete
) else (
    echo [SUCCESS] Frontend dependencies installed
    set /a success_count+=1
)

echo [INFO] Building Frontend...
call npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build frontend
    set /a fail_count+=1
) else (
    echo [SUCCESS] Frontend built successfully
    set /a success_count+=1
)

REM ==================================================================================
REM  Installation Summary
REM ==================================================================================
:installation_complete
echo.
echo.
echo ==================================================================================
echo  Installation Summary
echo ==================================================================================
echo [SUCCESS] Completed operations: !success_count!
echo [FAILED]  Failed operations:    !fail_count!
echo.
if !fail_count! equ 0 (
    echo [SUCCESS] All dependencies installed and TypeScript services built successfully!
    echo.
    echo You can now run: start-services.bat
) else (
    echo [WARNING] Some operations failed. Please check the errors above.
)
echo ==================================================================================
echo.
pause
endlocal
