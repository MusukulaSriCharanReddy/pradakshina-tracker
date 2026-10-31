@echo off
title Pradakshina Tracker

echo ==============================================
echo        Starting Pradakshina Tracker
echo ==============================================
echo.

if not exist node_modules (
    echo node_modules not found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies.
        pause
        exit /b %errorlevel%
    )
)

echo Starting local development server...
echo Local:   http://localhost:3000
echo Network: http://0.0.0.0:3000
echo.
echo Press Ctrl+C in this window to stop the server.
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo Development server stopped unexpectedly.
    pause
)
