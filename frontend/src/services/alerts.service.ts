const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export enum AlertType {
  URGENT = 'URGENT',
  WARNING = 'WARNING',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
}

export interface Alert {
  id: string;
  userId?: string;
  type: AlertType;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateAlertDto {
  userId?: string;
  type: AlertType;
  title: string;
  description: string;
  date?: string;
  isRead?: boolean;
  actionUrl?: string;
}

export interface UpdateAlertDto {
  userId?: string;
  type?: AlertType;
  title?: string;
  description?: string;
  date?: string;
  isRead?: boolean;
  actionUrl?: string;
}

class AlertsService {
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

  async getAllAlerts(userId?: string, type?: string): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (type) params.append('type', type);

    const queryString = params.toString();
    const url = `${API_URL}/alerts${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des alertes');
    }

    return response.json();
  }

  async getUnreadAlerts(userId?: string): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);

    const queryString = params.toString();
    const url = `${API_URL}/alerts/unread${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des alertes non lues');
    }

    return response.json();
  }

  async getAlertById(id: string): Promise<Alert> {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Alerte non trouvée');
    }

    return response.json();
  }

  async createAlert(data: CreateAlertDto): Promise<Alert> {
    const response = await fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Échec de la création de l\'alerte');
    }

    return response.json();
  }

  async updateAlert(id: string, data: UpdateAlertDto): Promise<Alert> {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Échec de la mise à jour de l\'alerte');
    }

    return response.json();
  }

  async markAsRead(id: string): Promise<Alert> {
    const response = await fetch(`${API_URL}/alerts/${id}/read`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la modification du statut');
    }

    return response.json();
  }

  async markAllAsRead(userId?: string): Promise<void> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);

    const queryString = params.toString();
    const url = `${API_URL}/alerts/read-all/user${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la modification du statut');
    }
  }

  async deleteAlert(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la suppression de l\'alerte');
    }
  }
}

export const alertsService = new AlertsService();
