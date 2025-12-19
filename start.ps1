# Inicia Backend e Frontend com um único comando
# Windows PowerShell

param(
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$Install
)

# Se nenhum parâmetro foi especificado, iniciar ambos
$startAll = (-not $Backend -and -not $Frontend)

$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$projectRoot\backend")) {
    $projectRoot = $PSScriptRoot
}

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "🚀 Iniciando Controle Financeiro".PadRight(70) -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

if ($startAll -or $Backend) {
    $backendDir = Join-Path $projectRoot 'backend'
    $venvPython = Join-Path $backendDir '.venv/Scripts/python.exe'
    $reqFile = Join-Path $backendDir 'requirements.txt'

    if (-not (Test-Path $venvPython)) {
        Write-Host "🐍 Criando ambiente virtual do backend..." -ForegroundColor Yellow
        Push-Location $backendDir
        python -m venv .venv
        Pop-Location
    }

    if ($Install -or -not (Test-Path (Join-Path $backendDir '.venv/Lib/site-packages'))) {
        Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
        & $venvPython -m pip install --upgrade pip
        & $venvPython -m pip install -r $reqFile
    }

    Write-Host "⏳ Iniciando Backend (FastAPI)..." -ForegroundColor Yellow
    $cmd = "cd `"$backendDir`"; & `"$venvPython`" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
    Start-Process powershell -ArgumentList '-NoExit', '-Command', $cmd | Out-Null
    Start-Sleep -Seconds 2
    Write-Host "✅ Backend em http://127.0.0.1:8000 (Docs: /docs)" -ForegroundColor Green
}

if ($startAll -or $Frontend) {
    $frontendDir = Join-Path $projectRoot 'frontend'
    $nodeModules = Join-Path $frontendDir 'node_modules'
    if ($Install -or -not (Test-Path $nodeModules)) {
        Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
        Push-Location $frontendDir
        npm install
        Pop-Location
    }

    Write-Host "⏳ Iniciando Frontend (Vite)..." -ForegroundColor Yellow
    $cmd = "cd `"$frontendDir`"; npm run dev"
    Start-Process powershell -ArgumentList '-NoExit', '-Command', $cmd | Out-Null
    Start-Sleep -Seconds 2
    Write-Host "✅ Frontend em http://localhost:5173" -ForegroundColor Green
}

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "🎉 TUDO RODANDO!".PadRight(70) -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Abra: http://localhost:5173" -ForegroundColor White
Write-Host "📚 API Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host ""
