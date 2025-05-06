<#
.SYNOPSIS
  Orchestrateur Prod : db → images → push → App Runner
#>
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8

# Variables & .env
$repoRoot = Split-Path $MyInvocation.MyCommand.Definition -Parent
$envFile  = Join-Path $repoRoot '.env.prod'
if (-not (Test-Path $envFile)) {
    Write-Error ".env.prod introuvable dans $repoRoot"
    exit 1
}

# Charger le contenu de .env.prod
$envLines = Get-Content $envFile

# Lire l'ancien tag (IMAGE_TAG)
$currentTag = 'latest'
foreach ($line in $envLines) {
    if ($line -match '^IMAGE_TAG=(.*)$') {
        $currentTag = $Matches[1]
        break
    }
}
$env:TAG = $currentTag
Write-Host "🕒 Tag actuel : $currentTag" -ForegroundColor Cyan

# Fonction de prompt
function Ask-YesNo {
    param(
        [string]$Question,
        [ValidateSet('O','N')][string]$Default = 'N'
    )
    $defaultPrompt = "[$Default]"
    do {
        $resp = Read-Host "$Question (O/N) $defaultPrompt"
        if ([string]::IsNullOrWhiteSpace($resp)) { $resp = $Default }
        $resp = $resp.Trim().ToUpper()
    } while ($resp -notin @('O', 'N', 'Y', 'YES', 'OUI', 'NON'))
    
    return $resp -in @('O', 'Y', 'YES', 'OUI')
}

Write-Host "=== deploy-prod.ps1 ===" -ForegroundColor Cyan

# Étape 1 : Infra (mise à jour DB & .env)
if (Ask-YesNo "1) Exécuter PROVISION infra & mise à jour .env.prod ?" 'O') {
    Write-Host "🚀 Lancement de l’étape 1…" -ForegroundColor Green
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'scripts\deploy-db.ps1')
} else {
    Write-Host "⏭️ Étape 1 SKIPPÉE." -ForegroundColor Yellow
}

# Étape 2 : Build local
if (Ask-YesNo "2) Exécuter BUILD des images (local) ?" 'O') {
    # Génération d'un nouveau tag
    $newTag = Get-Date -Format 'yyyyMMddHHmmss'
    $env:TAG = $newTag
    # Mise à jour de .env.prod (IMAGE_TAG)
    ($envLines) -replace '^IMAGE_TAG=.*$', "IMAGE_TAG=$newTag" |
      Set-Content -Path $envFile -Encoding UTF8
    Write-Host "🕒 Nouveau tag généré : $newTag" -ForegroundColor Cyan

    Write-Host "🚀 Lancement de l’étape 2…" -ForegroundColor Green
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'scripts\deploy-images.ps1')
} else {
    Write-Host "⏭️ Étape 2 SKIPPÉE, utilisation du tag existant : $currentTag" -ForegroundColor Yellow
}

# Étape 3 : Push ECR
if (Ask-YesNo "3) Exécuter PUSH des images vers ECR ?" 'O') {
    Write-Host "🚀 Lancement de l’étape 3…" -ForegroundColor Green
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'scripts\push-images.ps1')
} else {
    Write-Host "⏭️ Étape 3 SKIPPÉE." -ForegroundColor Yellow
}

# Étape 4 : Déploiement App Runner
if (Ask-YesNo "4) Exécuter DÉPLOIEMENT sur App Runner ?" 'O') {
    Write-Host "🚀 Lancement de l’étape 4…" -ForegroundColor Green
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'scripts\deploy-app-runner.ps1')
} else {
    Write-Host "⏭️ Étape 4 SKIPPÉE." -ForegroundColor Yellow
}

Write-Host "`n🎉 Déploiement PROD terminé !" -ForegroundColor Cyan
exit 0
