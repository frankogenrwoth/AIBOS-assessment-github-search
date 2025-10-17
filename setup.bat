@echo off

@REM Current directory
SET "CURRENT_DIR=%~dp0"

@REM Start backend server in a new terminal
start "Backend" ^
    /D "%CURRENT_DIR%backend" ^
    "%ComSpec%" /k "call .venv\Scripts\activate.bat && python manage.py runserver"

@REM Start frontend in a new terminal
start "Frontend" ^
    /D "%CURRENT_DIR%frontend" ^
    "%ComSpec%" /k npm start


