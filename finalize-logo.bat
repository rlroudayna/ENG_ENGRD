@echo off
echo 🎨 Finalisation du logo ENG RND
echo.

set SOURCE=eng-rd-clean\public\favicon-temp.png
set TARGET=eng-rd-clean\public\favicon.ico

if exist "%SOURCE%" (
    echo ✅ Logo source trouve: %SOURCE%
    copy "%SOURCE%" "%TARGET%" >nul
    echo ✅ Favicon cree: %TARGET%
    del "%SOURCE%" >nul
    echo 🧹 Fichier temporaire supprime
) else (
    echo ❌ Logo source non trouve: %SOURCE%
    exit /b 1
)

echo.
echo 🎯 RESULTAT:
echo ✅ favicon.ico remplace par le logo ENG RND
echo ✅ logo192.png remplace par le logo ENG RND  
echo ✅ logo512.png remplace par le logo ENG RND
echo.
echo 🚀 PROCHAINES ETAPES:
echo 1. Redemarrer l'application (npm start)
echo 2. Verifier l'onglet du navigateur
echo 3. Tester sur mobile/PWA
echo.
echo ✅ CONVERSION TERMINEE !
pause