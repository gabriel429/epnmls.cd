'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CreateRequestForm } from '@/components/CreateRequestForm';
import type { Request } from '@/lib/types';

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setRequests(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des demandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        const { error: deleteError } = await supabase
          .from('requests')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        fetchRequests();
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
              <h1 className="text-3xl font-bold text-gray-900">📋 Demandes</h1>
              <p className="text-gray-600">Gestion des demandes RH</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              ➕ Nouvelle Demande
            </button>
          </div>

          <CreateRequestForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchRequests}
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

          {!loading && requests.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">Aucune demande trouvée</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary"
              >
                ➕ Créer une première demande
              </button>
            </div>
          )}

          {!loading && requests.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">
                          <span className="font-medium text-gray-900">
                            {req.type_demande}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {req.description?.substring(0, 50)}...
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              req.statut
                            )}`}
                          >
                            {req.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(req.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button className="text-blue-600 hover:underline">
                            Voir
                          </button>
                          <button
                            onClick={() => handleDelete(req.id)}
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
              <div className="text-2xl font-bold text-blue-600">
                {requests.filter((r) => r.statut === 'pending').length}
              </div>
              <p className="text-gray-600 text-sm">En attente</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter((r) => r.statut === 'approved').length}
              </div>
              <p className="text-gray-600 text-sm">Approuvées</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-red-600">
                {requests.filter((r) => r.statut === 'rejected').length}
              </div>
              <p className="text-gray-600 text-sm">Rejetées</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-purple-600">
                {requests.length}
              </div>
              <p className="text-gray-600 text-sm">Total</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

