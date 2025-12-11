@echo off
REM Inicia Backend e Frontend - Windows Batch
REM Duplo clique para executar!

cd /d "%~dp0"

echo.
echo ======================================================================
echo  Iniciando Controle Financeiro
echo ======================================================================
echo.

REM Inicia Backend em nova janela
echo Iniciando Backend (FastAPI)...
cd backend
start cmd /k ".venv\Scripts\activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
cd ..

REM Aguarda um pouco
timeout /t 2 /nobreak

REM Inicia Frontend em nova janela
echo Iniciando Frontend (Vite)...
cd frontend
start cmd /k "npm run dev"
cd ..

REM Aguarda um pouco mais
timeout /t 2 /nobreak

echo.
echo ======================================================================
echo  TUDO RODANDO!
echo ======================================================================
echo.
echo Navegador: http://localhost:5173
echo API Docs:  http://127.0.0.1:8000/docs
echo.
pause
