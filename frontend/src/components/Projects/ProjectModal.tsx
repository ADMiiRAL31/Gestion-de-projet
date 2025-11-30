'use client';

import { useState, useEffect } from 'react';
import { projectsAPI } from '@/lib/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  title: string;
  description: string | null;
  targetAmount: number;
  currency: string;
  targetDate: string;
  status: string;
  priority: string;
}

export default function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currency: 'EUR',
    targetDate: '',
    status: 'IDEA',
    priority: 'MEDIUM',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        targetAmount: project.targetAmount.toString(),
        currency: project.currency,
        targetDate: project.targetDate.split('T')[0],
        status: project.status,
        priority: project.priority,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        targetDate: new Date(formData.targetDate).toISOString(),
        description: formData.description || null,
      };

      if (project) {
        await projectsAPI.update(project.id, payload);
      } else {
        await projectsAPI.create(payload);
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
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
            <h3 className="text-xl font-semibold">{project ? 'Edit Project' : 'Add Project'}</h3>
            <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} placeholder="Describe your project..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Amount (€)</label>
              <input type="number" step="0.01" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Date</label>
              <input type="date" value={formData.targetDate} onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-field" required>
                <option value="IDEA">Idea</option>
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="input-field" required>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
