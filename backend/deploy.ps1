param(
  [string]$Stage = "staging",
  [string]$Profile = "",
  [switch]$SkipBuild = $false,
  [switch]$Help = $false
)

$ErrorActionPreference = 'Stop'

# Ensure we run from the backend directory where this script resides
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

function Write-ColorOutput {
  param(
    [string]$Message,
    [System.ConsoleColor]$ForegroundColor = [System.ConsoleColor]::White
  )
  Write-Host $Message -ForegroundColor $ForegroundColor
}

if ($Help) {
  Write-Host "Usage: .\deploy.ps1 [-Stage staging|prod] [-Profile profile] [-SkipBuild]"
  exit 0
}

if ($Stage -notin @('staging','prod')) {
  Write-ColorOutput "Error: Stage must be either 'staging' or 'prod'." Red
  exit 1
}

Write-ColorOutput "IFAD Portal Deployment" Blue
Write-ColorOutput "Stage: $Stage" Yellow
if ($Profile) { Write-ColorOutput ("AWS Profile: {0}" -f $Profile) Yellow } else { Write-ColorOutput "AWS Profile: default" Yellow }

if ($Profile) { $env:AWS_PROFILE = $Profile }

if (Test-Path ".env") {
  Write-ColorOutput "Loading .env..." Blue
  Get-Content ".env" | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)\s*$') {
      $name = $matches[1].Trim()
      $value = $matches[2].Trim()
      [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
  }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-ColorOutput "Node.js is required" Red; exit 1 }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-ColorOutput "npm is required" Red; exit 1 }

$cdkCmd = (Get-Command cdk -ErrorAction SilentlyContinue)
if (-not $cdkCmd) {
  if (Test-Path ".\node_modules\.bin\cdk.cmd") { $cdkCmd = ".\node_modules\.bin\cdk.cmd" } else { npm install aws-cdk | Out-Null; $cdkCmd = ".\node_modules\.bin\cdk.cmd" }
}

Write-ColorOutput "Verifying AWS credentials..." Blue
$awsIdentity = aws sts get-caller-identity 2>$null
if ($LASTEXITCODE -ne 0 -or -not $awsIdentity) { Write-ColorOutput "AWS credentials not configured or invalid." Red; exit 1 }

if (-not $SkipBuild) {
  Write-ColorOutput "Building backend..." Blue
  npm run build
}

$layerPath = Join-Path "lambda" "layers\shared\nodejs"
if (Test-Path $layerPath) { Push-Location $layerPath; npm install --production | Out-Null; Pop-Location }

Write-ColorOutput "Bootstrapping CDK (if needed)..." Blue
& $cdkCmd bootstrap --context stage=$Stage | Out-Null

Write-ColorOutput "Deploying stack..." Blue
& $cdkCmd deploy --context stage=$Stage --require-approval never

Write-ColorOutput "Deployment finished." Green
