'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  CalendarIcon,
  BellAlertIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: HomeIcon },
  { name: 'Revenus', href: '/incomes', icon: BanknotesIcon },
  { name: 'Dépenses', href: '/expenses', icon: CreditCardIcon },
  { name: 'Crédits', href: '/loans', icon: BuildingLibraryIcon },
  { name: 'Projets de Couple', href: '/projects', icon: HeartIcon },
  { name: 'Budget & Statistiques', href: '/budget', icon: ChartBarIcon },
  { name: 'Calendrier', href: '/calendar', icon: CalendarIcon },
  { name: 'Alertes', href: '/alerts', icon: BellAlertIcon },
  { name: 'Notes & Rappels', href: '/notes', icon: DocumentTextIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-primary-600">
        <h1 className="text-2xl font-bold text-white">💑 Vie de Couple</h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-semibold">
              {user?.firstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.firstName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
