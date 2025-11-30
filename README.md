# 💑 Couple Life - Project Management System

A complete, production-ready back-office application for managing couple life projects, finances, and goals.

**Built for:** Younes & Asmae

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Default Users](#default-users)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Development](#development)

## ✨ Features

### 💰 Financial Management
- **Income Tracking**: Manage all income sources (salary, bonus, freelance, etc.)
- **Recurring Expenses**: Track subscriptions, utilities, rent, insurance, and more
- **Loan Management**: Monitor loans, monthly payments, and remaining balances
- **Financial Dashboard**: Real-time overview of monthly income, expenses, and disposable income

### 💑 Couple Projects
- **Life Projects**: Plan and track projects like house down payment, vacations, investments
- **Contributions**: Both partners can contribute to projects
- **Progress Tracking**: Visual progress bars showing completion percentage
- **Project Priorities**: Categorize by priority (Low, Medium, High)
- **Status Management**: Track project status (Idea, Planning, In Progress, Done, Cancelled)

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 🎨 Modern UI
- Professional admin dashboard layout
- Responsive design with Tailwind CSS
- Clean, intuitive interface
- Real-time data updates

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Forms**: React Hook Form

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL in Docker

## 📁 Project Structure

```
Gestion-de-projet/
├── backend/                 # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── incomes/        # Income CRUD
│   │   ├── recurring-expenses/  # Expenses CRUD
│   │   ├── loans/          # Loans CRUD
│   │   ├── couple-projects/     # Projects & Contributions
│   │   ├── dashboard/      # Dashboard with calculations
│   │   └── prisma/         # Prisma service
│   └── package.json
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   │   ├── dashboard/ # Dashboard page
│   │   │   ├── incomes/   # Income management
│   │   │   ├── expenses/  # Expense management
│   │   │   ├── loans/     # Loan management
│   │   │   ├── projects/  # Project management
│   │   │   └── login/     # Login page
│   │   ├── components/    # React components
│   │   │   ├── Layout/    # Sidebar, Layout
│   │   │   ├── Incomes/   # Income modal
│   │   │   ├── Expenses/  # Expense modal
│   │   │   ├── Loans/     # Loan modal
│   │   │   └── Projects/  # Project & Contribution modals
│   │   ├── contexts/      # React contexts (Auth)
│   │   └── lib/           # API utilities
│   └── package.json
│
├── docker-compose.yml     # Docker orchestration
└── README.md             # This file
```

## 📦 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **PostgreSQL**: v14 or higher (or use Docker)
- **Docker** (optional): For containerized deployment

## 🚀 Installation

### Option 1: Manual Setup

#### 1. Clone the repository

```bash
git clone <repository-url>
cd Gestion-de-projet
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### 4. Configure Environment Variables

**Backend (.env):**
```bash
cd ../backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/couple_life_db?schema=public"
JWT_SECRET="couple-life-secret-key-2024-younes-asmae"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
```

**Frontend (.env.local):**
```bash
cd ../frontend
cp .env.example .env.local  # Or create .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Option 2: Docker Setup

```bash
# Build and run all services
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
# - Database: localhost:5432
```

## 🏃 Running the Application

### Manual Run

#### 1. Start PostgreSQL

Make sure PostgreSQL is running on `localhost:5432`.

#### 2. Set up the Database

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed
```

#### 3. Start the Backend

```bash
# Development mode (with hot reload)
npm run start:dev

# The backend will run on http://localhost:3001
```

#### 4. Start the Frontend (in a new terminal)

```bash
cd frontend

# Development mode
npm run dev

# The frontend will run on http://localhost:3000
```

### Docker Run

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (database data will be lost)
docker-compose down -v
```

## 🗄️ Database Setup

### Database Schema

The application uses the following models:

- **User**: Younes & Asmae profiles
- **Income**: Income sources (salary, bonus, freelance, etc.)
- **RecurringExpense**: Monthly/yearly expenses
- **Loan**: Loan tracking
- **CoupleProject**: Life projects
- **ProjectContribution**: Contributions to projects

### Prisma Commands

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (visual database editor)
npx prisma studio

# Seed the database
npm run prisma:seed
```

### Resetting the Database

```bash
cd backend

# Reset database (⚠️ This will delete all data)
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Run all migrations
# 4. Run the seed script
```

## 👤 Default Users

After seeding the database, you can log in with:

### Younes
- **Email**: `younes@example.com`
- **Password**: `younes123`

### Asmae
- **Email**: `asmae@example.com`
- **Password**: `asmae123`

## 📚 API Documentation

### Base URL
```
http://localhost:3001
```

### Authentication

#### POST `/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "younes@example.com",
  "password": "younes123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "Younes",
    "email": "younes@example.com"
  }
}
```

#### GET `/auth/me`
Get current user (requires Bearer token).

### Incomes

- `GET /incomes` - Get all incomes
- `GET /incomes/:id` - Get one income
- `POST /incomes` - Create income
- `PATCH /incomes/:id` - Update income
- `DELETE /incomes/:id` - Delete income

### Recurring Expenses

- `GET /recurring-expenses` - Get all expenses
- `GET /recurring-expenses/:id` - Get one expense
- `POST /recurring-expenses` - Create expense
- `PATCH /recurring-expenses/:id` - Update expense
- `DELETE /recurring-expenses/:id` - Delete expense

### Loans

- `GET /loans` - Get all loans
- `GET /loans/:id` - Get one loan
- `POST /loans` - Create loan
- `PATCH /loans/:id` - Update loan
- `DELETE /loans/:id` - Delete loan

### Couple Projects

- `GET /couple-projects` - Get all projects
- `GET /couple-projects/:id` - Get one project
- `POST /couple-projects` - Create project
- `PATCH /couple-projects/:id` - Update project
- `DELETE /couple-projects/:id` - Delete project
- `POST /couple-projects/contributions` - Add contribution
- `GET /couple-projects/:id/contributions` - Get project contributions
- `DELETE /couple-projects/contributions/:id` - Delete contribution

### Dashboard

- `GET /dashboard` - Get financial overview
- `GET /dashboard/user/:userId` - Get user statistics

All endpoints (except `/auth/login` and `/auth/register`) require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🐳 Docker Deployment

### Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Run in Production

```bash
# Start in detached mode
docker-compose up -d

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

