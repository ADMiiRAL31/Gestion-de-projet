import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getFinancialOverview() {
    // Get all recurring incomes
    const incomes = await this.prisma.income.findMany({
      where: {
        isRecurring: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
    });

    // Get all active recurring expenses
    const expenses = await this.prisma.recurringExpense.findMany({
      where: {
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
    });

    // Get all active loans
    const loans = await this.prisma.loan.findMany({
      where: {
        endDate: { gte: new Date() },
      },
    });

    // Get all projects with contributions
    const projects = await this.prisma.coupleProject.findMany({
      where: {
        status: {
          in: ['IDEA', 'PLANNING', 'IN_PROGRESS'],
        },
      },
      include: {
        contributions: true,
      },
    });

    // Calculate monthly income
    const monthlyIncome = incomes.reduce((total, income) => {
      return total + income.amount;
    }, 0);

    // Calculate monthly expenses (convert all to monthly)
    const monthlyExpenses = expenses.reduce((total, expense) => {
      let monthlyAmount = expense.amount;

      switch (expense.billingPeriod) {
        case 'YEARLY':
          monthlyAmount = expense.amount / 12;
          break;
        case 'QUARTERLY':
          monthlyAmount = expense.amount / 3;
          break;
        case 'WEEKLY':
          monthlyAmount = expense.amount * 4.33; // Average weeks per month
          break;
        case 'MONTHLY':
        default:
          monthlyAmount = expense.amount;
      }

      return total + monthlyAmount;
    }, 0);

    // Calculate total monthly loan payments
    const monthlyLoanPayments = loans.reduce((total, loan) => {
      return total + loan.monthlyPayment;
    }, 0);

    // Calculate disposable income
    const disposableIncome = monthlyIncome - monthlyExpenses - monthlyLoanPayments;

    // Calculate project stats
    const projectStats = projects.map((project) => {
      const totalContributed = project.contributions.reduce(
        (sum, contrib) => sum + contrib.amount,
        0,
      );
      const progressPercentage = project.targetAmount > 0
        ? Math.min((totalContributed / project.targetAmount) * 100, 100)
        : 0;

      return {
        id: project.id,
        title: project.title,
        targetAmount: project.targetAmount,
        totalContributed,
        progressPercentage: Math.round(progressPercentage * 100) / 100,
        remainingAmount: Math.max(project.targetAmount - totalContributed, 0),
        priority: project.priority,
        status: project.status,
        targetDate: project.targetDate,
      };
    });

    // Calculate total debt
    const totalDebt = loans.reduce((total, loan) => {
      return total + loan.remainingAmount;
    }, 0);

    return {
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      monthlyLoanPayments: Math.round(monthlyLoanPayments * 100) / 100,
      disposableIncome: Math.round(disposableIncome * 100) / 100,
      savingCapacity: Math.round(Math.max(disposableIncome, 0) * 100) / 100,
      totalDebt: Math.round(totalDebt * 100) / 100,
      activeProjects: projects.length,
      projects: projectStats,
      breakdown: {
        incomeCount: incomes.length,
        expenseCount: expenses.length,
        loanCount: loans.length,
      },
    };
  }

  async getUserFinancialSummary(userId: string) {
    // Get user-specific incomes
    const incomes = await this.prisma.income.findMany({
      where: {
        userId,
        isRecurring: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
    });

    // Get user-specific and shared expenses
    const expenses = await this.prisma.recurringExpense.findMany({
      where: {
        OR: [
          { userId },
          { isShared: true }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          }
        ]
      },
    });

    // Get user-specific and shared loans
    const loans = await this.prisma.loan.findMany({
      where: {
        OR: [
          { userId },
          { isShared: true }
        ],
        AND: [
          { endDate: { gte: new Date() } }
        ]
      },
    });

    // Get user contributions to projects
    const contributions = await this.prisma.projectContribution.findMany({
      where: { userId },
      include: {
        project: true,
      },
    });

    const monthlyIncome = incomes.reduce((total, income) => total + income.amount, 0);

    const monthlyExpenses = expenses.reduce((total, expense) => {
      let monthlyAmount = expense.amount;

      switch (expense.billingPeriod) {
        case 'YEARLY':
          monthlyAmount = expense.amount / 12;
          break;
        case 'QUARTERLY':
          monthlyAmount = expense.amount / 3;
          break;
        case 'WEEKLY':
          monthlyAmount = expense.amount * 4.33;
          break;
      }

      // If shared, divide by 2
      if (expense.isShared) {
        monthlyAmount = monthlyAmount / 2;
      }

      return total + monthlyAmount;
    }, 0);

    const monthlyLoanPayments = loans.reduce((total, loan) => {
      const payment = loan.isShared ? loan.monthlyPayment / 2 : loan.monthlyPayment;
      return total + payment;
    }, 0);

    const totalContributions = contributions.reduce(
      (total, contrib) => total + contrib.amount,
      0,
    );

    return {
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      monthlyLoanPayments: Math.round(monthlyLoanPayments * 100) / 100,
      disposableIncome: Math.round((monthlyIncome - monthlyExpenses - monthlyLoanPayments) * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      contributionCount: contributions.length,
    };
  }
}
