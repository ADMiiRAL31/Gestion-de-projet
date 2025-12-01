'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import {
  ChartBarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BudgetPage() {
  // Données de budget simulées (à remplacer par de vraies données API)
  const budgets = [
    { category: 'Alimentation', budget: 500, spent: 420, color: '#10b981' },
    { category: 'Transport', budget: 200, spent: 180, color: '#3b82f6' },
    { category: 'Loisirs', budget: 300, spent: 350, color: '#f59e0b' },
    { category: 'Shopping', budget: 250, spent: 180, color: '#8b5cf6' },
    { category: 'Santé', budget: 150, spent: 90, color: '#ef4444' },
  ];

  // Données d'évolution sur 6 mois
  const evolutionData = [
    { mois: 'Juil', revenus: 8300, depenses: 6500, epargne: 1800 },
    { mois: 'Août', revenus: 8500, depenses: 6800, epargne: 1700 },
    { mois: 'Sept', revenus: 8300, depenses: 6600, epargne: 1700 },
    { mois: 'Oct', revenus: 9100, depenses: 6900, epargne: 2200 },
    { mois: 'Nov', revenus: 8300, depenses: 6500, epargne: 1800 },
    { mois: 'Déc', revenus: 9100, depenses: 7200, epargne: 1900 },
  ];

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
    if (percentage > 100) return { icon: ExclamationTriangleIcon, text: 'Dépassé', color: 'text-red-600' };
    if (percentage > 80) return { icon: ExclamationTriangleIcon, text: 'Attention', color: 'text-orange-600' };
    return { icon: CheckCircleIcon, text: 'OK', color: 'text-green-600' };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget & Statistiques</h1>
            <p className="text-gray-600 mt-1">Gérez vos budgets et suivez vos dépenses</p>
          </div>
          <button className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouveau Budget
          </button>
        </div>

        {/* Résumé Mensuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Budget Total</p>
                <p className="text-2xl font-bold text-green-700 mt-2">
                  {formatCurrency(budgets.reduce((sum, b) => sum + b.budget, 0))}
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
                  {formatCurrency(budgets.reduce((sum, b) => sum + b.spent, 0))}
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
                  {formatCurrency(budgets.reduce((sum, b) => sum + b.budget - b.spent, 0))}
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
              const percentage = Math.min((item.spent / item.budget) * 100, 100);
              const Status = getBudgetStatus(item.spent, item.budget);
              const StatusIcon = Status.icon;

              return (
                <div key={item.category} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <h3 className="font-semibold text-gray-900">{item.category}</h3>
                      <StatusIcon className={`w-5 h-5 ${Status.color}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Restant: {formatCurrency(Math.max(0, item.budget - item.spent))}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${getProgressColor(item.spent, item.budget)} h-3 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-right">{percentage.toFixed(0)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graphique d'évolution */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Évolution sur 6 mois</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelStyle={{ color: '#374151' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={2} name="Revenus" />
              <Line type="monotone" dataKey="depenses" stroke="#ef4444" strokeWidth={2} name="Dépenses" />
              <Line type="monotone" dataKey="epargne" stroke="#3b82f6" strokeWidth={2} name="Épargne" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistiques Détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Moyennes Mensuelles</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenus moyens</span>
                <span className="font-semibold text-green-600">{formatCurrency(8600)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dépenses moyennes</span>
                <span className="font-semibold text-orange-600">{formatCurrency(6750)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Épargne moyenne</span>
                <span className="font-semibold text-primary-600">{formatCurrency(1850)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Indicateurs Clés</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux d'épargne</span>
                <span className="font-semibold text-primary-600">21.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Meilleur mois</span>
                <span className="font-semibold text-green-600">Octobre (2200€)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projection annuelle</span>
                <span className="font-semibold text-primary-600">{formatCurrency(22200)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
