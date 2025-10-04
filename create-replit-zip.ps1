# Krokier App - Replit ZIP Creator
# Erstellt ein ZIP-File für den Upload auf Replit

Write-Host "`n🚀 Krokier App - Replit ZIP Creator" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Ziel-ZIP-Datei
$zipFile = "krokier-app-replit.zip"

# Zu inkludierende Dateien und Ordner
$itemsToZip = @(
    'src',
    'server',
    'public',
    'package.json',
    'package-lock.json',
    'index.html',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    '.replit',
    'replit.nix',
    '.replitignore',
    '.eslintrc.cjs',
    'README.md',
    'REPLIT_SETUP.md',
    'UPLOAD_CHECKLIST.md',
    'GITHUB_TO_REPLIT.md'
)

# Prüfe ob alle Dateien existieren
Write-Host "📋 Prüfe Dateien..." -ForegroundColor Yellow
$missingItems = @()
foreach ($item in $itemsToZip) {
    if (!(Test-Path $item)) {
        $missingItems += $item
        Write-Host "   ❌ Fehlt: $item" -ForegroundColor Red
    } else {
        Write-Host "   ✓ $item" -ForegroundColor Green
    }
}

if ($missingItems.Count -gt 0) {
    Write-Host "`n❌ Fehler: $($missingItems.Count) Dateien fehlen!" -ForegroundColor Red
    exit 1
}

# Lösche altes ZIP falls vorhanden
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
    Write-Host "`n🗑️  Altes ZIP gelöscht" -ForegroundColor Yellow
}

# Erstelle ZIP
Write-Host "`n📦 Erstelle ZIP-Datei..." -ForegroundColor Yellow
try {
    Compress-Archive -Path $itemsToZip -DestinationPath $zipFile -CompressionLevel Optimal -Force
    
    # Zeige Ergebnis
    $zipSize = (Get-Item $zipFile).Length / 1MB
    Write-Host "`n✅ ZIP erfolgreich erstellt!" -ForegroundColor Green
    Write-Host "   📁 Datei: $zipFile" -ForegroundColor White
    Write-Host "   📊 Größe: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White
    
    # Zeige Inhalt
    Write-Host "`n📋 Inhalt des ZIP:" -ForegroundColor Cyan
    $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $zipFile))
    $zip.Entries | Select-Object FullName | ForEach-Object {
        Write-Host "   - $($_.FullName)" -ForegroundColor White
    }
    $zip.Dispose()
    
    Write-Host "`n🎉 Fertig! Du kannst jetzt '$zipFile' auf Replit hochladen!" -ForegroundColor Green
    Write-Host "`n📝 Nächste Schritte:" -ForegroundColor Cyan
    Write-Host "   1. Gehe zu https://replit.com" -ForegroundColor White
    Write-Host "   2. Klicke auf 'Create Repl'" -ForegroundColor White
    Write-Host "   3. Wähle 'Import from GitHub' → 'Upload .zip'" -ForegroundColor White
    Write-Host "   4. Lade '$zipFile' hoch" -ForegroundColor White
    Write-Host "   5. Fertig!`n" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Fehler beim Erstellen des ZIP: $_" -ForegroundColor Red
    exit 1
}
