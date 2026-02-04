@echo off
echo 🚀 PREPARATION BUILD PRODUCTION - ENG RND
echo ==========================================

echo.
echo 📦 Etape 1: Installation des dependances...
cd eng-rd-clean
call npm install
if errorlevel 1 (
    echo ❌ Erreur installation dependances
    pause
    exit /b 1
)
cd ..

echo.
echo 🧹 Etape 2: Nettoyage des anciens builds...
if exist "build-public" rmdir /s /q "build-public"
if exist "build-admin" rmdir /s /q "build-admin"
if exist "eng-rd-clean\build" rmdir /s /q "eng-rd-clean\build"

echo.
echo 🌐 Etape 3: Build site public (sans admin)...
cd eng-rd-clean
set REACT_APP_BUILD_TYPE=public
call npm run build:public
if errorlevel 1 (
    echo ❌ Erreur lors du build public
    pause
    exit /b 1
)

echo ✅ Build public termine
cd ..
move "eng-rd-clean\build" "build-public"

echo.
echo 🔒 Etape 4: Build interface admin...
cd eng-rd-clean
set REACT_APP_BUILD_TYPE=admin
call npm run build:admin
if errorlevel 1 (
    echo ❌ Erreur lors du build admin
    pause
    exit /b 1
)

echo ✅ Build admin termine
cd ..
move "eng-rd-clean\build" "build-admin"

echo.
echo 📊 Etape 5: Verification des builds...
if exist "build-public\index.html" (
    echo ✅ Build public: OK
    dir "build-public" | find "File(s)"
) else (
    echo ❌ Build public: ERREUR
)

if exist "build-admin\index.html" (
    echo ✅ Build admin: OK
    dir "build-admin" | find "File(s)"
) else (
    echo ❌ Build admin: ERREUR
)

echo.
echo 🎯 BUILDS TERMINES !
echo 📁 build-public/  - Site public (eng-rnd.com)
echo 📁 build-admin/   - Interface admin (admin.eng-rnd.com)
echo.
echo ✅ Pret pour le deploiement !
echo 📖 Suivez maintenant: GUIDE_DEPLOIEMENT_COMPLET.md
pause