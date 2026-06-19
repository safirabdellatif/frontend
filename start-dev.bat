@echo off
title MySanad Dev Starter
color 0A

echo ==========================================
echo   MySanad - Starting Dev Environment
echo ==========================================
echo.

:: ---- Backend ----
echo [1/3] Installing backend packages...
cd /d "%~dp0backend"
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ERROR: pip install failed. Is Python installed?
    pause
    exit /b 1
)

echo [2/3] Starting Backend on http://localhost:8000 ...
start "MySanad Backend" cmd /k "cd /d "%~dp0backend" && set PYTHONPATH=. && uvicorn app.main:app --reload --port 8000"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: ---- Frontend ----
echo [3/3] Starting Frontend on http://localhost:3000 ...
start "MySanad Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==========================================
echo   Both servers are starting!
echo   Backend  --> http://localhost:8000/docs
echo   Frontend --> http://localhost:3000
echo ==========================================
echo.
echo Close this window when done.
pause
