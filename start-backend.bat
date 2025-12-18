@echo off
echo ========================================
echo Starting DigiPIN Backend API Server
echo ========================================
echo.

cd server

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server on port 3001...
echo.
call npm start
