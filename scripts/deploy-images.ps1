<#
.SYNOPSIS
  (Optionnel) nettoyage Docker, prébuild, puis build des images Docker (backend + frontend) en local.
#>
[CmdletBinding()]
param()

# Strict Mode & préférences
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8

# -------------------------
# 0) Variables & chemins
# -------------------------
$repoRoot    = Split-Path $PSScriptRoot -Parent
$envFile     = Join-Path $repoRoot '.env.prod'
$tag         = if ($env:TAG) { $env:TAG } else { 'latest' }
$backendDir  = Join-Path $repoRoot 'containers\backend'
$frontendDir = Join-Path $repoRoot 'containers\frontend'
$dockerfileBe= Join-Path $backendDir 'Dockerfile.prod'
$dockerfileFe= Join-Path $frontendDir 'Dockerfile.prod'

function Throw-Error {
    param([string]$Message)
    Write-Error $Message
    throw $Message
}

# -------------------------
# 1) Clean Docker (opt.)
# -------------------------
$ans = Read-Host '1/3 - Nettoyer Docker (conteneurs, images, volumes, réseaux, cache) ? (O/n)'
if ($ans -match '^[Oo]') {
    Write-Host '🧹 Nettoyage Docker...' -ForegroundColor Yellow
    docker container prune -f
    docker image prune -a -f
    docker volume prune -f
    docker network prune -f
    docker builder prune -af
    Write-Host '✅ Docker purgé.' -ForegroundColor Green
} else {
    Write-Host '⏭️ Nettoyage SKIPPÉ.' -ForegroundColor Cyan
}

# -------------------------
# 2) Prébuild (types) optionnel
# -------------------------
$pb = Read-Host '2/3 - Regénérer dynamiquement les types du projet (prébuild) ? (O/n)'
if ($pb -match '^[Oo]') {
    Write-Host "`n2/3 - Prébuild : génération des types..." -ForegroundColor Cyan
    if (-not (Test-Path $envFile)) {
        Throw-Error ".env.prod introuvable : $envFile"
    }

    # Fichier docker-compose pour le prébuild et nom de service
    $prebuildFile = Join-Path $repoRoot 'docker-compose.prebuild.yml'
    $serviceName  = 'prebuild'

    Write-Host "🔧 Lancement du prébuild via docker-compose run --rm ($serviceName)…"
    docker-compose --env-file $envFile `
        -f $prebuildFile `
        run --rm $serviceName
    if ($LASTEXITCODE -ne 0) {
        Throw-Error "❌ Échec du prébuild (code $LASTEXITCODE)"
    }

    Write-Host '✅ Prébuild terminé.' -ForegroundColor Green
} else {
    Write-Host "`n⏭️ Prébuild SKIPPÉ, les types existants seront réutilisés." -ForegroundColor Cyan
}

# -------------------------
# 3) Build des images
# -------------------------
Write-Host "`n3/3 - Build images prod (local)..." -ForegroundColor Cyan

# 3.1) Backend
Write-Host "🔨 Build backend:$tag..." -ForegroundColor Cyan
if (-not (Test-Path $backendDir)) {
    Throw-Error "❌ Dossier backend introuvable : $backendDir"
}
if (-not (Test-Path $dockerfileBe)) {
    Throw-Error "❌ Dockerfile backend introuvable : $dockerfileBe"
}

docker build `
    -f $dockerfileBe `
    -t "backend:$tag" `
    $backendDir

if ($LASTEXITCODE -ne 0) {
    Throw-Error "❌ Build backend a échoué (exit code $LASTEXITCODE)"
}

# 3.2) Frontend
Write-Host "🔨 Build frontend:$tag..." -ForegroundColor Cyan
if (-not (Test-Path $frontendDir)) {
    Throw-Error "❌ Dossier frontend introuvable : $frontendDir"
}
if (-not (Test-Path $dockerfileFe)) {
    Throw-Error "❌ Dockerfile frontend introuvable : $dockerfileFe"
}

docker build `
    -f $dockerfileFe `
    -t "frontend:$tag" `
    $frontendDir

if ($LASTEXITCODE -ne 0) {
    Throw-Error "❌ Build frontend a échoué (exit code $LASTEXITCODE)"
}

# 3.3) Confirmation
Write-Host "✅ Images buildées localement : backend:$tag, frontend:$tag" -ForegroundColor Green
