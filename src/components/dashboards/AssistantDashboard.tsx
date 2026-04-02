/**
 * Assistant Dashboard
 * Administrative Assistant view - support operations, scheduling, documentation
 */

'use client';

import { useState, useEffect } from 'react';

interface AssistantDashboardProps {
  userName: string;
}

export function AssistantDashboard({ userName }: AssistantDashboardProps) {
  const [stats, setStats] = useState({
    myTasks: 0,
    pendingItems: 0,
    documents: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [requests] = await Promise.all([
          fetch('/api/requests').then(r => r.json()).catch(() => ({ count: 0 })),
        ]);

        setStats({
          myTasks: 0,
          pendingItems: requests.count || 0,
          documents: 0,
          notifications: 0,
        });
      } catch (error) {
        console.error('Failed to fetch Assistant stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      <div className="container-main">
        {/* Hero Section */}
        <div className="rh-hero mb-8 bg-gradient-to-r from-cyan-600 to-blue-600">
          <h1 className="rh-title text-white">📋 Tableau de Bord Assistant - {userName}</h1>
          <p className="rh-sub text-cyan-100">
            Assistant RH • Support administratif et opérationnel
          </p>
          <div className="hero-tools">
            <a href="/dashboard/requests" className="btn-rh main bg-white text-cyan-600 hover:bg-cyan-50">
              ✓ Tâches à faire
            </a>
            <a href="/dashboard/documents" className="btn-rh main bg-white text-cyan-600 hover:bg-cyan-50">
              📄 Documents
            </a>
            <a href="/dashboard" className="btn-rh main bg-white text-cyan-600 hover:bg-cyan-50">
              📅 Calendrier
            </a>
          </div>
        </div>

        {/* Stats Grid - Assistant View */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* My Tasks */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-cyan-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">✓ Mes tâches</p>
                  <div className="text-4xl font-bold text-cyan-600">
                    {loading ? '...' : stats.myTasks}
                  </div>
                </div>
                <div className="text-3xl">📌</div>
              </div>
            </div>
          </div>

          {/* Pending Items */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-yellow-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">⏳ Éléments en attente</p>
                  <div className="text-4xl font-bold text-yellow-600">
                    {loading ? '...' : stats.pendingItems}
                  </div>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📄 Documents</p>
                  <div className="text-4xl font-bold text-green-600">
                    {loading ? '...' : stats.documents}
                  </div>
                </div>
                <div className="text-3xl">📁</div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-purple-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">🔔 Notifications</p>
                  <div className="text-4xl font-bold text-purple-600">
                    {loading ? '...' : stats.notifications}
                  </div>
                </div>
                <div className="text-3xl">🔔</div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Quick Actions */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="card-header">⚡ Actions rapides</div>
              <div className="card-body">
                <div className="grid md:grid-cols-3 gap-4">
                  <a href="/dashboard/requests" className="btn btn-primary w-full justify-center">
                    ✓ Tâches
                  </a>
                  <a href="/dashboard/documents" className="btn btn-primary w-full justify-center">
                    📄 Documents
                  </a>
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    📅 Calendrier
                  </a>
                  <a href="/dashboard/agents" className="btn btn-primary w-full justify-center">
                    👥 Annuaire
                  </a>
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    📬 Correspondances
                  </a>
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    📊 Rapports
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="card">
            <div className="card-header">📆 Aujourd&apos;hui</div>
            <div className="card-body space-y-3">
              <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                <p className="text-grey-500 text-xs">Rôle</p>
                <p className="text-grey-900 font-medium">Assistant RH</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-grey-500 text-xs">Priorité</p>
                <p className="text-yellow-600 font-bold">Actions urgentes</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-grey-500 text-xs">Statut</p>
                <p className="text-green-600 font-bold text-sm">✓ Opérationnel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Functions */}
        <div className="card">
          <div className="card-header">🔧 Fonctions principales</div>
          <div className="card-body">
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/dashboard/requests" className="p-4 border-l-4 border-cyan-500 bg-cyan-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">✓ Tâches</p>
                <p className="text-sm text-grey-500">Gestion des tâches</p>
              </a>
              <a href="/dashboard/documents" className="p-4 border-l-4 border-green-500 bg-green-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📄 Documents</p>
                <p className="text-sm text-grey-500">Archivage & classement</p>
              </a>
              <a href="/dashboard/agents" className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">👥 Annuaire</p>
                <p className="text-sm text-grey-500">Coordonnées agents</p>
              </a>
              <a href="/dashboard" className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📅 Calendrier</p>
                <p className="text-sm text-grey-500">Planification</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
