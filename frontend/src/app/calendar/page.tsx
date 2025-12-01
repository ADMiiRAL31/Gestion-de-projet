'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

interface CalendarEvent {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'loan';
  date: Date;
  recurring: boolean;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Charger les revenus
      const incomesResponse = await fetch(`${API_URL}/incomes`, { headers });
      const incomes = incomesResponse.ok ? await incomesResponse.json() : [];

      // Charger les dépenses récurrentes
      const expensesResponse = await fetch(`${API_URL}/recurring-expenses`, { headers });
      const expenses = expensesResponse.ok ? await expensesResponse.json() : [];

      // Charger les crédits
      const loansResponse = await fetch(`${API_URL}/loans`, { headers });
      const loans = loansResponse.ok ? await loansResponse.json() : [];

      // Convertir en événements calendrier
      const calendarEvents: CalendarEvent[] = [];

      // Ajouter les revenus (généralement mensuels le 1er du mois)
      incomes.forEach((income: any) => {
        const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        calendarEvents.push({
          id: `income-${income.id}`,
          title: `${income.source} (${income.user?.firstName || 'Revenu'})`,
          amount: income.amount,
          type: 'income',
          date: eventDate,
          recurring: true,
        });
      });

      // Ajouter les dépenses récurrentes
      expenses.forEach((expense: any) => {
        // Utiliser la date de début pour déterminer le jour du mois
        const startDate = new Date(expense.startDate);
        const dayOfMonth = startDate.getDate();
        const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayOfMonth);

        calendarEvents.push({
          id: `expense-${expense.id}`,
          title: expense.description,
          amount: expense.amount,
          type: 'expense',
          date: eventDate,
          recurring: true,
        });
      });

      // Ajouter les mensualités de crédit
      loans.forEach((loan: any) => {
        // Utiliser la date de début pour déterminer le jour du mois
        const startDate = new Date(loan.startDate);
        const dayOfMonth = startDate.getDate();
        const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayOfMonth);

        calendarEvents.push({
          id: `loan-${loan.id}`,
          title: `Mensualité ${loan.loanName}`,
          amount: loan.monthlyPayment,
          type: 'loan',
          date: eventDate,
          recurring: true,
        });
      });

      setEvents(calendarEvents);
    } catch (err: any) {
      console.error('Erreur de chargement:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Adjust so Monday is 0
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getEventsForDay = (day: number) => {
    return events.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <BanknotesIcon className="w-3 h-3" />;
      case 'expense':
        return <CreditCardIcon className="w-3 h-3" />;
      case 'loan':
        return <BuildingLibraryIcon className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'expense':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'loan':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOffset = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Calculer le total mensuel
  const monthlyIncome = events
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const monthlyExpenses = events
    .filter((e) => e.type === 'expense' || e.type === 'loan')
    .reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement du calendrier...</div>
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
              <CalendarIcon className="w-8 h-8 mr-3 text-primary-600" />
              Calendrier Financier
            </h1>
            <p className="text-gray-600 mt-1">Visualisez toutes vos échéances financières</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {events.length === 0 && !loading && (
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <p className="text-blue-800">
              <strong>Aucune donnée financière trouvée.</strong> Ajoutez vos revenus et dépenses pour voir votre calendrier financier !
            </p>
            <p className="text-blue-700 text-sm mt-2">
              Allez dans les sections Revenus, Dépenses ou Crédits pour commencer.
            </p>
          </div>
        )}

        {/* Résumé Mensuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-green-50 border-l-4 border-green-500">
            <p className="text-sm text-green-600 font-medium">Revenus du mois</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(monthlyIncome)}</p>
          </div>
          <div className="card bg-orange-50 border-l-4 border-orange-500">
            <p className="text-sm text-orange-600 font-medium">Dépenses du mois</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">{formatCurrency(monthlyExpenses)}</p>
          </div>
          <div className="card bg-primary-50 border-l-4 border-primary-500">
            <p className="text-sm text-primary-600 font-medium">Solde prévisionnel</p>
            <p className="text-2xl font-bold text-primary-700 mt-1">
              {formatCurrency(monthlyIncome - monthlyExpenses)}
            </p>
          </div>
        </div>

        {/* Calendrier */}
        <div className="card">
          {/* Navigation du mois */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{monthName}</h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {/* En-têtes des jours */}
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}

            {/* Jours vides avant le premier jour du mois */}
            {Array.from({ length: firstDayOffset }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[120px] bg-gray-50 rounded-lg"></div>
            ))}

            {/* Jours du mois */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`min-h-[120px] border rounded-lg p-2 ${
                    isToday ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  } hover:shadow-md transition-all`}
                >
                  <div className="font-semibold text-gray-700 mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded border ${getEventColor(event.type)} truncate`}
                        title={`${event.title} - ${formatCurrency(event.amount)}`}
                      >
                        <div className="flex items-center gap-1">
                          {getEventIcon(event.type)}
                          <span className="truncate">{event.title}</span>
                        </div>
                        <div className="font-semibold">{formatCurrency(event.amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Légende */}
        <div className="card bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">Revenus</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-700">Dépenses</span>
            </div>
            <div className="flex items-center gap-2">
              <BuildingLibraryIcon className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-700">Mensualités crédit</span>
            </div>
          </div>
        </div>

        {/* Note d'information */}
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <p className="text-blue-900 font-medium mb-2">Comment personnaliser votre calendrier</p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Ajoutez vos revenus dans la section <strong>Revenus</strong></li>
            <li>Créez vos dépenses récurrentes dans la section <strong>Dépenses</strong></li>
            <li>Enregistrez vos crédits dans la section <strong>Crédits</strong></li>
            <li>Le calendrier se met à jour automatiquement avec vos données</li>
            <li>Vous et Asmae pouvez chacun ajouter vos propres revenus et dépenses</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
