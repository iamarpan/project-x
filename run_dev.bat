@echo off
TITLE AI Interview Assistant - Development Environment

echo Starting AI Interview Assistant development environment...

:: Check for prerequisites
where node >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js not found. Please install Node.js v16+
    exit /b 1
)

where python >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python not found. Please install Python 3.10+
    exit /b 1
)

:: Start backend
echo Starting backend server...
cd backend

IF NOT EXIST .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

call .venv\Scripts\activate.bat
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to activate virtual environment
    exit /b 1
)

pip install -r requirements.txt
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to install backend dependencies
    exit /b 1
)

IF NOT EXIST .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

echo Starting backend server on http://localhost:8000...
start cmd /k "call .venv\Scripts\activate.bat && uvicorn app.main:app --reload"
cd ..

:: Start frontend
echo Starting frontend server...
cd frontend
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies
    exit /b 1
)

echo Starting frontend server on http://localhost:3000...
start cmd /k "npm start"
cd ..

echo.
echo Services started:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:8000
echo - API Documentation: http://localhost:8000/docs
echo Close the command windows to stop the services.
echo. 