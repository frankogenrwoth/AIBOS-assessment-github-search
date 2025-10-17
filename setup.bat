@echo off

@REM Current directory
SET "CURRENT_DIR=%~dp0"

@REM Change to backend directory
cd /d "%CURRENT_DIR%backend"

@REM Activate virtual environment
call "%CD%\.venv\Scripts\activate.bat"

@REM Start backend server
call python manage.py runserver

@REM Start frontend in a new terminal
start "Frontend" ^
    /D "%CURRENT_DIR%frontend" ^
    "%ComSpec%" /k npm start


