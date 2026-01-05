@echo off
echo Starting deployment setup...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0setup-deploy.ps1"
pause
