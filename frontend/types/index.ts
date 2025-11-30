export interface User {
  id: string
  firstName: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  access_token: string
}

export enum IncomeType {
  SALARY = 'SALARY',
  FREELANCE = 'FREELANCE',
  BONUS = 'BONUS',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export interface Income {
  id: string
  userId: string
  type: IncomeType
  label: string
  amount: number
  currency: string
  startDate: string
  endDate?: string
  isRecurring: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstName: string
    email: string
  }
}

export enum ExpenseCategory {
  HOUSING = 'HOUSING',
  UTILITIES = 'UTILITIES',
  INSURANCE = 'INSURANCE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  TRANSPORT = 'TRANSPORT',
  FOOD = 'FOOD',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  OTHER = 'OTHER',
}

export enum BillingPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export interface RecurringExpense {
  id: string
  userId?: string
  isShared: boolean
  category: ExpenseCategory
  label: string
  amount: number
  currency: string
  billingPeriod: BillingPeriod
  startDate: string
  endDate?: string
  provider?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    firstName: string
    email: string
  }
}

export interface Loan {
  id: string
  userId?: string
  isShared: boolean
  label: string
  totalAmount: number
  remainingAmount: number
  monthlyPayment: number
  interestRate: number
  startDate: string
  endDate: string
  lender: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    firstName: string
    email: string
  }
}

export enum ProjectStatus {
  IDEA = 'IDEA',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ProjectContribution {
  id: string
  projectId: string
  userId: string
  amount: number
  date: string
  note?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstName: string
    email: string
  }
}

export interface CoupleProject {
  id: string
  title: string
  description?: string
  targetAmount: number
  currency: string
  targetDate: string
  status: ProjectStatus
  priority: ProjectPriority
  createdAt: string
  updatedAt: string
  contributions: ProjectContribution[]
  totalContributed?: number
  progressPercentage?: number
  remainingAmount?: number
}

export interface DashboardOverview {
  monthlyIncome: number
  monthlyExpenses: number
  monthlyLoanPayments: number
  disposableIncome: number
  savingCapacity: number
  totalDebt: number
  activeProjects: number
  projects: Array<{
    id: string
    title: string
    targetAmount: number
    totalContributed: number
    progressPercentage: number
    remainingAmount: number
    priority: ProjectPriority
    status: ProjectStatus
    targetDate: string
  }>
  breakdown: {
    incomeCount: number
    expenseCount: number
    loanCount: number
  }
}
