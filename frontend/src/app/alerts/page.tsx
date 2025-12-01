'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import {
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { alertsService, Alert, AlertType, CreateAlertDto } from '@/services/alerts.service';

type AlertFilter = 'all' | 'unread' | 'urgent';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    type: AlertType.INFO,
    actionUrl: '',
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alertsService.getAllAlerts();
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des alertes');
      console.error('Erreur de chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertConfig = (type: AlertType) => {
    const configs = {
      [AlertType.URGENT]: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        iconColor: 'text-red-600',
        textColor: 'text-red-900',
      },
      [AlertType.WARNING]: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-900',
      },
      [AlertType.INFO]: {
        icon: InformationCircleIcon,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-900',
      },
      [AlertType.SUCCESS]: {
        icon: CheckCircleIcon,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        iconColor: 'text-green-600',
        textColor: 'text-green-900',
      },
    };
    return configs[type];
  };

  const markAsRead = async (id: string) => {
    try {
      await alertsService.markAsRead(id);
      await loadAlerts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la modification du statut');
    }
  };

  const deleteAlert = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      try {
        await alertsService.deleteAlert(id);
        await loadAlerts();
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleCreateAlert = async () => {
    if (!newAlert.title.trim() || !newAlert.description.trim()) {
      alert('Veuillez remplir au moins le titre et la description');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const createData: CreateAlertDto = {
        userId: user?.id,
        type: newAlert.type,
        title: newAlert.title,
        description: newAlert.description,
        actionUrl: newAlert.actionUrl || undefined,
      };

      await alertsService.createAlert(createData);

      setNewAlert({
        title: '',
        description: '',
        type: AlertType.INFO,
        actionUrl: '',
      });
      setIsCreating(false);

      await loadAlerts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de l\'alerte');
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'urgent') return alert.type === AlertType.URGENT;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const urgentCount = alerts.filter((a) => a.type === AlertType.URGENT).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des alertes...</div>
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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BellAlertIcon className="w-8 h-8 mr-3 text-primary-600" />
              Alertes & Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              Vous avez {unreadCount} alerte(s) non lue(s)
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouvelle Alerte
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filtres */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unread'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Non lues ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'urgent'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Urgentes ({urgentCount})
          </button>
        </div>

        {/* Liste des alertes */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">Aucune alerte pour le moment</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
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
                            {new Date(alert.date).toLocaleDateString('fr-FR', {
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

        {/* Formulaire de création (modal) */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Nouvelle Alerte</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    className="input-field"
                    value={newAlert.type}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, type: e.target.value as AlertType })
                    }
                  >
                    <option value={AlertType.INFO}>Information</option>
                    <option value={AlertType.SUCCESS}>Succès</option>
                    <option value={AlertType.WARNING}>Avertissement</option>
                    <option value={AlertType.URGENT}>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Titre de l'alerte"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Description..."
                    value={newAlert.description}
                    onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lien d'action (optionnel)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="/expenses, /projects, etc."
                    value={newAlert.actionUrl}
                    onChange={(e) => setNewAlert({ ...newAlert, actionUrl: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewAlert({
                        title: '',
                        description: '',
                        type: AlertType.INFO,
                        actionUrl: '',
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                  <button onClick={handleCreateAlert} className="btn-primary flex-1">
                    Créer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
