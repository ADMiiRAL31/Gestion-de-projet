const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export enum NoteCategory {
  TACHE = 'TACHE',
  IDEE = 'IDEE',
  RAPPEL = 'RAPPEL',
  IMPORTANT = 'IMPORTANT',
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: NoteCategory;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateNoteDto {
  userId: string;
  title: string;
  content: string;
  category: NoteCategory;
  completed?: boolean;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  category?: NoteCategory;
  completed?: boolean;
}

class NotesService {
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

  async getAllNotes(userId?: string, category?: string): Promise<Note[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (category) params.append('category', category);

    const queryString = params.toString();
    const url = `${API_URL}/notes${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des notes');
    }

    return response.json();
  }

  async getNoteById(id: string): Promise<Note> {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Note non trouvée');
    }

    return response.json();
  }

  async createNote(data: CreateNoteDto): Promise<Note> {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Échec de la création de la note');
    }

    return response.json();
  }

  async updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Échec de la mise à jour de la note');
    }

    return response.json();
  }

  async toggleComplete(id: string): Promise<Note> {
    const response = await fetch(`${API_URL}/notes/${id}/toggle`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la modification du statut');
    }

    return response.json();
  }

  async deleteNote(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la suppression de la note');
    }
  }
}

export const notesService = new NotesService();
