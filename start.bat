@echo off
REM Wrapper: chama o PowerShell robusto
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
