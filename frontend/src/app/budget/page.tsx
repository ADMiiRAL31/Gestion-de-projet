'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import {
  ChartBarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { budgetsService, Budget, CreateBudgetDto } from '@/services/budgets.service';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [newBudget, setNewBudget] = useState({
    category: '',
    budgetAmount: '',
  });

  useEffect(() => {
    loadBudgets();
  }, [currentMonth, currentYear]);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError(null);

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Vous devez être connecté');
      }
      const user = JSON.parse(userStr);

      const data = await budgetsService.getBudgetsByUser(user.id, currentMonth, currentYear);
      setBudgets(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des budgets');
      console.error('Erreur de chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    if (!newBudget.category.trim() || !newBudget.budgetAmount) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Vous devez être connecté');
        return;
      }
      const user = JSON.parse(userStr);

      const createData: CreateBudgetDto = {
        userId: user.id,
        category: newBudget.category,
        budgetAmount: parseFloat(newBudget.budgetAmount),
        spent: 0,
        month: currentMonth,
        year: currentYear,
      };

      await budgetsService.createBudget(createData);

      setNewBudget({
        category: '',
        budgetAmount: '',
      });
      setIsCreating(false);

      await loadBudgets();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création du budget');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      try {
        await budgetsService.deleteBudget(id);
        await loadBudgets();
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100)
      return { icon: ExclamationTriangleIcon, text: 'Dépassé', color: 'text-red-600' };
    if (percentage > 80)
      return { icon: ExclamationTriangleIcon, text: 'Attention', color: 'text-orange-600' };
    return { icon: CheckCircleIcon, text: 'OK', color: 'text-green-600' };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des budgets...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget & Statistiques</h1>
            <p className="text-gray-600 mt-1">Gérez vos budgets et suivez vos dépenses</p>
          </div>
          <button onClick={() => setIsCreating(true)} className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouveau Budget
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Sélecteur de mois/année */}
        <div className="card">
          <div className="flex items-center gap-4">
            <label className="font-medium text-gray-700">Période:</label>
            <select
              className="input-field"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1).toLocaleDateString('fr-FR', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {budgets.length === 0 && (
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <p className="text-blue-800">
              <strong>Aucun budget trouvé pour cette période.</strong> Créez votre premier budget
              pour commencer à suivre vos dépenses !
            </p>
            <p className="text-blue-700 text-sm mt-2">
              Cliquez sur "Nouveau Budget" pour créer un budget par catégorie (Alimentation,
              Transport, Loisirs, etc.)
            </p>
          </div>
        )}

        {/* Résumé Mensuel */}
        {budgets.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Budget Total</p>
                    <p className="text-2xl font-bold text-green-700 mt-2">
                      {formatCurrency(totalBudget)}
                    </p>
                  </div>
                  <ChartBarIcon className="w-10 h-10 text-green-600 opacity-20" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Dépensé</p>
                    <p className="text-2xl font-bold text-orange-700 mt-2">
                      {formatCurrency(totalSpent)}
                    </p>
                  </div>
                  <ArrowTrendingDownIcon className="w-10 h-10 text-orange-600 opacity-20" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-l-4 border-primary-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-600">Restant</p>
                    <p className="text-2xl font-bold text-primary-700 mt-2">
                      {formatCurrency(totalBudget - totalSpent)}
                    </p>
                  </div>
                  <ArrowTrendingUpIcon className="w-10 h-10 text-primary-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Budgets par Catégorie */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Budgets par Catégorie</h2>
              <div className="space-y-6">
                {budgets.map((item) => {
                  const percentage = Math.min((item.spent / item.budgetAmount) * 100, 100);
                  const Status = getBudgetStatus(item.spent, item.budgetAmount);
                  const StatusIcon = Status.icon;

                  return (
                    <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{item.category}</h3>
                          <StatusIcon className={`w-5 h-5 ${Status.color}`} />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.spent)} / {formatCurrency(item.budgetAmount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Restant: {formatCurrency(Math.max(0, item.budgetAmount - item.spent))}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteBudget(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${getProgressColor(
                              item.spent,
                              item.budgetAmount
                            )} h-3 rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-right">
                          {percentage.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Info sur les dépenses */}
        <div className="card bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Comment ça marche ?</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>1.</strong> Créez des budgets pour différentes catégories (Alimentation,
              Transport, Loisirs, Shopping, etc.)
            </p>
            <p>
              <strong>2.</strong> Définissez un montant limite pour chaque catégorie
            </p>
            <p>
              <strong>3.</strong> Le système suit automatiquement vos dépenses et vous alerte en cas
              de dépassement
            </p>
            <p className="text-primary-600 font-medium mt-4">
              Vous et Asmae pouvez créer vos propres budgets pour mieux gérer vos finances de
              couple !
            </p>
          </div>
        </div>

        {/* Modal de création */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Nouveau Budget</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ex: Alimentation, Transport, Loisirs..."
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Exemples: Alimentation, Transport, Loisirs, Shopping, Santé, Éducation
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Montant du budget (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field"
                    placeholder="500"
                    value={newBudget.budgetAmount}
                    onChange={(e) =>
                      setNewBudget({ ...newBudget, budgetAmount: e.target.value })
                    }
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    Ce budget sera créé pour{' '}
                    <strong>
                      {new Date(currentYear, currentMonth - 1).toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewBudget({ category: '', budgetAmount: '' });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                  <button onClick={handleCreateBudget} className="btn-primary flex-1">
                    Créer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
