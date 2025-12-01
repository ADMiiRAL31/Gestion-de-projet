'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import {
  DocumentTextIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { notesService, Note, NoteCategory, CreateNoteDto } from '@/services/notes.service';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: NoteCategory.TACHE,
  });

  // Charger les notes au montage du composant
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesService.getAllNotes();
      setNotes(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des notes');
      console.error('Erreur de chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      TACHE: 'bg-blue-100 text-blue-700 border-blue-300',
      IDEE: 'bg-purple-100 text-purple-700 border-purple-300',
      RAPPEL: 'bg-orange-100 text-orange-700 border-orange-300',
      IMPORTANT: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      TACHE: 'Tâche',
      IDEE: 'Idée',
      RAPPEL: 'Rappel',
      IMPORTANT: 'Important',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const toggleComplete = async (id: string) => {
    try {
      await notesService.toggleComplete(id);
      // Recharger les notes pour obtenir les données à jour
      await loadNotes();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la modification du statut');
    }
  };

  const deleteNote = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await notesService.deleteNote(id);
        // Recharger les notes
        await loadNotes();
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      // Récupérer l'utilisateur depuis le localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Vous devez être connecté pour créer une note');
        return;
      }
      const user = JSON.parse(userStr);

      const createData: CreateNoteDto = {
        userId: user.id,
        title: newNote.title,
        content: newNote.content,
        category: newNote.category,
      };

      await notesService.createNote(createData);

      // Réinitialiser le formulaire
      setNewNote({
        title: '',
        content: '',
        category: NoteCategory.TACHE,
      });
      setIsAddingNote(false);

      // Recharger les notes
      await loadNotes();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de la note');
    }
  };

  const filteredNotes = selectedCategory === 'all'
    ? notes
    : notes.filter((note) => note.category === selectedCategory);

  const stats = {
    total: notes.length,
    taches: notes.filter((n) => n.category === NoteCategory.TACHE).length,
    rappels: notes.filter((n) => n.category === NoteCategory.RAPPEL).length,
    completed: notes.filter((n) => n.completed).length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des notes...</div>
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
              <DocumentTextIcon className="w-8 h-8 mr-3 text-primary-600" />
              Notes & Rappels
            </h1>
            <p className="text-gray-600 mt-1">Espace partagé pour vos notes et tâches de couple</p>
          </div>
          <button
            onClick={() => setIsAddingNote(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouvelle Note
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-primary-50 border-l-4 border-primary-500">
            <p className="text-sm text-primary-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-primary-700 mt-1">{stats.total}</p>
          </div>
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <p className="text-sm text-blue-600 font-medium">Tâches</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{stats.taches}</p>
          </div>
          <div className="card bg-orange-50 border-l-4 border-orange-500">
            <p className="text-sm text-orange-600 font-medium">Rappels</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">{stats.rappels}</p>
          </div>
          <div className="card bg-green-50 border-l-4 border-green-500">
            <p className="text-sm text-green-600 font-medium">Complétées</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.completed}</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes ({notes.length})
          </button>
          <button
            onClick={() => setSelectedCategory(NoteCategory.TACHE)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === NoteCategory.TACHE
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tâches ({stats.taches})
          </button>
          <button
            onClick={() => setSelectedCategory(NoteCategory.RAPPEL)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === NoteCategory.RAPPEL
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rappels ({stats.rappels})
          </button>
          <button
            onClick={() => setSelectedCategory(NoteCategory.IMPORTANT)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === NoteCategory.IMPORTANT
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Important
          </button>
          <button
            onClick={() => setSelectedCategory(NoteCategory.IDEE)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === NoteCategory.IDEE
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Idées
          </button>
        </div>

        {/* Liste des notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`card border-l-4 ${getCategoryColor(note.category)} ${
                note.completed ? 'opacity-60' : ''
              } hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        note.category
                      )}`}
                    >
                      {getCategoryLabel(note.category)}
                    </span>
                    {note.category === NoteCategory.TACHE && (
                      <button
                        onClick={() => toggleComplete(note.id)}
                        className={`text-xs px-2 py-1 rounded ${
                          note.completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {note.completed ? 'Fait ✓' : 'À faire'}
                      </button>
                    )}
                  </div>
                  <h3 className={`font-semibold text-gray-900 ${note.completed ? 'line-through' : ''}`}>
                    {note.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{note.content}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <HeartIcon className="w-4 h-4 text-pink-500" />
                  <span>{note.user?.firstName || 'Utilisateur'}</span>
                  <ClockIcon className="w-4 h-4 ml-2" />
                  <span>{new Date(note.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="card text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune note dans cette catégorie</p>
          </div>
        )}

        {/* Formulaire d'ajout (modal) */}
        {isAddingNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Nouvelle Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Titre de la note"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contenu</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Contenu..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <select
                    className="input-field"
                    value={newNote.category}
                    onChange={(e) =>
                      setNewNote({ ...newNote, category: e.target.value as NoteCategory })
                    }
                  >
                    <option value={NoteCategory.TACHE}>Tâche</option>
                    <option value={NoteCategory.IDEE}>Idée</option>
                    <option value={NoteCategory.RAPPEL}>Rappel</option>
                    <option value={NoteCategory.IMPORTANT}>Important</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote({
                        title: '',
                        content: '',
                        category: NoteCategory.TACHE,
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                  <button onClick={handleCreateNote} className="btn-primary flex-1">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
