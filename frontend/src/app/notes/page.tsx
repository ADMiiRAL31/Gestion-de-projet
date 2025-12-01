'use client';

import { useState } from 'react';
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

interface Note {
  id: string;
  title: string;
  content: string;
  author: 'Younes' | 'Asmae';
  createdAt: Date;
  category: 'tache' | 'idee' | 'rappel' | 'important';
  completed?: boolean;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Rendez-vous banque',
      content: 'RDV jeudi 15h pour discuter du prêt immobilier',
      author: 'Younes',
      createdAt: new Date(2025, 11, 1),
      category: 'rappel',
    },
    {
      id: '2',
      title: 'Vacances été 2026',
      content: 'Réfléchir à la destination pour les vacances. Option: Grèce ou Italie?',
      author: 'Asmae',
      createdAt: new Date(2025, 11, 2),
      category: 'idee',
    },
    {
      id: '3',
      title: 'Acheter cadeau anniversaire maman',
      content: 'Anniversaire le 20 décembre. Budget: 100€',
      author: 'Younes',
      createdAt: new Date(2025, 11, 5),
      category: 'tache',
      completed: false,
    },
    {
      id: '4',
      title: 'Renouveler assurance habitation',
      content: 'L\'assurance arrive à échéance fin janvier. Comparer les offres',
      author: 'Asmae',
      createdAt: new Date(2025, 11, 7),
      category: 'important',
    },
    {
      id: '5',
      title: 'Courses hebdomadaires',
      content: 'Ne pas oublier: lait, pain, fruits, légumes',
      author: 'Asmae',
      createdAt: new Date(2025, 11, 10),
      category: 'tache',
      completed: true,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      tache: 'bg-blue-100 text-blue-700 border-blue-300',
      idee: 'bg-purple-100 text-purple-700 border-purple-300',
      rappel: 'bg-orange-100 text-orange-700 border-orange-300',
      important: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      tache: 'Tâche',
      idee: 'Idée',
      rappel: 'Rappel',
      important: 'Important',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const toggleComplete = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const filteredNotes = selectedCategory === 'all'
    ? notes
    : notes.filter((note) => note.category === selectedCategory);

  const stats = {
    total: notes.length,
    taches: notes.filter((n) => n.category === 'tache').length,
    rappels: notes.filter((n) => n.category === 'rappel').length,
    completed: notes.filter((n) => n.completed).length,
  };

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
            onClick={() => setSelectedCategory('tache')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'tache'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tâches ({stats.taches})
          </button>
          <button
            onClick={() => setSelectedCategory('rappel')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'rappel'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rappels ({stats.rappels})
          </button>
          <button
            onClick={() => setSelectedCategory('important')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'important'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Important
          </button>
          <button
            onClick={() => setSelectedCategory('idee')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'idee'
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
                    {note.category === 'tache' && (
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
                  <span>{note.author}</span>
                  <ClockIcon className="w-4 h-4 ml-2" />
                  <span>{note.createdAt.toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-primary-600 transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
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

        {/* Formulaire d'ajout (modal simplifié) */}
        {isAddingNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Nouvelle Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input type="text" className="input-field" placeholder="Titre de la note" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contenu</label>
                  <textarea className="input-field" rows={4} placeholder="Contenu..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <select className="input-field">
                    <option value="tache">Tâche</option>
                    <option value="idee">Idée</option>
                    <option value="rappel">Rappel</option>
                    <option value="important">Important</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsAddingNote(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button onClick={() => setIsAddingNote(false)} className="btn-primary flex-1">
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
