'use client';

import { useState, useEffect } from 'react';
import { loansAPI, usersAPI } from '@/lib/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Loan {
  id: string;
  label: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  lender: string | null;
  isShared: boolean;
  user: { id: string } | null;
}

export default function LoanModal({ loan, onClose }: { loan: Loan | null; onClose: () => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    isShared: false,
    label: '',
    totalAmount: '',
    remainingAmount: '',
    monthlyPayment: '',
    interestRate: '',
    startDate: '',
    endDate: '',
    lender: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    if (loan) {
      setFormData({
        userId: loan.user?.id || '',
        isShared: loan.isShared,
        label: loan.label,
        totalAmount: loan.totalAmount.toString(),
        remainingAmount: loan.remainingAmount.toString(),
        monthlyPayment: loan.monthlyPayment.toString(),
        interestRate: loan.interestRate.toString(),
        startDate: loan.startDate.split('T')[0],
        endDate: loan.endDate.split('T')[0],
        lender: loan.lender || '',
      });
    }
  }, [loan]);

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
        totalAmount: parseFloat(formData.totalAmount),
        remainingAmount: parseFloat(formData.remainingAmount),
        monthlyPayment: parseFloat(formData.monthlyPayment),
        interestRate: parseFloat(formData.interestRate),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        lender: formData.lender || null,
      };

      if (loan) {
        await loansAPI.update(loan.id, payload);
      } else {
        await loansAPI.create(payload);
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save loan');
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
            <h3 className="text-xl font-semibold">{loan ? 'Edit Loan' : 'Add Loan'}</h3>
            <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

            <div className="flex items-center">
              <input type="checkbox" checked={formData.isShared} onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })} className="w-4 h-4" />
              <label className="ml-2 text-sm">Shared loan</label>
            </div>

            {!formData.isShared && (
              <div>
                <label className="block text-sm font-medium mb-2">User</label>
                <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="input-field" required={!formData.isShared}>
                  <option value="">Select user</option>
                  {users.map((user) => <option key={user.id} value={user.id}>{user.firstName}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Label</label>
              <input type="text" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Amount (€)</label>
              <input type="number" step="0.01" value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Remaining Amount (€)</label>
              <input type="number" step="0.01" value={formData.remainingAmount} onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Monthly Payment (€)</label>
              <input type="number" step="0.01" value={formData.monthlyPayment} onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
              <input type="number" step="0.01" value={formData.interestRate} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lender (Optional)</label>
              <input type="text" value={formData.lender} onChange={(e) => setFormData({ ...formData, lender: e.target.value })} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input-field" required />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Saving...' : loan ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
