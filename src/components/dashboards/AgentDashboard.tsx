/**
 * Agent Dashboard
 * Standard HR agent view - matches original design
 * Hero card with embedded stats + quick actions grid
 */

'use client';

import { useState, useEffect } from 'react';

interface AgentDashboardProps {
  agentName: string;
}

export function AgentDashboard({ agentName }: AgentDashboardProps) {
  const [stats, setStats] = useState({
    documents: 0,
    messages: 0,
    communiques: 0,
    enAttente: 0,
    approuvees: 0,
    absences: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [requests] = await Promise.all([
          fetch('/api/requests').then(r => r.json()).catch(() => ({ count: 0 })),
        ]);

        setStats({
          documents: 0,
          messages: 0,
          communiques: 0,
          enAttente: requests.count || 0,
          approuvees: 0,
          absences: 0,
        });
      } catch (error) {
        console.error('Failed to fetch agent stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-grey-50">
      <div className="container-main">
        {/* Hero Card - Main Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              {/* Left: User Info */}
              <div className="flex items-start gap-6 flex-1">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
                  👤
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">Bienvenue(e), {agentName}</h1>
                  <p className="text-blue-100 text-lg mb-2">Agent RH</p>
                  <p className="text-blue-100 capitalize">{dateStr}</p>
                </div>
              </div>

              {/* Right: Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:w-auto">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {loading ? '...' : stats.documents}
                  </div>
                  <p className="text-blue-100 text-sm uppercase tracking-wide">Documents</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {loading ? '...' : stats.messages}
                  </div>
                  <p className="text-blue-100 text-sm uppercase tracking-wide">Messages</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {loading ? '...' : stats.communiques}
                  </div>
                  <p className="text-blue-100 text-sm uppercase tracking-wide">Communiques</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {loading ? '...' : stats.enAttente}
                  </div>
                  <p className="text-blue-100 text-sm uppercase tracking-wide">En attente</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {loading ? '...' : stats.approuvees}
                  </div>
                  <p className="text-blue-100 text-sm uppercase tracking-wide">Approuvées</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {loading ? '...' : stats.absences}
                  </div>
                  <p className="text-blue-100 text-sm uppercase tracking-wide">Absences</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center gap-2">
            ⚡ Actions rapides
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Nouvelle Demande */}
            <a href="/requests" className="bg-white p-6 rounded-lg border border-grey-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  📝
                </div>
                <div>
                  <h3 className="font-bold text-grey-900 text-lg">Nouvelle demande</h3>
                  <p className="text-grey-500 text-sm">Congé, attestation...</p>
                </div>
              </div>
            </a>

            {/* Uploader Document */}
            <a href="/documents" className="bg-white p-6 rounded-lg border border-grey-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  📤
                </div>
                <div>
                  <h3 className="font-bold text-grey-900 text-lg">Uploader document</h3>
                  <p className="text-grey-500 text-sm">Ajouter un fichier</p>
                </div>
              </div>
            </a>

            {/* Planning congés */}
            <a href="/pointages" className="bg-white p-6 rounded-lg border border-grey-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  📅
                </div>
                <div>
                  <h3 className="font-bold text-grey-900 text-lg">Planning congés</h3>
                  <p className="text-grey-500 text-sm">Congés de ma structure</p>
                </div>
              </div>
            </a>

            {/* Documents de travail */}
            <a href="/documents" className="bg-white p-6 rounded-lg border border-grey-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  📄
                </div>
                <div>
                  <h3 className="font-bold text-grey-900 text-lg">Documents de travail</h3>
                  <p className="text-grey-500 text-sm">Consulter les documents</p>
                </div>
              </div>
            </a>

            {/* Plan de travail */}
            <a href="/pointages" className="bg-white p-6 rounded-lg border border-grey-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  📋
                </div>
                <div>
                  <h3 className="font-bold text-grey-900 text-lg">Plan de travail</h3>
                  <p className="text-grey-500 text-sm">Consulter ou créer</p>
                </div>
              </div>
            </a>

            {/* Mon profil */}
            <a href="/profile" className="bg-white p-6 rounded-lg border border-grey-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  👤
                </div>
                <div>
                  <h3 className="font-bold text-grey-900 text-lg">Mon profil</h3>
                  <p className="text-grey-500 text-sm">Voir mes infos</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Mes statistiques section (placeholder for future expansion) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center gap-2">
            📊 Mes statistiques
          </h2>
          <div className="bg-white rounded-lg p-8 border border-grey-200">
            <p className="text-grey-500">Vos statistiques détaillées apparaîtront ici...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
