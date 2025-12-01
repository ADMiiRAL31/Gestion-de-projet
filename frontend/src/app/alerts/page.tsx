'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import {
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type AlertType = 'urgent' | 'warning' | 'info' | 'success';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  date: Date;
  isRead: boolean;
  actionUrl?: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Loyer à payer dans 3 jours',
      description: 'Le loyer de 1200€ doit être payé le 1er du mois',
      date: new Date(2025, 11, 28),
      isRead: false,
      actionUrl: '/expenses',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Budget Loisirs dépassé',
      description: 'Vous avez dépassé votre budget loisirs de 50€ ce mois-ci',
      date: new Date(2025, 11, 27),
      isRead: false,
      actionUrl: '/budget',
    },
    {
      id: '3',
      type: 'info',
      title: 'Nouvelle contribution au projet Japon',
      description: 'Asmae a ajouté une contribution de 800€',
      date: new Date(2025, 11, 26),
      isRead: true,
      actionUrl: '/projects',
    },
    {
      id: '4',
      type: 'urgent',
      title: 'Assurance voiture à renouveler',
      description: 'L\'assurance arrive à échéance dans 15 jours',
      date: new Date(2025, 11, 25),
      isRead: false,
    },
    {
      id: '5',
      type: 'success',
      title: 'Objectif épargne atteint !',
      description: 'Vous avez atteint votre objectif d\'épargne mensuel de 1500€',
      date: new Date(2025, 11, 24),
      isRead: true,
    },
    {
      id: '6',
      type: 'warning',
      title: 'Crédit voiture - Mensualité bientôt prélevée',
      description: 'Le prélèvement de 450€ aura lieu dans 5 jours',
      date: new Date(2025, 11, 23),
      isRead: true,
      actionUrl: '/loans',
    },
  ]);

  const getAlertConfig = (type: AlertType) => {
    const configs = {
      urgent: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        iconColor: 'text-red-600',
        textColor: 'text-red-900',
      },
      warning: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-900',
      },
      info: {
        icon: InformationCircleIcon,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-900',
      },
      success: {
        icon: CheckCircleIcon,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        iconColor: 'text-green-600',
        textColor: 'text-green-900',
      },
    };
    return configs[type];
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BellAlertIcon className="w-8 h-8 mr-3 text-primary-600" />
              Alertes & Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              Vous avez {unreadCount} alerte(s) non lue(s)
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Toutes ({alerts.length})
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Non lues ({unreadCount})
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Urgentes ({alerts.filter(a => a.type === 'urgent').length})
          </button>
        </div>

        {/* Liste des alertes */}
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">Aucune alerte pour le moment</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const config = getAlertConfig(alert.type);
              const Icon = config.icon;

              return (
                <div
                  key={alert.id}
                  className={`card ${config.bgColor} border-l-4 ${config.borderColor} ${
                    !alert.isRead ? 'shadow-lg' : 'opacity-75'
                  } transition-all hover:shadow-xl`}
                >
                  <div className="flex items-start gap-4">
                    <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-1`} />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold ${config.textColor} flex items-center`}>
                            {alert.title}
                            {!alert.isRead && (
                              <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </h3>
                          <p className="text-gray-700 text-sm mt-1">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {alert.date.toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {!alert.isRead && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Marquer comme lu
                          </button>
                        )}
                        {alert.actionUrl && (
                          <a
                            href={alert.actionUrl}
                            className="text-xs px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            Voir les détails
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Paramètres des notifications */}
        <div className="card bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de Notification</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded" />
              <span className="ml-3 text-gray-700">Me rappeler les paiements 3 jours avant</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded" />
              <span className="ml-3 text-gray-700">Alertes de dépassement de budget</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded" />
              <span className="ml-3 text-gray-700">Notifications sur les contributions de projets</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
              <span className="ml-3 text-gray-700">Rappels hebdomadaires des objectifs d'épargne</span>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
