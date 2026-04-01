'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CreatePointageForm } from '@/components/CreatePointageForm';
import type { Pointage } from '@/lib/types';

export default function PointagesPage() {
  const [pointages, setPointages] = useState<Pointage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <main className="min-h-screen bg-gray-50">
      <div className="container-main">
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">⏰ Pointages</h1>
              <p className="text-gray-600">Gestion des présences et absences</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              ➕ Saisir un pointage
            </button>
          </div>

          <CreatePointageForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchPointages}
          />

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {!loading && pointages.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">Aucun pointage trouvé</p>
            </div>
          )}

          {!loading && pointages.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Arrivée
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Départ
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointages.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Agent #{p.agent_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(p.date_pointage).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.heure_arrivee || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.heure_depart || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              p.statut
                            )}`}
                          >
                            {p.statut || 'Inconnu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button className="text-blue-600 hover:underline">
                            Éditer
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 hover:underline"
                          >
                            Supprimer
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">
                {pointages.filter((p) => p.statut === 'present').length}
              </div>
              <p className="text-gray-600 text-sm">Présents</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-red-600">
                {pointages.filter((p) => p.statut === 'absent').length}
              </div>
              <p className="text-gray-600 text-sm">Absents</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-yellow-600">
                {pointages.filter((p) => p.statut === 'late').length}
              </div>
              <p className="text-gray-600 text-sm">En retard</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-blue-600">
                {pointages.length}
              </div>
              <p className="text-gray-600 text-sm">Total</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

