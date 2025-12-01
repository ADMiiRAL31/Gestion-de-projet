const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Budget {
  id: string;
  userId: string;
  category: string;
  budgetAmount: number;
  spent: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
  };
}

export interface CreateBudgetDto {
  userId: string;
  category: string;
  budgetAmount: number;
  spent?: number;
  month: number;
  year: number;
}

export interface UpdateBudgetDto {
  category?: string;
  budgetAmount?: number;
  spent?: number;
  month?: number;
  year?: number;
}

export interface BudgetStats {
  budgets: Budget[];
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentage: number;
}

class BudgetsService {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getAllBudgets(userId?: string, month?: number, year?: number): Promise<Budget[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());

    const queryString = params.toString();
    const url = `${API_URL}/budgets${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des budgets');
    }

    return response.json();
  }

  async getBudgetStats(userId: string, month: number, year: number): Promise<BudgetStats> {
    const params = new URLSearchParams({
      userId,
      month: month.toString(),
      year: year.toString(),
    });

    const response = await fetch(`${API_URL}/budgets/stats?${params}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des statistiques');
    }

    return response.json();
  }

  async getBudgetsByUser(userId: string, month: number, year: number): Promise<Budget[]> {
    const params = new URLSearchParams({
      month: month.toString(),
      year: year.toString(),
    });

    const response = await fetch(`${API_URL}/budgets/user/${userId}?${params}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des budgets');
    }

    return response.json();
  }

  async getBudgetById(id: string): Promise<Budget> {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Budget non trouvé');
    }

    return response.json();
  }

  async createBudget(data: CreateBudgetDto): Promise<Budget> {
    const response = await fetch(`${API_URL}/budgets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Échec de la création du budget');
    }

    return response.json();
  }

  async updateBudget(id: string, data: UpdateBudgetDto): Promise<Budget> {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Échec de la mise à jour du budget');
    }

    return response.json();
  }

  async updateSpent(id: string, spent: number): Promise<Budget> {
    const response = await fetch(`${API_URL}/budgets/${id}/spent`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ spent }),
    });

    if (!response.ok) {
      throw new Error('Échec de la mise à jour du montant dépensé');
    }

    return response.json();
  }

  async deleteBudget(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la suppression du budget');
    }
  }
}

export const budgetsService = new BudgetsService();
