'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { dashboardAPI } from '@/lib/api';
import {
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';

interface DashboardData {
  income: { total: number; count: number };
  expenses: { total: number; count: number };
  loans: { totalMonthlyPayment: number; totalDebt: number; count: number };
  disposableIncome: number;
  savingsCapacity: number;
  projects: {
    total: number;
    summaries: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      targetAmount: number;
      totalContributions: number;
      completionPercentage: number;
      targetDate: string;
    }>;
  };
  currency: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getOverview();
      setData(response);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      IDEA: 'bg-gray-100 text-gray-700',
      PLANNING: 'bg-blue-100 text-blue-700',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
      DONE: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.IDEA;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-700',
      MEDIUM: 'bg-orange-100 text-orange-700',
      HIGH: 'bg-red-100 text-red-700',
    };
    return colors[priority as keyof typeof colors] || colors.MEDIUM;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600">Failed to load dashboard data</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Financial overview and couple projects</p>
        </div>

        {/* Financial Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Income */}
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monthly Income</p>
                <p className="text-2xl font-bold text-green-700 mt-2">
                  {formatCurrency(data.income.total)}
                </p>
                <p className="text-xs text-green-600 mt-1">{data.income.count} sources</p>
              </div>
              <BanknotesIcon className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          {/* Total Expenses */}
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Monthly Expenses</p>
                <p className="text-2xl font-bold text-orange-700 mt-2">
                  {formatCurrency(data.expenses.total)}
                </p>
                <p className="text-xs text-orange-600 mt-1">{data.expenses.count} items</p>
              </div>
              <CreditCardIcon className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          {/* Loan Payments */}
          <div className="card bg-gradient-to-br from-red-50 to-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Loan Payments</p>
                <p className="text-2xl font-bold text-red-700 mt-2">
                  {formatCurrency(data.loans.totalMonthlyPayment)}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Total debt: {formatCurrency(data.loans.totalDebt)}
                </p>
              </div>
              <BuildingLibraryIcon className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </div>

          {/* Disposable Income */}
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">Disposable Income</p>
                <p className="text-2xl font-bold text-primary-700 mt-2">
                  {formatCurrency(data.disposableIncome)}
                </p>
                <p className="text-xs text-primary-600 mt-1">Available for savings</p>
              </div>
              <WalletIcon className="w-12 h-12 text-primary-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Couple Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Couple Projects</h2>
            <span className="text-sm text-gray-600">{data.projects.total} total projects</span>
          </div>

          {data.projects.summaries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-4">
              {data.projects.summaries.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Target: {formatCurrency(project.targetAmount)} by{' '}
                        {new Date(project.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          project.priority
                        )}`}
                      >
                        {project.priority}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {formatCurrency(project.totalContributions)} saved
                      </span>
                      <span className="font-medium text-primary-600">
                        {project.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(project.completionPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Summary */}
        <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h3 className="text-lg font-semibold mb-4">Monthly Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-primary-100 text-sm">Total Income</p>
              <p className="text-2xl font-bold">{formatCurrency(data.income.total)}</p>
            </div>
            <div>
              <p className="text-primary-100 text-sm">Total Outgoing</p>
              <p className="text-2xl font-bold">
                {formatCurrency(data.expenses.total + data.loans.totalMonthlyPayment)}
              </p>
            </div>
            <div>
              <p className="text-primary-100 text-sm">Net Savings</p>
              <p className="text-2xl font-bold">{formatCurrency(data.disposableIncome)}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
