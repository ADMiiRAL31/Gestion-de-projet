# 💑 Couple Life Admin Dashboard

A complete, production-ready admin dashboard for managing couple projects, finances, and life goals. Built with modern TypeScript stack: NestJS, PostgreSQL, Prisma, Next.js, and TailwindCSS.

## 🎯 Features

### 📊 Financial Management
- **Income Tracking** - Manage salaries, freelance income, bonuses, and investments
- **Recurring Expenses** - Track subscriptions, utilities, insurance, and more
- **Loan Management** - Monitor loans with payment schedules and interest rates
- **Dashboard Overview** - Real-time financial summary with disposable income calculations

### 🎯 Couple Projects
- **Shared Goals** - Create and track couple savings goals
- **Contributions** - Record individual contributions from both partners
- **Progress Tracking** - Visual progress bars and percentage completion
- **Priority Management** - Organize projects by priority (LOW, MEDIUM, HIGH)
- **Status Updates** - Track project status (IDEA, PLANNING, IN_PROGRESS, DONE, CANCELLED)

### 🔐 Authentication & Security
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Frontend and backend route protection
- **Two Users** - Younes & Asmae accounts pre-configured

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Robust relational database
- **Prisma** - Next-generation ORM
- **JWT** - Secure authentication
- **TypeScript** - Type-safe development

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe React development
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors

## 📁 Project Structure

```
Gestion-de-projet/
├── backend/               # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Database seeding
│   └── src/
│       ├── auth/          # Authentication module
│       ├── users/         # User management
│       ├── income/        # Income tracking
│       ├── expenses/      # Expense management
│       ├── loans/         # Loan tracking
│       ├── projects/      # Couple projects & contributions
│       ├── dashboard/     # Dashboard aggregation
│       └── prisma/        # Prisma service
│
├── frontend/              # Next.js Frontend
│   ├── app/               # Next.js App Router
│   │   ├── dashboard/     # Protected dashboard
│   │   └── login/         # Authentication page
│   ├── components/        # Reusable components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utilities & API client
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript definitions
│
└── package.json           # Monorepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Gestion-de-projet
```

### 2. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE couple_life_db;
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and update DATABASE_URL with your PostgreSQL credentials

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed

# Start the backend server
npm run start:dev
```

The backend will run on `http://localhost:3001`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# .env.local should contain:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

## 🔑 Default Credentials

The database is seeded with two users:

**Younes:**
- Email: `younes@couple-life.com`
- Password: `password123`

**Asmae:**
- Email: `asmae@couple-life.com`
- Password: `password123`

## 📊 Database Schema

### User
- Personal information (firstName, email)
- Secure password hashing
- Relations to incomes, expenses, loans, and contributions

### Income
- Type (SALARY, FREELANCE, BONUS, INVESTMENT, OTHER)
- Amount and currency
- Recurring or one-time
- Start and end dates

### RecurringExpense
- Category (HOUSING, UTILITIES, INSURANCE, etc.)
- Billing period (WEEKLY, MONTHLY, QUARTERLY, YEARLY)
- Shared or individual expenses
- Provider information

### Loan
- Total and remaining amounts
- Monthly payment and interest rate
- Start and end dates
- Shared or individual loans

### CoupleProject
- Title, description, target amount
- Target date and currency
- Status and priority
- Related contributions

### ProjectContribution
- Amount and date
- User association
- Optional notes

## 🔧 Development Scripts

### Backend

```bash
npm run start:dev       # Start development server
npm run build           # Build for production
npm run start:prod      # Run production build
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio (DB GUI)
npm run prisma:seed     # Seed database
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

## 🌟 Key Features Explained

### Dashboard Overview
The dashboard provides a comprehensive financial summary:
- **Monthly Income**: Total from all recurring income sources
- **Monthly Expenses**: Automatically converted to monthly amounts
- **Loan Payments**: Combined monthly loan obligations
- **Disposable Income**: Income minus expenses and loan payments
- **Active Projects**: Visual progress bars for all couple goals

### Automatic Calculations
- Expenses are automatically normalized to monthly amounts
  - Yearly expenses divided by 12
  - Quarterly expenses divided by 3
  - Weekly expenses multiplied by 4.33
- Shared expenses and loans are split between partners
- Project progress calculated as percentage of target amount

### Project Management
Each couple project tracks:
- Total contributions from both partners
- Progress percentage
- Remaining amount to reach goal
- Priority and status for better organization

## 🔐 Security Features

- JWT-based authentication with secure token storage
- Password hashing with bcrypt
- Protected API routes with guards
- Frontend route protection with authentication checks
- CORS configuration for frontend-backend communication
- Input validation using class-validator

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Incomes
- `GET /api/incomes` - List all incomes
- `POST /api/incomes` - Create new income
- `GET /api/incomes/:id` - Get single income
- `PATCH /api/incomes/:id` - Update income
- `DELETE /api/incomes/:id` - Delete income

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create new expense
- Similar CRUD operations...

### Loans
- Full CRUD operations at `/api/loans/*`

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project with contributions
- `POST /api/projects/contributions` - Add contribution
- Full CRUD for both projects and contributions

### Dashboard
- `GET /api/dashboard/overview` - Complete financial overview
- `GET /api/dashboard/user/:userId` - User-specific summary

## 🎨 UI Components

The application uses shadcn/ui components for a consistent, accessible interface:
- **Button** - Primary, secondary, destructive variants
- **Card** - Content containers with headers
- **Input** - Form inputs with validation
- **Label** - Accessible form labels

## 🚧 Future Enhancements

Potential features to add:
- Budget planning and forecasting
- Expense categories breakdown charts
- Mobile responsive optimization
- Data export (CSV, PDF)
- Notifications and reminders
- Multi-currency support
- Dark mode theme
- Financial reports and analytics

## 👥 Authors

**Younes & Asmae** - Private couple finance management system

## 📄 License

PRIVATE - For personal use only

---

Built with ❤️ for managing couple life and finances together.