### Database Backup

```bash
# Backup database
docker exec couple-life-db pg_dump -U postgres couple_life_db > backup.sql

# Restore database
docker exec -i couple-life-db psql -U postgres couple_life_db < backup.sql
```

## 💻 Development

### Backend Development

```bash
cd backend

# Run in development mode
npm run start:dev

# Run linter
npm run lint

# Format code
npm run format
```

### Frontend Development

```bash
cd frontend

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Run linter
npm run lint
```

### Code Structure Guidelines

- **Backend**: Follow NestJS best practices with modules, services, and controllers
- **Frontend**: Use functional components with hooks
- **Styling**: Use Tailwind utility classes
- **API Calls**: Centralized in `frontend/src/lib/api.ts`
- **State Management**: React Context for auth, local state for components

## 🎯 Features Roadmap

Future enhancements:
- [ ] Email notifications for upcoming project deadlines
- [ ] Charts and graphs for financial trends
- [ ] Budget planning tools
- [ ] Receipt/document uploads
- [ ] Mobile app (React Native)
- [ ] Export data to CSV/PDF
- [ ] Multi-currency support
- [ ] Recurring expense reminders

## 📝 License

Private project for Younes & Asmae.

## 🙏 Support

For any issues or questions, please check:
1. Ensure PostgreSQL is running
2. Check environment variables are correct
3. Verify Node.js version (v18+)
4. Check logs: `docker-compose logs -f`

---

**Built with ❤️ for Younes & Asmae**

Happy Planning! 🎉