'use client';

import { useEffect, useState } from 'react';
import { agentService } from '@/lib/api';
import type { Agent } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agentService.getAgents();
      setAgents(data);
    } catch (err) {
      setError('Erreur lors du chargement des agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="text-center p-8">
        <p>Veuillez vous connecter</p>
      </div>
    );
  }

  return (
    <div className="container-main">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Agents</h1>
        <p className="text-gray-600">
          Gérez les agents et leurs informations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{agents.length}</div>
          <p className="text-gray-600">Total d'agents</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">
            {agents.filter((a) => a.date_embauche).length}
          </div>
          <p className="text-gray-600">Agents actifs</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Link href="/dashboard/agents/new">
            <button className="btn btn-primary w-full">
              ➕ Nouvel Agent
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Rechercher par nom ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Chargement...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filteredAgents.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            Aucun agent trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Fonction
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {agent.prenom} {agent.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {agent.matricule || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {agent.email || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block">
                        {agent.fonction_id ? 'Assignée' : 'Non assignée'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/agents/${agent.id}`}>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Voir
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
