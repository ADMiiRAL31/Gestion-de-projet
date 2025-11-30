'use client';

import { useState, useEffect } from 'react';
import { expensesAPI, usersAPI } from '@/lib/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
  user: { id: string; firstName: string } | null;
}

interface ExpenseModalProps {
  expense: Expense | null;
  onClose: () => void;
}

export default function ExpenseModal({ expense, onClose }: ExpenseModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    isShared: false,
    category: 'rent',
    label: '',
    amount: '',
    currency: 'EUR',
    billingPeriod: 'monthly',
    startDate: '',
    endDate: '',
    provider: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    if (expense) {
      setFormData({
        userId: expense.user?.id || '',
        isShared: expense.isShared,
        category: expense.category,
        label: expense.label,
        amount: expense.amount.toString(),
        currency: expense.currency,
        billingPeriod: expense.billingPeriod,
        startDate: expense.startDate.split('T')[0],
        endDate: expense.endDate ? expense.endDate.split('T')[0] : '',
        provider: expense.provider || '',
      });
    }
  }, [expense]);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        userId: formData.isShared ? null : formData.userId,
        amount: parseFloat(formData.amount),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        provider: formData.provider || null,
      };

      if (expense) {
        await expensesAPI.update(expense.id, payload);
      } else {
        await expensesAPI.create(payload);
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg max-w-md w-full p-6 z-10 max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {expense ? 'Edit Expense' : 'Add Expense'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isShared}
                onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Shared expense</label>
            </div>

            {!formData.isShared && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="input-field"
                  required={!formData.isShared}
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
                required
              >
                <option value="rent">Rent</option>
                <option value="insurance">Insurance</option>
                <option value="utilities">Utilities</option>
                <option value="subscription">Subscription</option>
                <option value="transport">Transport</option>
                <option value="loan_payment">Loan Payment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="input-field"
                placeholder="e.g., Apartment Rent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Billing Period</label>
              <select
                value={formData.billingPeriod}
                onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                className="input-field"
                required
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="quarterly">Quarterly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider (Optional)</label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="input-field"
                placeholder="e.g., Netflix"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Saving...' : expense ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
