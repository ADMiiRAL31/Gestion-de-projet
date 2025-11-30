'use client';

import { useState, useEffect } from 'react';
import { projectsAPI, usersAPI } from '@/lib/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ContributionModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
      if (data.length > 0) {
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
        projectId,
        userId: formData.userId,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        note: formData.note || null,
      };

      await projectsAPI.addContribution(payload);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add contribution');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg max-w-md w-full p-6 z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Add Contribution</h3>
            <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium mb-2">Who is contributing?</label>
              <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="input-field" required>
                <option value="">Select user</option>
                {users.map((user) => <option key={user.id} value={user.id}>{user.firstName}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount (€)</label>
              <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="input-field" placeholder="0.00" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Note (Optional)</label>
              <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="input-field" rows={2} placeholder="Add a note..." />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Adding...' : 'Add Contribution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
