<#
.SYNOPSIS
  Orchestrateur de développement :
    1) (Optionnel) Nettoyage Docker
    2) Prébuild (génération des types)
    3) Build & démarrage de la stack dev
    4) Affichage des logs backend & frontend
#>
[CmdletBinding()] param()
$ErrorActionPreference = 'Stop'

function Wait-ForUser {
    param([string]$Message = 'Appuyez sur Entrée pour continuer...')
    Write-Host ""
    Write-Host $Message -ForegroundColor DarkGray
    [void][System.Console]::ReadLine()
}

function Confirm {
    param(
        [string]$Question,
        [bool]  $DefaultYes = $true
    )
    if ($DefaultYes) {
        $prompt = "$Question (O/n)"
    } else {
        $prompt = "$Question (o/N)"
    }
    while ($true) {
        $ans = Read-Host $prompt
        if ([string]::IsNullOrWhiteSpace($ans)) {
            return $DefaultYes
        }
        switch ($ans.Trim().ToLower()) {
            'o'   { return $true }
            'y'   { return $true }
            'yes' { return $true }
            'n'   { return $false }
            'no'  { return $false }
            default {
                Write-Host "Veuillez répondre par O ou N." -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "=== Lancement deploy-dev.ps1 ===" -ForegroundColor Cyan

# 1) Nettoyage Docker (optionnel)
if (Confirm 'Voulez-vous nettoyer Docker (conteneurs, images, volumes, réseaux, cache) ?' $false) {
    Write-Host "" 
    Write-Host "[1/4] Nettoyage Docker…" -ForegroundColor Yellow
    docker container prune -f
    docker image prune    -a -f
    docker volume prune   -f
    docker network prune  -f
    docker builder prune  -af
    Write-Host "✅ Docker purgé." -ForegroundColor Green
} else {
    Write-Host "" 
    Write-Host "[1/4] Nettoyage Docker SKIPPÉ." -ForegroundColor Cyan
}

# 2) Prébuild (génération des types)
Write-Host ""
Write-Host "[2/4] Prébuild : génération des types…" -ForegroundColor Cyan
if (Confirm 'Prêt à lancer le service prebuild ?' $true) {
    $prebuildFile = 'docker-compose.prebuild.yml'
    docker-compose --env-file .env.dev -f $prebuildFile up --build --abort-on-container-exit
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Échec du prébuild via $prebuildFile"
        exit 1
    }
    # Arrêt/cleanup du conteneur prebuild
    docker-compose --env-file .env.dev -f $prebuildFile down --remove-orphans
    Write-Host "✅ Prébuild terminé." -ForegroundColor Green
} else {
    Write-Host "⚠️  Prébuild SKIPPÉ selon votre choix." -ForegroundColor Yellow
}

# 3) Build & montée (ou run seul) de la stack de développement
Write-Host ""
Write-Host "[3/4] Démarrage des services dev (docker-compose.dev.yml)..." -ForegroundColor Cyan

if (Confirm 'Voulez-vous builder et démarrer les services dev (build + up) ?' $true) {
    $devFile = 'docker-compose.dev.yml'
    docker-compose --env-file .env.dev -f $devFile up --build -d
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Échec du démarrage des services dev via $devFile"
        exit 1
    }
    Write-Host "✅ Services dev BUILDÉS et démarrés : database, blockchain, mailhog, backend, frontend." -ForegroundColor Green

} elseif (Confirm 'Voulez-vous uniquement démarrer les services existants (up sans build) ?' $true) {
    $devFile = 'docker-compose.dev.yml'
    docker-compose --env-file .env.dev -f $devFile up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Échec du démarrage (up) des services dev via $devFile"
        exit 1
    }
    Write-Host "✅ Services dev démarrés sans build : database, blockchain, mailhog, backend, frontend." -ForegroundColor Green

} else {
    Write-Host "⚠️  Démarrage des services dev SKIPPÉ selon votre choix." -ForegroundColor Yellow
}

# 4) Affichage des logs
Write-Host ""
Write-Host "[4/4] Affichage des logs (Ctrl+C pour interrompre)" -ForegroundColor Cyan
$devFile = 'docker-compose.dev.yml'
docker-compose --env-file .env.dev -f $devFile logs -f
