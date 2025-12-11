# Inicia Backend e Frontend com um único comando
# Windows PowerShell

param(
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$All = $true
)

$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$projectRoot\backend")) {
    $projectRoot = $PSScriptRoot
}

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "🚀 Iniciando Controle Financeiro".PadRight(70) -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

if ($All -or $Backend) {
    Write-Host "⏳ Iniciando Backend (FastAPI)..." -ForegroundColor Yellow
    
    $backendCmd = @"
    cd "$projectRoot\backend"
    .\.venv\Scripts\Activate.ps1
    uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
    Start-Sleep -Seconds 2
    
    Write-Host "✅ Backend iniciado em http://127.0.0.1:8000" -ForegroundColor Green
    Write-Host "   Docs: http://127.0.0.1:8000/docs" -ForegroundColor Gray
    Write-Host ""
}

if ($All -or $Frontend) {
    Write-Host "⏳ Iniciando Frontend (Vite)..." -ForegroundColor Yellow
    
    $frontendCmd = @"
    cd "$projectRoot\frontend"
    npm run dev
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd
    Start-Sleep -Seconds 2
    
    Write-Host "✅ Frontend iniciado em http://localhost:5173" -ForegroundColor Green
    Write-Host ""
}

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "🎉 TUDO RODANDO!".PadRight(70) -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Abra seu navegador em: http://localhost:5173" -ForegroundColor White
Write-Host "📚 API Docs em: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host ""
