'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CreateRequestForm } from '@/components/CreateRequestForm';
import { EditRequestForm } from '@/components/EditRequestForm';
import type { Request } from '@/lib/types';

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-main">
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                📋 Demandes
              </h1>
              <p className="text-gray-600">Gestion des demandes RH</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:scale-105 transform duration-150"
            >
              ➕ Nouvelle Demande
            </button>
          </div>

          <CreateRequestForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchRequests}
          />

          <EditRequestForm
            isOpen={editModalOpen}
            request={selectedRequest}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedRequest(null);
            }}
            onSuccess={fetchRequests}
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

          {!loading && requests.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <p className="text-gray-600 mb-4 text-lg">Aucune demande trouvée</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:scale-105 transform duration-150"
              >
                ➕ Créer une première demande
              </button>
            </div>
          )}

          {!loading && requests.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        📌 Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        💬 Description
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        🎯 Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        📅 Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        ⚙️ Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 text-sm">
                          <span className="font-bold text-gray-900 text-base">
                            {req.type_demande}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {req.description?.substring(0, 50)}...
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(
                            req.statut
                          )}`}>
                            {req.statut === 'pending' && '⏳ ' }
                            {req.statut === 'approved' && '✅ '}
                            {req.statut === 'rejected' && '❌ '}
                            {req.statut === 'completed' && '🎉 '}
                            {req.statut.charAt(0).toUpperCase() + req.statut.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(req.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setEditModalOpen(true);
                            }}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium py-1 px-3 rounded-lg transition-all inline-block"
                          >
                            ✏️ Éditer
                          </button>
                          <button
                            onClick={() => handleDelete(req.id)}
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
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 border border-yellow-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">En attente</p>
                  <div className="text-4xl font-bold text-yellow-600">
                    {requests.filter((r) => r.statut === 'pending').length}
                  </div>
                </div>
                <span className="text-3xl">⏳</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Approuvées</p>
                  <div className="text-4xl font-bold text-green-600">
                    {requests.filter((r) => r.statut === 'approved').length}
                  </div>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg p-6 border border-red-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Rejetées</p>
                  <div className="text-4xl font-bold text-red-600">
                    {requests.filter((r) => r.statut === 'rejected').length}
                  </div>
                </div>
                <span className="text-3xl">❌</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Total</p>
                  <div className="text-4xl font-bold text-purple-600">
                    {requests.length}
                  </div>
                </div>
                <span className="text-3xl">📋</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

