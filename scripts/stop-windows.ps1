$ContainerName = "prelegal"

$removed = $null
try { $removed = docker rm -f $ContainerName 2>$null } catch {}

if ($LASTEXITCODE -eq 0 -and $removed) {
    Write-Host "Prelegal stopped."
} else {
    Write-Host "Prelegal is not running."
}
