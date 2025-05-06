<#
.SYNOPSIS
  Déploie backend + frontend sur App Runner avec environnement corrigé.
#>
[CmdletBinding()]
param()

# Préférences et encodages
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8

# Racine et .env
$repoRoot = Split-Path $PSScriptRoot -Parent
$envFile  = Join-Path $repoRoot '.env.prod'
if (-not (Test-Path $envFile)) {
    Write-Error ".env.prod introuvable dans $repoRoot"; exit 1
}

# Charger .env.prod
$map = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^[^#].*?=.*$') {
        $parts = $_ -split '=', 2
        $map[$parts[0].Trim()] = $parts[1].Trim(' "')
    }
}

# Variables clés
$tag          = if ($env:TAG) { $env:TAG } else { 'latest' }
$roleArn      = $map['APP_RUNNER_ROLE_ARN']
$backendRepo  = $map['BACKEND_ECR_URL']
$frontendRepo = $map['FRONTEND_ECR_URL']
$project      = $map['PROJECT_NAME']

# Clés pour persister ARN
$backendKey  = 'SERVICE_BACKEND_ARN'
$frontendKey = 'SERVICE_FRONTEND_ARN'

# Récupérer ARNs existants
$backendArn  = $map[$backendKey]
$frontendArn = $map[$frontendKey]
if (-not $backendArn) {
    Write-Host "🔍 Recherche ARN backend via list-services..."
    $backendArn = aws apprunner list-services `
        --query "ServiceSummaryList[?ServiceName=='$project-backend'].ServiceArn | [0]" `
        --output text
    $backendArn = $backendArn.Trim()
    if ($backendArn -eq 'None') { $backendArn = $null }
        
}
if (-not $frontendArn) {
    Write-Host "🔍 Recherche ARN frontend via list-services..."
    $frontendArn = aws apprunner list-services `
        --query "ServiceSummaryList[?ServiceName=='$project-frontend'].ServiceArn | [0]" `
        --output text
    $frontendArn = $frontendArn.Trim()
    if ($frontendArn -eq 'None') { $frontendArn = $null }
}

function Invoke-AppRunnerDeployment {
    param(
        [string] $ServiceName,
        [string] $ImageUri,
        [string] $ServiceArnVar,
        [int]    $Port,
        [string] $KeyName
    )

    Write-Host "`n🚀 App Runner: $ServiceName" -ForegroundColor Cyan

    # Construire le payload en utilisant directement la hashtable $map
    $cfg = @{
        AuthenticationConfiguration = @{ AccessRoleArn = $roleArn }
        ImageRepository             = @{
            ImageIdentifier     = "$ImageUri"
            ImageRepositoryType = 'ECR'
            ImageConfiguration  = @{
                Port                       = "$Port"
                RuntimeEnvironmentVariables = $map
            }
        }
    }

    # Écrire JSON sans BOM
    $jsonFile = Join-Path $env:TEMP "$($ServiceName)-config.json"
    $cfg | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonFile -Encoding Ascii

    # Création ou mise à jour
    if (-not $ServiceArnVar) {
        Write-Host "Création du service $ServiceName..."
        $arn = aws apprunner create-service `
            --service-name $ServiceName `
            --source-configuration file://$jsonFile `
            --instance-configuration Cpu=1024,Memory=2048 `
            --query 'Service.ServiceArn' --output text
        $arn = $arn.Trim()
        # Persister ARN
        $lines = Get-Content $envFile
        if ($lines -match "^$KeyName=") {
            $lines = $lines -replace "^$KeyName=.*$", "$KeyName=$arn"
        } else {
            $lines += "$KeyName=$arn"
        }
        $lines | Set-Content -Path $envFile -Encoding UTF8
        Write-Host "💾 $KeyName stocké dans .env.prod"
    } else {
        Write-Host "Mise à jour du service existant ($ServiceArnVar)..."
        aws apprunner update-service `
            --service-arn $ServiceArnVar `
            --source-configuration file://$jsonFile | Out-Null
        Write-Host "Service mis à jour: $ServiceArnVar" -ForegroundColor Green
        $arn = $ServiceArnVar
    }

    # Cleanup
    Remove-Item $jsonFile -Force

    # Attendre RUNNING
    do {
        Start-Sleep 5
        $status = aws apprunner describe-service `
            --service-arn $arn `
            --query 'Service.Status' --output text
        Write-Host "Statut = $status"
    } while ($status -ne 'RUNNING')

    # Récupérer et stocker l’URL
    $url = aws apprunner describe-service `
        --service-arn $arn `
        --query 'Service.ServiceUrl' --output text
    Write-Host "✅ $ServiceName -> $url" -ForegroundColor Green
    $urlKey = if ($ServiceName -like '*-backend') { 'REACT_APP_API_URL' } else { 'FRONTEND_URL' }
    $lines = Get-Content $envFile
    if ($lines -match "^$urlKey=") {
        $lines = $lines -replace "^$urlKey=.*$", "$urlKey=$url"
    } else {
        $lines += "$urlKey=$url"
    }
    $lines | Set-Content -Path $envFile -Encoding UTF8
}

# Exécuter backend + frontend
Invoke-AppRunnerDeployment `
    -ServiceName "${project}-backend" `
    -ImageUri "${backendRepo}:${tag}" `
    -ServiceArnVar $backendArn `
    -Port 3000 `
    -KeyName $backendKey

Invoke-AppRunnerDeployment `
    -ServiceName "${project}-frontend" `
    -ImageUri "${frontendRepo}:${tag}" `
    -ServiceArnVar $frontendArn `
    -Port 80 `
    -KeyName $frontendKey

Write-Host "`n[.env.prod] URLs finales :" -ForegroundColor Cyan
Get-Content $envFile `
    | Where-Object { $_ -match '^(REACT_APP_API_URL|FRONTEND_URL)=' } `
    | ForEach-Object { Write-Host "  $_" }
