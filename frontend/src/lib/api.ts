import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (firstName: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { firstName, email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

// Incomes API
export const incomesAPI = {
  getAll: async (userId?: string) => {
    const response = await api.get('/incomes', {
      params: userId ? { userId } : undefined,
    });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/incomes/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/incomes', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/incomes/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/incomes/${id}`);
    return response.data;
  },
};

// Recurring Expenses API
export const expensesAPI = {
  getAll: async (userId?: string) => {
    const response = await api.get('/recurring-expenses', {
      params: userId ? { userId } : undefined,
    });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/recurring-expenses/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/recurring-expenses', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/recurring-expenses/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/recurring-expenses/${id}`);
    return response.data;
  },
};

// Loans API
export const loansAPI = {
  getAll: async (userId?: string) => {
    const response = await api.get('/loans', {
      params: userId ? { userId } : undefined,
    });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/loans', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/loans/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/loans/${id}`);
    return response.data;
  },
};

// Couple Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/couple-projects');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/couple-projects/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/couple-projects', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/couple-projects/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/couple-projects/${id}`);
    return response.data;
  },
  addContribution: async (data: any) => {
    const response = await api.post('/couple-projects/contributions', data);
    return response.data;
  },
  getContributions: async (projectId: string) => {
    const response = await api.get(`/couple-projects/${projectId}/contributions`);
    return response.data;
  },
  deleteContribution: async (contributionId: string) => {
    const response = await api.delete(`/couple-projects/contributions/${contributionId}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getOverview: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  getUserStats: async (userId: string) => {
    const response = await api.get(`/dashboard/user/${userId}`);
    return response.data;
  },
};
