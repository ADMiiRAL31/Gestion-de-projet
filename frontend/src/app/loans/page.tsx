'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { loansAPI } from '@/lib/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import LoanModal from '@/components/Loans/LoanModal';

interface Loan {
  id: string;
  label: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  lender: string | null;
  isShared: boolean;
  user: { id: string; firstName: string } | null;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const data = await loansAPI.getAll();
      setLoans(data);
    } catch (error) {
      console.error('Failed to load loans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) return;

    try {
      await loansAPI.delete(id);
      loadLoans();
    } catch (error) {
      console.error('Failed to delete loan:', error);
      alert('Failed to delete loan');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const calculateProgress = (total: number, remaining: number) => {
    return ((total - remaining) / total) * 100;
  };

  const calculateRemainingMonths = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffMonths = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
    return Math.max(0, diffMonths);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
            <p className="text-gray-600 mt-1">Manage all loans</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Loan
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading loans...</p>
            </div>
          </div>
        ) : loans.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No loans yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans.map((loan) => (
              <div key={loan.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{loan.label}</h3>
                    {loan.lender && <p className="text-sm text-gray-600">{loan.lender}</p>}
                    <span className="text-xs text-primary-600 font-medium">
                      {loan.isShared ? 'Shared' : loan.user?.firstName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedLoan(loan);
                        setIsModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(loan.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold">{formatCurrency(loan.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(loan.remainingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(loan.monthlyPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-semibold">{loan.interestRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining Months:</span>
                    <span className="font-semibold">{calculateRemainingMonths(loan.endDate)}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Repayment Progress</span>
                      <span className="font-medium text-green-600">
                        {Math.round(calculateProgress(loan.totalAmount, loan.remainingAmount))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${calculateProgress(loan.totalAmount, loan.remainingAmount)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && <LoanModal loan={selectedLoan} onClose={() => { setIsModalOpen(false); setSelectedLoan(null); loadLoans(); }} />}
    </DashboardLayout>
  );
}
