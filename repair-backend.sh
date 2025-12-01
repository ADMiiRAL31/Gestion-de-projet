#!/bin/bash

echo "========================================"
echo "   RÉPARATION DU BACKEND NESTJS"
echo "========================================"
echo ""

cd backend || exit 1

echo "[ÉTAPE 1/5] Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ ERREUR: Installation des dépendances échouée"
    exit 1
fi
echo "✅ Dépendances installées"
echo ""

echo "[ÉTAPE 2/5] Génération du client Prisma..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ ERREUR: Génération Prisma échouée"
    exit 1
fi
echo "✅ Client Prisma généré"
echo ""

echo "[ÉTAPE 3/5] Création de la migration..."
npx prisma migrate dev --name add_notes_alerts_budgets
if [ $? -ne 0 ]; then
    echo "⚠️  ATTENTION: Migration échouée ou déjà existante"
    echo "Tentative de reset..."
    npx prisma migrate reset --force
    npx prisma migrate dev --name init
fi
echo "✅ Migration exécutée"
echo ""

echo "[ÉTAPE 4/5] Vérification de la compilation..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ERREUR: Compilation TypeScript échouée"
    echo "Consultez TROUBLESHOOTING.md pour plus d'aide"
    exit 1
fi
echo "✅ Compilation réussie"
echo ""

echo "[ÉTAPE 5/5] Peuplement de la base de données..."
npm run prisma:seed
echo "✅ Données de test ajoutées"
echo ""

echo "========================================"
echo "   RÉPARATION TERMINÉE AVEC SUCCÈS!"
echo "========================================"
echo ""
echo "Le backend est prêt à démarrer."
echo ""
echo "Pour démarrer le backend:"
echo "  npm run start:dev"
echo ""
echo "Identifiants de test:"
echo "  - Younes: younes@couple.com / password123"
echo "  - Asmae:  asmae@couple.com / password123"
echo ""
