@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo     YouTube Shorts Automation Launcher
echo ===================================================

:: 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. 
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: 2. Check for node_modules
if not exist "node_modules\" (
    echo [INFO] node_modules folder not found.
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b
    )
)

:: 3. Run Environment Setup Checklist
echo [INFO] Running environment check...
call node scripts/setup.js
if %errorlevel% neq 0 (
    echo [ERROR] Environment check failed.
    echo Please check your .env file or config/config.json.
    pause
    exit /b
)

:: 4. Launch Application
echo [INFO] Starting Application...

:: Start the Vite dev server in a new window
echo [INFO] Starting Renderer Dev Server...
start "Shorts Uploader - Vite" cmd /c npm run renderer:dev

:: Wait for Vite to be ready (loop check)
echo [INFO] Waiting for UI to be ready...
:WAIT_VITE
timeout /t 2 >nul
powershell -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1', 3000); $c.Close(); exit 0 } catch { exit 1 }"
if %errorlevel% neq 0 (
    echo [INFO] Server still warming up...
    goto WAIT_VITE
)

echo [INFO] UI is Ready! Launching Electron Dashboard...
call npm run dev

if %errorlevel% neq 0 (
    echo [ERROR] Application exited with error code %errorlevel%.
)

pause
