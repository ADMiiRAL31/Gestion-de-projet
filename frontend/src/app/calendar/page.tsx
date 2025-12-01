'use client';

import { useState } from 'react';
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
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Décembre 2025

  // Événements du calendrier (à remplacer par de vraies données)
  const events: CalendarEvent[] = [
    { id: '1', title: 'Salaire Younes', amount: 4500, type: 'income', date: new Date(2025, 11, 1), recurring: true },
    { id: '2', title: 'Salaire Asmae', amount: 3800, type: 'income', date: new Date(2025, 11, 1), recurring: true },
    { id: '3', title: 'Loyer', amount: 1200, type: 'expense', date: new Date(2025, 11, 1), recurring: true },
    { id: '4', title: 'Mensualité Crédit Voiture', amount: 450, type: 'loan', date: new Date(2025, 11, 5), recurring: true },
    { id: '5', title: 'Assurance Voiture', amount: 50, type: 'expense', date: new Date(2025, 11, 10), recurring: true },
    { id: '6', title: 'Abonnement Netflix', amount: 15.99, type: 'expense', date: new Date(2025, 11, 12), recurring: true },
    { id: '7', title: 'Électricité & Eau', amount: 150, type: 'expense', date: new Date(2025, 11, 15), recurring: true },
    { id: '8', title: 'Internet & Téléphone', amount: 60, type: 'expense', date: new Date(2025, 11, 20), recurring: true },
    { id: '9', title: 'Abonnement Gym (Asmae)', amount: 45, type: 'expense', date: new Date(2025, 11, 25), recurring: true },
    { id: '10', title: 'Contribution Projet Japon', amount: 800, type: 'expense', date: new Date(2025, 11, 28), recurring: false },
  ];

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
      </div>
    </DashboardLayout>
  );
}
