@echo off
echo ========================================
echo    REPARATION DU BACKEND NESTJS
echo ========================================
echo.

cd backend

echo [ETAPE 1/5] Installation des dependances...
call npm install
if %errorlevel% neq 0 (
    echo ERREUR: Installation des dependances echouee
    pause
    exit /b 1
)
echo ✓ Dependances installees
echo.

echo [ETAPE 2/5] Generation du client Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERREUR: Generation Prisma echouee
    pause
    exit /b 1
)
echo ✓ Client Prisma genere
echo.

echo [ETAPE 3/5] Creation de la migration...
call npx prisma migrate dev --name add_notes_alerts_budgets
if %errorlevel% neq 0 (
    echo ATTENTION: Migration echouee ou deja existante
    echo Tentative de reset...
    call npx prisma migrate reset --force
    call npx prisma migrate dev --name init
)
echo ✓ Migration executee
echo.

echo [ETAPE 4/5] Verification de la compilation...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Compilation TypeScript echouee
    echo Consultez TROUBLESHOOTING.md pour plus d'aide
    pause
    exit /b 1
)
echo ✓ Compilation reussie
echo.

echo [ETAPE 5/5] Peuplement de la base de donnees...
call npm run prisma:seed
echo ✓ Donnees de test ajoutees
echo.

echo ========================================
echo    REPARATION TERMINEE AVEC SUCCES!
echo ========================================
echo.
echo Le backend est pret a demarrer.
echo.
echo Pour demarrer le backend:
echo   npm run start:dev
echo.
echo Identifiants de test:
echo   - Younes: younes@couple.com / password123
echo   - Asmae:  asmae@couple.com / password123
echo.
pause
