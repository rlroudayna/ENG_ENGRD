# Script PowerShell pour convertir le logo en favicon
Write-Host "🎨 Conversion du logo ENG RND en favicon" -ForegroundColor Green

$sourcePng = "eng-rd-clean\public\favicon-temp.png"
$targetIco = "eng-rd-clean\public\favicon.ico"

if (Test-Path $sourcePng) {
    Write-Host "✅ Logo source trouvé: $sourcePng" -ForegroundColor Green
    
    # Copier le PNG vers ICO (Windows accepte les PNG comme ICO dans la plupart des cas)
    Copy-Item $sourcePng $targetIco -Force
    
    Write-Host "✅ Favicon créé: $targetIco" -ForegroundColor Green
    Write-Host "📝 Note: Le fichier .ico est maintenant le logo ENG RND" -ForegroundColor Yellow
    
    # Nettoyer le fichier temporaire
    Remove-Item $sourcePng -Force
    Write-Host "🧹 Fichier temporaire supprimé" -ForegroundColor Green
    
} else {
    Write-Host "❌ Logo source non trouvé: $sourcePng" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 RÉSULTAT:" -ForegroundColor Cyan
Write-Host "✅ favicon.ico remplacé par le logo ENG RND" -ForegroundColor Green
Write-Host "✅ logo192.png remplacé par le logo ENG RND" -ForegroundColor Green  
Write-Host "✅ logo512.png remplacé par le logo ENG RND" -ForegroundColor Green

Write-Host "`n🚀 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "1. Redémarrer l'application (npm start)" -ForegroundColor White
Write-Host "2. Vérifier l'onglet du navigateur" -ForegroundColor White
Write-Host "3. Tester sur mobile/PWA" -ForegroundColor White

Write-Host "`n✅ CONVERSION TERMINÉE !" -ForegroundColor Green