@echo off
REM ==================================
REM  Chat App - Auto Setup Script
REM ==================================

echo.
echo [*] Anonymous Chat System Setup
echo [*] =============================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo [INFO] Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm not found!
    pause
    exit /b 1
)

echo [OK] npm found
npm --version
echo.

REM Install dependencies
echo [*] Installing dependencies...
call npm install

if errorlevel 1 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)

echo.
echo [OK] Installation complete!
echo.
echo ========================================
echo  Setup finished! To start the server:
echo ========================================
echo.
echo   npm start
echo.
echo  Then open browser to:
echo   http://localhost:3000/chat.html
echo.
echo ========================================
echo.

pause
