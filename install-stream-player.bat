@echo off
echo ===================================
echo ESC Radio Stream Player Setup
echo ===================================
echo.
echo Installing required packages...
echo.

cd /d "%~dp0"
npm install pusher-js laravel-echo

echo.
echo ===================================
echo Installation Complete!
echo ===================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Visit: http://localhost:3000/stream
echo.
echo Documentation:
echo - STREAM_PLAYER_SETUP.md (Full setup guide)
echo - MIGRATION_SUMMARY.md (Feature comparison)
echo.
pause
