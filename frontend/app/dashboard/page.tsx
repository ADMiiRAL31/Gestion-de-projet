'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardOverview } from '@/types'
import api from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { DollarSign, TrendingUp, TrendingDown, Target, AlertCircle, Wallet } from 'lucide-react'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/overview')
      setData(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-destructive">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error || 'Failed to load dashboard'}</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Monthly Income',
      value: formatCurrency(data.monthlyIncome),
      description: `From ${data.breakdown.incomeCount} sources`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(data.monthlyExpenses),
      description: `${data.breakdown.expenseCount} recurring expenses`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Loan Payments',
      value: formatCurrency(data.monthlyLoanPayments),
      description: `${data.breakdown.loanCount} active loans`,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Disposable Income',
      value: formatCurrency(data.disposableIncome),
      description: 'After expenses & loans',
      icon: Wallet,
      color: data.disposableIncome >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.disposableIncome >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: 'Saving Capacity',
      value: formatCurrency(data.savingCapacity),
      description: 'Available for goals',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Debt',
      value: formatCurrency(data.totalDebt),
      description: 'Remaining to pay',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial situation and couple projects
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Projects ({data.activeProjects})</CardTitle>
          <CardDescription>Your couple savings goals and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          {data.projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No active projects. Start by creating your first couple goal!
            </p>
          ) : (
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Target: {formatCurrency(project.targetAmount)} by{' '}
                        {new Date(project.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        project.priority === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : project.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {project.priority}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {formatCurrency(project.totalContributed)} / {formatCurrency(project.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(project.progressPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-primary">
                        {formatPercentage(project.progressPercentage)} complete
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(project.remainingAmount)} remaining
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
