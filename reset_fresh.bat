@echo off
TITLE YouTube Shorts - Reset App State
CLS
echo ===================================================
echo    YouTube Shorts Automation - RESET TOOL
echo ===================================================
echo.
echo WARNING: This will:
echo   1. Clear all PENDING videos in queue
echo   2. Reset UPLOADED count to 0
echo   3. Reset FAILED count to 0
echo   4. Set NEXT EPISODE to 199
echo.
set /p confirm="Are you sure you want a fresh start? (y/n): "
if /i "%confirm%" neq "y" (
    echo.
    echo Reset cancelled.
    pause
    exit
)
echo.
echo Resetting state...
node scripts/reset_app.js
echo.
echo DONE! You can now start the bot. 
pause
