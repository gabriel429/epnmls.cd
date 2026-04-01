'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CreatePointageForm } from '@/components/CreatePointageForm';
import { EditPointageForm } from '@/components/EditPointageForm';
import type { Pointage } from '@/lib/types';

export default function PointagesPage() {
  const [pointages, setPointages] = useState<Pointage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPointage, setSelectedPointage] = useState<Pointage | null>(null);

  useEffect(() => {
    fetchPointages();
  }, []);

  const fetchPointages = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('pointages')
        .select('*')
        .order('date_pointage', { ascending: false })
        .limit(100);

      if (err) throw err;
      setPointages(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des pointages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut?: string) => {
    const styles: Record<string, string> = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      justified: 'bg-blue-100 text-blue-800',
    };
    return styles[statut || ''] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        const { error: deleteError } = await supabase
          .from('pointages')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        fetchPointages();
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-main">
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ⏰ Pointages
              </h1>
              <p className="text-gray-600">Gestion des présences et absences</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:scale-105 transform duration-150"
            >
              ➕ Saisir un pointage
            </button>
          </div>

          <CreatePointageForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchPointages}
          />

          <EditPointageForm
            isOpen={editModalOpen}
            pointage={selectedPointage}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedPointage(null);
            }}
            onSuccess={fetchPointages}
          />

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 mb-8 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {!loading && pointages.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <p className="text-gray-600 text-lg">Aucun pointage trouvé</p>
            </div>
          )}

          {!loading && pointages.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        👤 Agent
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        📅 Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        🔔 Arrivée
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        🔚 Départ
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        🎯 Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        ⚙️ Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointages.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 text-sm">
                          <span className="font-bold text-gray-900">Agent #{p.agent_id}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(p.date_pointage).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {p.heure_arrivee || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {p.heure_depart || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusBadge(
                              p.statut
                            )}`}
                          >
                            {p.statut === 'present' && '✅ Présent'}
                            {p.statut === 'absent' && '❌ Absent'}
                            {p.statut === 'late' && '⏱️ En retard'}
                            {p.statut === 'justified' && '📝 Justifié'}
                            {!p.statut && 'Inconnu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPointage(p);
                              setEditModalOpen(true);
                            }}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium py-1 px-3 rounded-lg transition-all inline-block"
                          >
                            ✏️ Éditer
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="bg-red-100 text-red-700 hover:bg-red-200 font-medium py-1 px-3 rounded-lg transition-all inline-block"
                          >
                            🗑️ Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Présents</p>
                  <div className="text-4xl font-bold text-green-600">
                    {pointages.filter((p) => p.statut === 'present').length}
                  </div>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg p-6 border border-red-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Absents</p>
                  <div className="text-4xl font-bold text-red-600">
                    {pointages.filter((p) => p.statut === 'absent').length}
                  </div>
                </div>
                <span className="text-3xl">❌</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 border border-yellow-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">En retard</p>
                  <div className="text-4xl font-bold text-yellow-600">
                    {pointages.filter((p) => p.statut === 'late').length}
                  </div>
                </div>
                <span className="text-3xl">⏱️</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Total</p>
                  <div className="text-4xl font-bold text-blue-600">
                    {pointages.length}
                  </div>
                </div>
                <span className="text-3xl">📊</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

