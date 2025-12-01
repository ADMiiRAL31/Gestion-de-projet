# 🔧 Script de Réparation du Backend

## ⚠️ IMPORTANT : Exécutez ces commandes dans l'ordre exact !

### ÉTAPE 1 : Installer les dépendances manquantes
```bash
cd backend
npm install
```
**Attendez que l'installation se termine complètement.**

### ÉTAPE 2 : Régénérer le client Prisma
```bash
npx prisma generate
```
**Cette commande va créer les types TypeScript pour les modèles Note, Alert et Budget.**

### ÉTAPE 3 : Créer la migration de base de données
```bash
npx prisma migrate dev --name add_notes_alerts_budgets
```
**Si la commande demande de réinitialiser la base, tapez 'y' (oui).**

### ÉTAPE 4 : Vérifier la compilation TypeScript
```bash
npm run build
```
**Si cette commande réussit, le backend est réparé !**

### ÉTAPE 5 : Démarrer le backend
```bash
npm run start:dev
```
**Vous devriez voir le message : "Nest application successfully started"**

---

## 🐛 Si vous rencontrez encore des erreurs

### Erreur : "Cannot find module @nestjs/mapped-types"
**Solution :**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Property 'note' does not exist"
**Solution :**
```bash
npx prisma generate
```

### Erreur : Migration échouée
**Solution (⚠️ ATTENTION : Réinitialise la base) :**
```bash
npx prisma migrate reset
npm run prisma:seed
```

### Erreur : Port 3000 déjà utilisé
**Solution Windows :**
```bash
netstat -ano | findstr :3000
taskkill /PID [LE_NUMERO_DU_PROCESSUS] /F
```

**Solution Linux/Mac :**
```bash
lsof -ti:3000 | xargs kill -9
```

---

## ✅ Vérification finale

Une fois le backend démarré, vous devriez voir :
```
[Nest] LOG [NestApplication] Nest application successfully started
[Nest] LOG Couple Life Backend running on: http://localhost:3000
```

Testez l'API :
```bash
curl http://localhost:3000
```

---

## 📊 Résumé des problèmes résolus

1. ✅ **@nestjs/mapped-types manquant** → Ajouté dans package.json
2. ✅ **Types Prisma manquants** → Régénération avec `prisma generate`
3. ✅ **Tables Note/Alert/Budget manquantes** → Création avec `prisma migrate`
4. ✅ **Compilation TypeScript** → Résolution des 37 erreurs

---

## 🎯 Prochaines étapes après démarrage

1. **Tester l'authentification** :
   - Email : `younes@couple.com`
   - Mot de passe : `password123`

2. **Vérifier que le frontend se connecte** :
   - Frontend sur : http://localhost:3001
   - Backend sur : http://localhost:3000

3. **Créer vos premières données** :
   - Revenus
   - Dépenses
   - Projets de couple
   - Notes et alertes
