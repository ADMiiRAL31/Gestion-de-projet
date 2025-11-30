'use client';

import { useState, useEffect } from 'react';
import { incomesAPI, usersAPI } from '@/lib/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Income {
  id: string;
  type: string;
  label: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string | null;
  isRecurring: boolean;
  user: {
    id: string;
    firstName: string;
  };
}

interface IncomeModalProps {
  income: Income | null;
  onClose: () => void;
}

export default function IncomeModal({ income, onClose }: IncomeModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    type: 'salary',
    label: '',
    amount: '',
    currency: 'EUR',
    startDate: '',
    endDate: '',
    isRecurring: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    if (income) {
      setFormData({
        userId: income.user.id,
        type: income.type,
        label: income.label,
        amount: income.amount.toString(),
        currency: income.currency,
        startDate: income.startDate.split('T')[0],
        endDate: income.endDate ? income.endDate.split('T')[0] : '',
        isRecurring: income.isRecurring,
      });
    }
  }, [income]);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
      if (!income && data.length > 0) {
        setFormData((prev) => ({ ...prev, userId: data[0].id }));
      }
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
        amount: parseFloat(formData.amount),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      if (income) {
        await incomesAPI.update(income.id, payload);
      } else {
        await incomesAPI.create(payload);
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save income');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg max-w-md w-full p-6 z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {income ? 'Edit Income' : 'Add Income'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
                required
              >
                <option value="salary">Salary</option>
                <option value="bonus">Bonus</option>
                <option value="freelance">Freelance</option>
                <option value="investment">Investment</option>
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
                placeholder="e.g., Monthly Salary"
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

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 block text-sm text-gray-700">Recurring income</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Saving...' : income ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
