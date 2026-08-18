@echo off
if "%1"=="" (
  echo Usage: make_video.bat script.json
  echo Example: make_video.bat sample_script.json
  pause
  exit /b
)
python main.py --script %1
pause
