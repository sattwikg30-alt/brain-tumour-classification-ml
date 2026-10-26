# ==============================================================================
# NeuroScan AI - Brain Tumor MRI Classification Single-Command Dev Launcher
# Starts FastAPI internal backend (127.0.0.1:8000) and Next.js frontend (localhost:3000)
# Browser URL: http://localhost:3000
# ==============================================================================

[CmdletBinding()]
param(
    [string]$HostAddress = "127.0.0.1",
    [int]$ApiPort = 8000,
    [int]$WebPort = 3000
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location -Path $ProjectRoot

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "  NEUROSCAN AI - BRAIN TUMOR MRI CLASSIFICATION & EXPLAINABILITY (GRAD-CAM)" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "  Starting unified full-stack development environment..." -ForegroundColor Gray
Write-Host ""

# 1. Verify Python & Virtual Environment
$PythonExe = Join-Path $ProjectRoot "venv\Scripts\python.exe"
if (-not (Test-Path $PythonExe)) {
    $PythonExe = (Get-Command python -ErrorAction SilentlyContinue)?.Source
    if (-not $PythonExe) {
        Write-Error "Python not found. Please install Python 3.10+ or set up venv."
        exit 1
    }
}
$PyVer = & $PythonExe --version 2>&1
Write-Host "  [OK] Python runtime : $PyVer ($PythonExe)" -ForegroundColor Green

# 2. Verify Node.js & npm
$NodeCmd = Get-Command node -ErrorAction SilentlyContinue
$NpmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $NodeCmd -or -not $NpmCmd) {
    Write-Error "Node.js or npm is not installed or not in system PATH."
    exit 1
}
$NodeVer = & node --version
$NpmVer = & npm --version
Write-Host "  [OK] Node.js & npm  : Node $NodeVer, npm $NpmVer" -ForegroundColor Green

# 3. Verify Model Checkpoint
$ModelFile = Join-Path $ProjectRoot "ml\models\efficientnet_b0.keras"
if (-not (Test-Path $ModelFile)) {
    Write-Error "Required model checkpoint not found at: $ModelFile"
    exit 1
}
$ModelSize = (Get-Item $ModelFile).Length / 1MB
Write-Host "  [OK] ML Model       : efficientnet_b0.keras ($('{0:N2}' -f $ModelSize) MB verified)" -ForegroundColor Green

# 4. Check Port Availability
$ExistingApi = Get-NetTCPConnection -LocalPort $ApiPort -State Listen -ErrorAction SilentlyContinue
if ($ExistingApi) {
    Write-Warning "Port $ApiPort is already in use by process ID $($ExistingApi.OwningProcess[0])."
}

$ExistingWeb = Get-NetTCPConnection -LocalPort $WebPort -State Listen -ErrorAction SilentlyContinue
if ($ExistingWeb) {
    Write-Warning "Port $WebPort is already in use by process ID $($ExistingWeb.OwningProcess[0])."
}

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Green
Write-Host "  SYSTEM READY: OPEN YOUR BROWSER AT:" -ForegroundColor Green
Write-Host "  >>> http://localhost:$WebPort <<<" -ForegroundColor Yellow -BackgroundColor Black
Write-Host "  (FastAPI runs internally on 127.0.0.1:$ApiPort via Next.js same-origin proxy)" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C to terminate both servers." -ForegroundColor Gray
Write-Host "================================================================================" -ForegroundColor Green
Write-Host ""

# 5. Launch concurrently
$ConcurrentlyBin = Join-Path $ProjectRoot "node_modules\.bin\concurrently.cmd"
if (Test-Path $ConcurrentlyBin) {
    & $ConcurrentlyBin -k -p "[{name}]" -n "API,WEB" -c "magenta.bold,cyan.bold" `
        "$PythonExe -m uvicorn backend.app.main:app --host $HostAddress --port $ApiPort" `
        "npm --prefix frontend run dev"
} else {
    # Fallback to direct background jobs
    Write-Host "Starting background FastAPI process..." -ForegroundColor Magenta
    $apiJob = Start-Process -FilePath $PythonExe -ArgumentList "-m uvicorn backend.app.main:app --host $HostAddress --port $ApiPort" -PassThru -NoNewWindow
    
    Write-Host "Starting Next.js frontend dev server..." -ForegroundColor Cyan
    $webJob = Start-Process -FilePath "npm" -ArgumentList "--prefix frontend run dev" -PassThru -NoNewWindow

    try {
        Wait-Process -Id $apiJob.Id, $webJob.Id
    } finally {
        Write-Host "`nStopping development servers..." -ForegroundColor Yellow
        Stop-Process -Id $apiJob.Id -Force -ErrorAction SilentlyContinue
        Stop-Process -Id $webJob.Id -Force -ErrorAction SilentlyContinue
    }
}