@echo off
title MU Chibi Squad - Dev Server
cd /d "%~dp0src"
echo.
echo  ===============================
echo    MU Chibi Squad - Dev Server
echo  ===============================
echo.
echo  Starting Vite dev server...
echo  Open http://localhost:5173 in browser
echo  Press Ctrl+C to stop
echo.
npm run dev
pause
