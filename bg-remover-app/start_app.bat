@echo off
echo Starting Background Remover App...

:: Start Backend
start "Backend Server" cmd /k "cd backend && pip install -r requirements.txt && python main.py"

:: Start Frontend
start "Frontend Dashboard" cmd /k "cd frontend_next && npm install && npm run dev"

echo.
echo Application keys:
echo   - Backend: http://localhost:8000
echo   - Frontend: http://localhost:5173
echo.
echo Please wait for dependencies to install in the new windows...
