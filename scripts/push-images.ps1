<#
.SYNOPSIS
  Push des images Docker (backend + frontend) vers AWS ECR,
  avec isolation de l'auth Docker pour contourner un credential helper ECR non implémenté,
  et contrôle interactif de l'existence locale.
#>
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'

# 1) Chargement du .env.prod
$repoRoot = Split-Path $PSScriptRoot -Parent
$envFile  = Join-Path $repoRoot '.env.prod'
if (-not (Test-Path $envFile)) {
    Write-Error ".env.prod introuvable dans $repoRoot"; exit 1
}
$map = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $map[$matches[1].Trim()] = $matches[2].Trim()
    }
}

# 2) Variables principales
$tag          = if ($env:TAG) { $env:TAG } else { 'latest' }
$region       = $map['AWS_REGION']
$accountId    = $map['AWS_ACCOUNT_ID']
$backendRepo  = $map['BACKEND_ECR_URL']
$frontendRepo = $map['FRONTEND_ECR_URL']
if (-not $backendRepo -or -not $frontendRepo) {
    Write-Error "BACKEND_ECR_URL ou FRONTEND_ECR_URL manquant dans .env.prod"; exit 1
}

# 3) Préparer l'auth Docker → ECR isolée
$registry      = "$accountId.dkr.ecr.$region.amazonaws.com"
$tempConfigDir = Join-Path $env:TEMP 'docker-ecr-auth'

# 3.1) Créer dossier temporaire
if (Test-Path $tempConfigDir) {
    Remove-Item $tempConfigDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempConfigDir | Out-Null

# 3.2) Écrire un config.json minimal (ASCII, pas de BOM)
@'
{"credsStore":"desktop","auths":{}}
'@ | Set-Content -Path (Join-Path $tempConfigDir 'config.json') -Encoding ASCII

# 3.3) Bascule de DOCKER_CONFIG
$oldConfig          = $env:DOCKER_CONFIG
$env:DOCKER_CONFIG  = $tempConfigDir

# 3.4) Login Docker → ECR (isolé)
Write-Host "Connexion Docker → ECR $registry…" -NoNewline
cmd.exe /c "echo $(aws ecr get-login-password --region $region) | docker login --username AWS --password-stdin $registry" > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Docker login a échoué"
    $env:DOCKER_CONFIG = $oldConfig
    exit 1
}
Write-Host " OK" -ForegroundColor Green

# 3.5) Restauration de la config Docker originale
$env:DOCKER_CONFIG = $oldConfig

# 4) Tag, contrôle et Push
foreach ($svc in @('backend','frontend')) {
    $localTag = "${svc}:$tag"

    # 4.1) Vérifier présence locale
    if (-not (docker images -q $localTag)) {
        Write-Warning "⚠️ Image locale '$localTag' introuvable."
        $resp = Read-Host "  Voulez-vous tenter un build local de '$svc' ? (O/N) [N]"
        if ($resp.Trim().ToUpper() -eq 'O') {
            & (Join-Path $repoRoot 'scripts\deploy-images.ps1')
        } else {
            Write-Host "→ Push pour '$svc' SKIPPÉ." -ForegroundColor Yellow
            continue
        }
        # re-vérification
        if (-not (docker images -q $localTag)) {
            Write-Error "Impossible de construire '$localTag'. Abandon du push."
            exit 1
        }
    }

    $remoteRepo = if ($svc -eq 'backend') { $backendRepo } else { $frontendRepo }
    $remoteTag  = "${remoteRepo}:$tag"

    Write-Host "`nPushing $remoteTag..." -ForegroundColor Cyan
    docker tag  $localTag $remoteTag
    docker push $remoteTag
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Push de l'image $svc a échoué"; exit 1
    }
    Write-Host "✅ Pushed $remoteTag" -ForegroundColor Green
}

Write-Host "`n🎉 Toutes les images ont été poussées vers ECR." -ForegroundColor Cyan
