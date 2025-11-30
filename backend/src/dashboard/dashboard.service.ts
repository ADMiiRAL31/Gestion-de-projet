import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getFinancialOverview() {
    // Get all incomes
    const incomes = await this.prisma.income.findMany({
      where: {
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
    });

    // Get all recurring expenses
    const expenses = await this.prisma.recurringExpense.findMany({
      where: {
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
    });

    // Get all active loans
    const loans = await this.prisma.loan.findMany({
      where: {
        endDate: { gte: new Date() },
      },
    });

    // Calculate total monthly income
    const totalMonthlyIncome = this.calculateMonthlyTotal(incomes, 'income');

    // Calculate total monthly expenses
    const totalMonthlyExpenses = this.calculateMonthlyTotal(expenses, 'expense');

    // Calculate total monthly loan payments
    const totalMonthlyLoanPayments = loans.reduce(
      (sum, loan) => sum + loan.monthlyPayment,
      0,
    );

    // Calculate disposable income
    const disposableIncome = totalMonthlyIncome - totalMonthlyExpenses - totalMonthlyLoanPayments;

    // Get all projects with contributions
    const projects = await this.prisma.coupleProject.findMany({
      include: {
        contributions: true,
      },
    });

    // Calculate project summaries
    const projectSummaries = projects.map((project) => {
      const totalContributions = project.contributions.reduce(
        (sum, contribution) => sum + contribution.amount,
        0,
      );
      const completionPercentage =
        project.targetAmount > 0
          ? Math.min((totalContributions / project.targetAmount) * 100, 100)
          : 0;

      return {
        id: project.id,
        title: project.title,
        status: project.status,
        priority: project.priority,
        targetAmount: project.targetAmount,
        totalContributions,
        completionPercentage: Math.round(completionPercentage * 100) / 100,
        targetDate: project.targetDate,
      };
    });

    // Calculate total loan debts
    const totalLoanDebt = loans.reduce(
      (sum, loan) => sum + loan.remainingAmount,
      0,
    );

    return {
      income: {
        total: Math.round(totalMonthlyIncome * 100) / 100,
        count: incomes.length,
      },
      expenses: {
        total: Math.round(totalMonthlyExpenses * 100) / 100,
        count: expenses.length,
      },
      loans: {
        totalMonthlyPayment: Math.round(totalMonthlyLoanPayments * 100) / 100,
        totalDebt: Math.round(totalLoanDebt * 100) / 100,
        count: loans.length,
      },
      disposableIncome: Math.round(disposableIncome * 100) / 100,
      savingsCapacity: Math.round(disposableIncome * 100) / 100, // Same as disposable income for now
      projects: {
        total: projects.length,
        summaries: projectSummaries.slice(0, 5), // Top 5 projects
      },
      currency: 'EUR', // Default currency
    };
  }

  private calculateMonthlyTotal(
    items: any[],
    type: 'income' | 'expense',
  ): number {
    return items.reduce((sum, item) => {
      const amount = item.amount || 0;

      if (type === 'income' && !item.isRecurring) {
        return sum; // Skip non-recurring incomes for monthly calculation
      }

      // Convert to monthly amount based on billing period
      const billingPeriod = item.billingPeriod || 'monthly';
      let monthlyAmount = amount;

      switch (billingPeriod.toLowerCase()) {
        case 'yearly':
        case 'annual':
          monthlyAmount = amount / 12;
          break;
        case 'quarterly':
          monthlyAmount = amount / 3;
          break;
        case 'weekly':
          monthlyAmount = amount * 4.33; // Average weeks per month
          break;
        case 'monthly':
        default:
          monthlyAmount = amount;
          break;
      }

      return sum + monthlyAmount;
    }, 0);
  }

  async getUserStats(userId: string) {
    const incomes = await this.prisma.income.findMany({
      where: { userId },
    });

    const expenses = await this.prisma.recurringExpense.findMany({
      where: { userId },
    });

    const loans = await this.prisma.loan.findMany({
      where: { userId },
    });

    const contributions = await this.prisma.projectContribution.findMany({
      where: { userId },
    });

    const totalContributions = contributions.reduce(
      (sum, c) => sum + c.amount,
      0,
    );

    return {
      incomes: {
        count: incomes.length,
        total: incomes.reduce((sum, i) => sum + i.amount, 0),
      },
      expenses: {
        count: expenses.length,
        total: expenses.reduce((sum, e) => sum + e.amount, 0),
      },
      loans: {
        count: loans.length,
        totalDebt: loans.reduce((sum, l) => sum + l.remainingAmount, 0),
      },
      contributions: {
        count: contributions.length,
        total: totalContributions,
      },
    };
  }
}
