$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$ImageName = "prelegal"
$ContainerName = "prelegal"

try { docker rm -f $ContainerName 2>$null | Out-Null } catch {}

docker build -t $ImageName $RootDir

$envArgs = @()
$envFile = Join-Path $RootDir ".env"
if (Test-Path $envFile) {
    $envArgs = @("--env-file", $envFile)
}

docker run -d --name $ContainerName -p 8000:8000 @envArgs $ImageName

Write-Host "Prelegal is starting at http://localhost:8000"
