'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { expensesAPI } from '@/lib/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ExpenseModal from '@/components/Expenses/ExpenseModal';

interface Expense {
  id: string;
  category: string;
  label: string;
  amount: number;
  currency: string;
  billingPeriod: string;
  startDate: string;
  endDate: string | null;
  provider: string | null;
  isShared: boolean;
  user: {
    id: string;
    firstName: string;
  } | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await expensesAPI.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expensesAPI.delete(id);
      loadExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense');
    }
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
    loadExpenses();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const calculateMonthlyAmount = (amount: number, period: string) => {
    switch (period.toLowerCase()) {
      case 'yearly':
      case 'annual':
        return amount / 12;
      case 'quarterly':
        return amount / 3;
      case 'weekly':
        return amount * 4.33;
      default:
        return amount;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      rent: 'bg-purple-100 text-purple-700',
      insurance: 'bg-blue-100 text-blue-700',
      utilities: 'bg-green-100 text-green-700',
      subscription: 'bg-yellow-100 text-yellow-700',
      transport: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || colors.other;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recurring Expenses</h1>
            <p className="text-gray-600 mt-1">Manage all recurring expenses</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Expense
          </button>
        </div>

        {/* Expenses List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading expenses...</p>
            </div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No expenses yet. Add your first expense!</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Label
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Monthly
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{expense.label}</div>
                        {expense.provider && (
                          <div className="text-xs text-gray-500">{expense.provider}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getCategoryColor(
                            expense.category
                          )}`}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm ${
                            expense.isShared ? 'text-primary-600 font-medium' : 'text-gray-900'
                          }`}
                        >
                          {expense.isShared ? 'Shared' : expense.user?.firstName || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.billingPeriod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                        {formatCurrency(calculateMonthlyAmount(expense.amount, expense.billingPeriod))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Expense Modal */}
      {isModalOpen && (
        <ExpenseModal expense={selectedExpense} onClose={handleCloseModal} />
      )}
    </DashboardLayout>
  );
}
