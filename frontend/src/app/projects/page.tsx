'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { projectsAPI } from '@/lib/api';
import { PlusIcon, PencilIcon, TrashIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import ProjectModal from '@/components/Projects/ProjectModal';
import ContributionModal from '@/components/Projects/ContributionModal';

interface Project {
  id: string;
  title: string;
  description: string | null;
  targetAmount: number;
  currency: string;
  targetDate: string;
  status: string;
  priority: string;
  contributions: any[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectsAPI.delete(id);
      loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const calculateTotalContributions = (contributions: any[]) => {
    return contributions.reduce((sum, c) => sum + c.amount, 0);
  };

  const calculateProgress = (contributions: any[], target: number) => {
    const total = calculateTotalContributions(contributions);
    return Math.min((total / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      IDEA: 'bg-gray-100 text-gray-700',
      PLANNING: 'bg-blue-100 text-blue-700',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
      DONE: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.IDEA;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-gray-100 text-gray-700',
      MEDIUM: 'bg-orange-100 text-orange-700',
      HIGH: 'bg-red-100 text-red-700',
    };
    return colors[priority] || colors.MEDIUM;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Couple Projects</h1>
            <p className="text-gray-600 mt-1">Plan and track your life projects together</p>
          </div>
          <button onClick={() => setIsProjectModalOpen(true)} className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Project
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No projects yet. Start planning your future together!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => {
              const totalContributions = calculateTotalContributions(project.contributions);
              const progress = calculateProgress(project.contributions, project.targetAmount);

              return (
                <div key={project.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setIsProjectModalOpen(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Target Amount:</span>
                      <span className="font-semibold">{formatCurrency(project.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Saved:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(totalContributions)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Target Date:</span>
                      <span className="font-semibold">
                        {new Date(project.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Contributions:</span>
                      <span className="font-semibold">{project.contributions.length}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-primary-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setIsContributionModalOpen(true);
                    }}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <BanknotesIcon className="w-5 h-5 mr-2" />
                    Add Contribution
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isProjectModalOpen && (
        <ProjectModal
          project={selectedProject}
          onClose={() => {
            setIsProjectModalOpen(false);
            setSelectedProject(null);
            loadProjects();
          }}
        />
      )}

      {isContributionModalOpen && selectedProject && (
        <ContributionModal
          projectId={selectedProject.id}
          onClose={() => {
            setIsContributionModalOpen(false);
            setSelectedProject(null);
            loadProjects();
          }}
        />
      )}
    </DashboardLayout>
  );
}
