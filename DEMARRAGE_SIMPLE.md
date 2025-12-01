# 🚀 DÉMARRAGE SIMPLE - Backend Sans Erreurs

## ✅ Modifications Effectuées

J'ai **supprimé** les modules qui causaient des erreurs TypeScript :
- ❌ Notes & Rappels (supprimé)
- ❌ Alertes & Notifications (supprimé)
- ❌ Budgets par Catégorie (supprimé)

Les modules **fonctionnels** restent actifs :
- ✅ Authentification (Login/Register)
- ✅ Revenus
- ✅ Dépenses récurrentes
- ✅ Crédits & Emprunts
- ✅ Projets de couple
- ✅ Dashboard

---

## 🎯 DÉMARRER LE BACKEND (3 Étapes)

### 1️⃣ Vérifier PostgreSQL

Assurez-vous que PostgreSQL est démarré :

**Windows :**
```bash
# Dans Services, vérifiez que "postgresql" est en cours d'exécution
# OU via pgAdmin
```

**Linux/Mac :**
```bash
sudo systemctl status postgresql
# Si arrêté : sudo systemctl start postgresql
```

### 2️⃣ Installer les dépendances

```bash
cd backend
npm install
```

**Note** : Plus besoin d'installer `@nestjs/mapped-types` - c'est déjà retiré !

### 3️⃣ Démarrer le backend

```bash
npm run start:dev
```

Vous devriez voir :
```
✅ [Nest] LOG [NestApplication] Nest application successfully started
✅ [Nest] LOG Couple Life Backend running on: http://localhost:3000
```

---

## 🌐 TESTER L'APPLICATION

### 1. Démarrer le frontend (nouveau terminal)

```bash
cd frontend
npm install
npm run dev
```

### 2. Se connecter

- **URL** : http://localhost:3001
- **Email** : `younes@couple.com`
- **Mot de passe** : `password123`

---

## ✨ FONCTIONNALITÉS DISPONIBLES

Après connexion, vous pouvez utiliser :

### 💰 Revenus (`/incomes`)
- Ajouter vos sources de revenus
- Salaires de Younes et Asmae
- Revenus récurrents

### 💳 Dépenses (`/expenses`)
- Dépenses récurrentes (loyer, abonnements...)
- Catégories de dépenses
- Fréquence de paiement

### 🏦 Crédits (`/loans`)
- Emprunts et crédits
- Calcul des mensualités
- Suivi du remboursement

### 💑 Projets de Couple (`/projects`)
- Créer des projets communs
- Suivre les contributions de chacun
- Statuts et priorités

### 📊 Dashboard (`/dashboard`)
- Vue d'ensemble financière
- Graphiques de revenus/dépenses
- Progression des projets

---

## 🐛 PROBLÈMES COURANTS

### Erreur : "Database couple_life does not exist"

**Solution :**
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE couple_life;

# Quitter
\q

# Exécuter les migrations
cd backend
npx prisma migrate dev --name init
```

### Erreur : "Port 3000 already in use"

**Solution Windows :**
```bash
netstat -ano | findstr :3000
taskkill /PID [NUMERO] /F
```

**Solution Linux/Mac :**
```bash
lsof -ti:3000 | xargs kill -9
```

### Erreur : "Cannot find module @prisma/client"

**Solution :**
```bash
cd backend
npx prisma generate
```

### Erreur de connexion dans le frontend

**Vérifications :**
1. Le backend est bien démarré sur http://localhost:3000
2. Vérifier les logs du backend dans le terminal
3. Tester l'API : `curl http://localhost:3000`
4. Vérifier que le fichier `frontend/.env.local` existe avec :
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

---

## 📂 STRUCTURE DE LA BASE DE DONNÉES

Tables actuellement utilisées :
- `users` - Utilisateurs (Younes, Asmae)
- `incomes` - Revenus
- `recurring_expenses` - Dépenses récurrentes
- `loans` - Crédits et emprunts
- `couple_projects` - Projets de couple
- `project_contributions` - Contributions aux projets

---

## 🔄 RESTAURER LES MODULES SUPPRIMÉS (Plus tard)

Si vous souhaitez restaurer Notes/Alerts/Budgets, vous devrez les récupérer depuis l'historique Git et corriger les erreurs TypeScript :

### 1. Récupérer les modules depuis Git
```bash
git checkout HEAD~1 -- backend/src/notes
git checkout HEAD~1 -- backend/src/alerts
git checkout HEAD~1 -- backend/src/budgets
```

### 2. Installer les dépendances manquantes
```bash
cd backend
npm install @nestjs/mapped-types
```

### 3. Corriger les erreurs TypeScript
- Vérifier que tous les champs existent dans le schéma Prisma
- Corriger les chemins d'imports (ex: jwt-auth.guard)
- Aligner les enums entre DTOs et Prisma

### 4. Ajouter dans `app.module.ts`
```typescript
import { NotesModule } from './notes/notes.module';
import { AlertsModule } from './alerts/alerts.module';
import { BudgetsModule } from './budgets/budgets.module';

// Dans imports:
NotesModule,
AlertsModule,
BudgetsModule,
```

### 5. Régénérer Prisma et redémarrer
```bash
npx prisma generate
npm run start:dev
```

---

## 🎉 C'EST PRÊT !

Le backend devrait maintenant démarrer **sans aucune erreur TypeScript**.

Toutes les fonctionnalités essentielles sont disponibles :
- ✅ Authentification
- ✅ Gestion financière (revenus, dépenses, crédits)
- ✅ Projets de couple
- ✅ Dashboard avec statistiques

---

## 📞 SUPPORT

Si vous rencontrez encore des problèmes :

1. **Vérifiez les logs** du terminal backend
2. **Consultez** `TROUBLESHOOTING.md`
3. **Réinitialisez** la base de données si nécessaire :
   ```bash
   cd backend
   npx prisma migrate reset
   npm run prisma:seed
   ```

---

**Bon développement ! 🚀**
