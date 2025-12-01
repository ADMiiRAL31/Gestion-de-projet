'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { dashboardAPI } from '@/lib/api';
import {
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      console.error('Échec du chargement du tableau de bord:', error);
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

  const getStatusLabel = (status: string) => {
    const labels = {
      IDEA: 'Idée',
      PLANNING: 'Planification',
      IN_PROGRESS: 'En cours',
      DONE: 'Terminé',
      CANCELLED: 'Annulé',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-700',
      MEDIUM: 'bg-orange-100 text-orange-700',
      HIGH: 'bg-red-100 text-red-700',
    };
    return colors[priority as keyof typeof colors] || colors.MEDIUM;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      LOW: 'Basse',
      MEDIUM: 'Moyenne',
      HIGH: 'Haute',
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600">Échec du chargement des données</div>
      </DashboardLayout>
    );
  }

  // Données pour le graphique en barres (revenus vs dépenses)
  const barChartData = [
    {
      name: 'Revenus',
      montant: data.income.total,
      fill: '#10b981',
    },
    {
      name: 'Dépenses',
      montant: data.expenses.total,
      fill: '#f59e0b',
    },
    {
      name: 'Crédits',
      montant: data.loans.totalMonthlyPayment,
      fill: '#ef4444',
    },
    {
      name: 'Disponible',
      montant: data.disposableIncome,
      fill: '#3b82f6',
    },
  ];

  // Données pour le graphique circulaire (répartition des dépenses)
  const pieChartData = [
    { name: 'Dépenses', value: data.expenses.total, color: '#f59e0b' },
    { name: 'Crédits', value: data.loans.totalMonthlyPayment, color: '#ef4444' },
    { name: 'Épargne', value: data.disposableIncome, color: '#10b981' },
  ];

  // Calcul du taux d'épargne
  const savingsRate = data.income.total > 0
    ? ((data.disposableIncome / data.income.total) * 100).toFixed(1)
    : '0';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de vos finances et projets</p>
          </div>
          <div className="bg-primary-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-primary-600 font-medium">Taux d'épargne</p>
            <p className="text-2xl font-bold text-primary-700">{savingsRate}%</p>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenus mensuels */}
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 flex items-center">
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  Revenus Mensuels
                </p>
                <p className="text-2xl font-bold text-green-700 mt-2">
                  {formatCurrency(data.income.total)}
                </p>
                <p className="text-xs text-green-600 mt-1">{data.income.count} source(s)</p>
              </div>
              <BanknotesIcon className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          {/* Dépenses mensuelles */}
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 flex items-center">
                  <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                  Dépenses Mensuelles
                </p>
                <p className="text-2xl font-bold text-orange-700 mt-2">
                  {formatCurrency(data.expenses.total)}
                </p>
                <p className="text-xs text-orange-600 mt-1">{data.expenses.count} dépense(s)</p>
              </div>
              <CreditCardIcon className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          {/* Mensualités crédits */}
          <div className="card bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Mensualités Crédits</p>
                <p className="text-2xl font-bold text-red-700 mt-2">
                  {formatCurrency(data.loans.totalMonthlyPayment)}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Dette totale: {formatCurrency(data.loans.totalDebt)}
                </p>
              </div>
              <BuildingLibraryIcon className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </div>

          {/* Revenu disponible */}
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">Revenu Disponible</p>
                <p className="text-2xl font-bold text-primary-700 mt-2">
                  {formatCurrency(data.disposableIncome)}
                </p>
                <p className="text-xs text-primary-600 mt-1">Capacité d'épargne</p>
              </div>
              <WalletIcon className="w-12 h-12 text-primary-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique en barres */}
          <div className="card">
            <div className="flex items-center mb-6">
              <ChartBarIcon className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Répartition Mensuelle</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="montant" radius={[8, 8, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique circulaire */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Utilisation du Budget</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projets de couple */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Projets de Couple</h2>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {data.projects.total} projet(s) total
            </span>
          </div>

          {data.projects.summaries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun projet en cours</p>
          ) : (
            <div className="space-y-4">
              {data.projects.summaries.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Objectif: {formatCurrency(project.targetAmount)} • Échéance:{' '}
                        {new Date(project.targetDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          project.priority
                        )}`}
                      >
                        {getPriorityLabel(project.priority)}
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {formatCurrency(project.totalContributions)} économisé
                      </span>
                      <span className="font-medium text-primary-600">
                        {project.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all"
                        style={{ width: `${Math.min(project.completionPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Résumé financier mensuel */}
        <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h3 className="text-lg font-semibold mb-4">Résumé Financier Mensuel</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-primary-100 text-sm mb-1">Revenus Totaux</p>
              <p className="text-3xl font-bold">{formatCurrency(data.income.total)}</p>
            </div>
            <div>
              <p className="text-primary-100 text-sm mb-1">Sorties Totales</p>
              <p className="text-3xl font-bold">
                {formatCurrency(data.expenses.total + data.loans.totalMonthlyPayment)}
              </p>
            </div>
            <div>
              <p className="text-primary-100 text-sm mb-1">Épargne Nette</p>
              <p className="text-3xl font-bold">{formatCurrency(data.disposableIncome)}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
