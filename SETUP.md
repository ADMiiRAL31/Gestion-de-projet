# 🚀 Guide d'Installation - Gestion de Projet Vie de Couple

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- **PostgreSQL** (version 13 ou supérieure) - [Télécharger ici](https://www.postgresql.org/download/)
- **npm** ou **yarn** (inclus avec Node.js)

## 🗄️ Configuration de la Base de Données

### 1. Installer et Démarrer PostgreSQL

#### Sur Windows :
```bash
# Démarrer PostgreSQL via Services ou
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
```

#### Sur macOS :
```bash
brew services start postgresql@15
```

#### Sur Linux :
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Créer la Base de Données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans le terminal PostgreSQL :
CREATE DATABASE couple_life_db;

# Créer un utilisateur (optionnel)
CREATE USER couple_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE couple_life_db TO couple_user;

# Quitter
\q
```

## 🔧 Installation du Backend

### 1. Naviguer vers le dossier backend

```bash
cd backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Le fichier `.env` existe déjà avec la configuration par défaut :

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/couple_life_db?schema=public"

# JWT
JWT_SECRET="couple-life-secret-key-2024-younes-asmae"
JWT_EXPIRES_IN="7d"

# Application
PORT=3000
NODE_ENV=development
```

**⚠️ IMPORTANT** : Modifiez le `DATABASE_URL` si vous avez utilisé un mot de passe différent pour PostgreSQL.

### 4. Générer le Client Prisma et Exécuter les Migrations

```bash
# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations de base de données
npm run prisma:migrate

# Si la commande ci-dessus demande un nom, entrez : "initial_migration"
```

### 5. Peupler la Base de Données (Seed)

```bash
npm run prisma:seed
```

Cette commande va créer :
- 2 utilisateurs : Younes et Asmae
- Des données de test pour tous les modules

**Identifiants de connexion :**
- Email Younes : `younes@couple.com`
- Email Asmae : `asmae@couple.com`
- Mot de passe pour les deux : `password123`

### 6. Démarrer le Serveur Backend

```bash
# Mode développement (avec hot reload)
npm run start:dev

# OU mode production
npm run build
npm run start:prod
```

Le backend sera accessible sur : **http://localhost:3000**

## 🎨 Installation du Frontend

### 1. Naviguer vers le dossier frontend (dans un nouveau terminal)

```bash
cd frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du dossier `frontend` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Démarrer le Serveur Frontend

```bash
# Mode développement
npm run dev

# OU build + start pour production
npm run build
npm start
```

Le frontend sera accessible sur : **http://localhost:3001**

## 🎯 Connexion à l'Application

1. Ouvrez votre navigateur à l'adresse **http://localhost:3001**
2. Vous serez redirigé vers la page de connexion
3. Utilisez les identifiants :
   - **Younes** : `younes@couple.com` / `password123`
   - **Asmae** : `asmae@couple.com` / `password123`

## ✨ Fonctionnalités Disponibles

Après connexion, vous aurez accès à :

### 📊 Tableau de Bord
- Vue d'ensemble de vos finances
- Graphiques de revenus et dépenses
- Progression des projets de couple

### 💰 Revenus
- Ajouter vos sources de revenus (salaire, bonus, freelance...)
- Younes et Asmae peuvent chacun ajouter leurs revenus

### 💳 Dépenses
- Gérer vos dépenses récurrentes (loyer, abonnements...)
- Suivi automatique des échéances

### 🏦 Crédits
- Suivre vos emprunts et mensualités
- Visualiser le remboursement restant

### 💑 Projets de Couple
- Créer des projets communs (mariage, vacances, achat immobilier...)
- Suivre les contributions de chacun
- Visualiser la progression

### 📈 Budget & Statistiques
- **NOUVEAU** : Créer vos budgets personnalisés par catégorie
- Suivre vos dépenses par rapport au budget
- Alertes de dépassement

### 📅 Calendrier Financier
- Visualiser toutes vos échéances financières
- Synchronisé avec vos revenus et dépenses réels
- Vue mensuelle claire

### 🔔 Alertes & Notifications
- **NOUVEAU** : Créer vos propres alertes personnalisées
- Système de notifications intelligent
- Gestion des alertes lues/non lues

### 📝 Notes & Rappels
- **NOUVEAU** : Notes partagées entre Younes et Asmae
- Catégories : Tâches, Idées, Rappels, Important
- Persistance en base de données

## 🛠️ Commandes Utiles

### Backend

```bash
# Voir la structure de la base de données
npm run prisma:studio

# Créer une nouvelle migration
npm run prisma:migrate

# Réinitialiser la base de données
npx prisma migrate reset

# Voir les logs du serveur
npm run start:dev
```

### Frontend

```bash
# Vérifier les erreurs TypeScript
npm run type-check

# Linter le code
npm run lint

# Build pour production
npm run build
```

## 🐛 Résolution de Problèmes

### Problème : "Échec de connexion. Vérifiez vos identifiants."

**Solution :**
1. Vérifiez que le backend est bien démarré sur le port 3000
2. Vérifiez que la base de données PostgreSQL est en cours d'exécution
3. Assurez-vous que les données de seed ont été chargées (`npm run prisma:seed`)

### Problème : "Database migration failed"

**Solution :**
```bash
# Réinitialiser complètement la base de données
cd backend
npx prisma migrate reset
npm run prisma:seed
```

### Problème : "Port 3000 already in use" (Backend)

**Solution :**
```bash
# Trouver le processus utilisant le port
# Sur Windows
netstat -ano | findstr :3000

# Sur macOS/Linux
lsof -ti:3000

# Tuer le processus
# Sur Windows (remplacez PID par le numéro du processus)
taskkill /PID <PID> /F

# Sur macOS/Linux
kill -9 <PID>
```

### Problème : "Cannot find module '@prisma/client'"

**Solution :**
```bash
cd backend
npm run prisma:generate
```

### Problème : Les données ne se sauvegardent pas

**Vérifications :**
1. Le backend est bien démarré
2. Les migrations ont été exécutées
3. Le fichier `.env.local` du frontend contient `NEXT_PUBLIC_API_URL=http://localhost:3000`
4. Vérifiez la console du navigateur (F12) pour voir les erreurs

## 📚 Structure du Projet

```
Gestion-de-projet/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Schéma de base de données
│   │   └── seed.ts             # Données de test
│   ├── src/
│   │   ├── alerts/             # Module Alertes
│   │   ├── auth/               # Authentification JWT
│   │   ├── budgets/            # Module Budgets
│   │   ├── couple-projects/    # Projets de couple
│   │   ├── dashboard/          # Tableau de bord
│   │   ├── incomes/            # Revenus
│   │   ├── loans/              # Crédits
│   │   ├── notes/              # Notes & Rappels
│   │   ├── recurring-expenses/ # Dépenses récurrentes
│   │   └── users/              # Gestion utilisateurs
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── alerts/         # Page Alertes
│   │   │   ├── budget/         # Page Budget
│   │   │   ├── calendar/       # Page Calendrier
│   │   │   ├── dashboard/      # Tableau de bord
│   │   │   ├── expenses/       # Dépenses
│   │   │   ├── incomes/        # Revenus
│   │   │   ├── loans/          # Crédits
│   │   │   ├── login/          # Connexion
│   │   │   ├── notes/          # Notes & Rappels
│   │   │   └── projects/       # Projets
│   │   ├── components/         # Composants réutilisables
│   │   ├── contexts/           # Contextes React (Auth)
│   │   └── services/           # Services API
│   └── package.json
│
└── SETUP.md                    # Ce fichier
```

## 🎉 C'est Prêt !

Votre application de gestion de projet de couple est maintenant configurée et prête à l'emploi !

**Conseils d'utilisation :**

1. **Commencez par ajouter vos revenus** dans la section Revenus
2. **Ajoutez vos dépenses récurrentes** (loyer, abonnements...)
3. **Créez vos budgets mensuels** pour suivre vos dépenses
4. **Définissez vos projets de couple** et suivez leur progression
5. **Utilisez les notes partagées** pour communiquer et organiser votre vie de couple

## 💡 Astuce

Pour ouvrir les deux terminaux nécessaires simultanément :

**Terminal 1 - Backend:**
```bash
cd backend && npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

---

**Bon usage de votre application ! 💑✨**

Pour toute question ou problème, consultez les logs dans les terminaux backend et frontend.
