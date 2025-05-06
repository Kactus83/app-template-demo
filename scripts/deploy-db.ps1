<#
.SYNOPSIS
  Provisionne l’infra AWS et met à jour .env.prod :
    • Génère infra/terraform.tfvars à partir de .env.prod (ou invite à saisir si manquant)
    • Terraform init & apply
    • Met à jour .env.prod avec :
        - DATABASE_URL
        - POSTGRES_HOST
        - POSTGRES_PORT
        - BACKEND_ECR_URL
        - FRONTEND_ECR_URL
        - APP_RUNNER_ROLE_ARN
#>
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'

# 0) Chemins
$scriptDir = $PSScriptRoot
$repoRoot  = Split-Path $scriptDir -Parent
$envFile   = Join-Path $repoRoot '.env.prod'
$infraDir  = Join-Path $repoRoot 'infra'
$tfvars    = Join-Path $infraDir 'terraform.tfvars'

# 1) Charger .env.prod
if (-not (Test-Path $envFile)) {
    Write-Error ".env.prod introuvable à la racine ($repoRoot)"; exit 1
}
$envLines = Get-Content $envFile | Where-Object { $_ -and ($_ -notmatch '^\s*#') }
$envMap   = @{}
foreach ($line in $envLines) {
    if ($line -match '^\s*([^=]+)=(.*)$') {
        $key   = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        $envMap[$key] = $value
    }
}

# 2) Préparer les variables Terraform
$vars = @{
    aws_region     = $envMap['AWS_REGION']
    aws_account_id = $envMap['AWS_ACCOUNT_ID']
    project_name   = $envMap['PROJECT_NAME']
    db_name        = $envMap['POSTGRES_DB']
    db_user        = $envMap['POSTGRES_USER']
    db_password    = $envMap['POSTGRES_PASSWORD']
}

# 3) Prompt + écriture si manquant
foreach ($k in 'aws_region','aws_account_id','project_name','db_name','db_user','db_password') {
    if (-not $vars[$k]) {
        do {
            $prompt = switch ($k) {
                'aws_region'     {'Région AWS (ex: eu-west-3)'}
                'aws_account_id' {'ID du compte AWS'}
                'project_name'   {'Nom de projet (PROJECT_NAME)'}
                'db_name'        {'Nom de la base (POSTGRES_DB)'}
                'db_user'        {'Utilisateur DB (POSTGRES_USER)'}
                'db_password'    {'Mot de passe DB (POSTGRES_PASSWORD)'}
            }
            $val = Read-Host "$prompt :"
        } while (-not $val)
        $vars[$k] = $val
        # Mise à jour .env.prod
        $lines = Get-Content $envFile
        if ($lines -match "^$k=") {
            $lines = $lines -replace "^$k=.*$", "$k=$val"
        } else {
            $lines += "$k=$val"
        }
        $lines | Set-Content -Path $envFile -Encoding UTF8
    }
}
Write-Host "✅ Variables Terraform prêtes."

# 4) Génération de terraform.tfvars
$tfVarsContent = @"
aws_region            = "$($vars['aws_region'])"
aws_account_id        = "$($vars['aws_account_id'])"
project_name          = "$($vars['project_name'])"
db_name               = "$($vars['db_name'])"
db_user               = "$($vars['db_user'])"
db_password           = "$($vars['db_password'])"
db_access_cidr_blocks = ["0.0.0.0/0"]
"@
$tfVarsContent | Set-Content -Path $tfvars -Encoding UTF8
Write-Host "✅ terraform.tfvars généré dans infra/"

# 5) Terraform init & apply
Write-Host "=== Terraform apply dans infra/ ===" -ForegroundColor Cyan
Push-Location $infraDir
terraform init -input=false | Out-Null
terraform apply -auto-approve
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Terraform apply a échoué"; Pop-Location; exit 1
}
$tfRaw = terraform output -json
Pop-Location
$tf = $tfRaw | ConvertFrom-Json

# 6) Injection des outputs Terraform
$content = Get-Content $envFile

# DATABASE_URL
if ($content -match '^DATABASE_URL=') {
    $content = $content -replace '^DATABASE_URL=.*$', "DATABASE_URL=`"postgresql://$($vars.db_user):$($vars.db_password)@$($tf.db_endpoint.value)?schema=public`""
} else {
    $content += "DATABASE_URL=`"postgresql://$($vars.db_user):$($vars.db_password)@$($tf.db_endpoint.value)?schema=public`""
}

# POSTGRES_HOST
if ($content -match '^POSTGRES_HOST=') {
    $content = $content -replace '^POSTGRES_HOST=.*$', "POSTGRES_HOST=$($tf.db_host.value)"
} else {
    $content += "POSTGRES_HOST=$($tf.db_host.value)"
}

# POSTGRES_PORT
if ($content -match '^POSTGRES_PORT=') {
    $content = $content -replace '^POSTGRES_PORT=.*$', "POSTGRES_PORT=$($tf.db_port.value)"
} else {
    $content += "POSTGRES_PORT=$($tf.db_port.value)"
}

# BACKEND_ECR_URL
if ($content -match '^BACKEND_ECR_URL=') {
    $content = $content -replace '^BACKEND_ECR_URL=.*$', "BACKEND_ECR_URL=$($tf.ecr_backend_url.value)"
} else {
    $content += "BACKEND_ECR_URL=$($tf.ecr_backend_url.value)"
}

# FRONTEND_ECR_URL
if ($content -match '^FRONTEND_ECR_URL=') {
    $content = $content -replace '^FRONTEND_ECR_URL=.*$', "FRONTEND_ECR_URL=$($tf.ecr_frontend_url.value)"
} else {
    $content += "FRONTEND_ECR_URL=$($tf.ecr_frontend_url.value)"
}

# APP_RUNNER_ROLE_ARN
if ($content -match '^APP_RUNNER_ROLE_ARN=') {
    $content = $content -replace '^APP_RUNNER_ROLE_ARN=.*$', "APP_RUNNER_ROLE_ARN=$($tf.app_runner_role_arn.value)"
} else {
    $content += "APP_RUNNER_ROLE_ARN=$($tf.app_runner_role_arn.value)"
}

# Écriture finale
$content | Set-Content -Path $envFile -Encoding UTF8
Write-Host "✅ .env.prod mis à jour (DATABASE_URL, POSTGRES_HOST, POSTGRES_PORT, BACKEND_ECR_URL, FRONTEND_ECR_URL, APP_RUNNER_ROLE_ARN)." -ForegroundColor Green

# 7) Test de connectivité RDS
$endpoint = $tf.db_endpoint.value
if ($endpoint -notmatch '^(?<h>[^:]+):(?<p>\d+)$') {
    Write-Error "Format inattendu pour endpoint : $endpoint"; exit 1
}
$dbHost = $Matches['h']; $port = $Matches['p']

Write-Host "`n[Test] Connectivité réseau $dbHost`:$port"
for ($i=0; $i -lt 12; $i++) {
    if ((Test-NetConnection -ComputerName $dbHost -Port $port).TcpTestSucceeded) {
        Write-Host "→ OK" -ForegroundColor Green
        break
    }
    Start-Sleep 5
}
if (-not (Test-NetConnection -ComputerName $dbHost -Port $port).TcpTestSucceeded) {
    Write-Error "❌ Port $port injoignable sur $dbHost"; exit 1
}

Write-Host "`n✅ RDS provisionnée et accessible !" -ForegroundColor Green
