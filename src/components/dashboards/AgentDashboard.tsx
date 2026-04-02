/**
 * Agent Dashboard
 * Standard HR agent view - access to personal profile, requests, documents
 */

'use client';

import { useState, useEffect } from 'react';

interface AgentDashboardProps {
  agentName: string;
  agentEmail: string;
}

export function AgentDashboard({ agentName, agentEmail }: AgentDashboardProps) {
  const [stats, setStats] = useState({
    myRequests: 0,
    myDocuments: 0,
    myPointages: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [requests, rac1, rac2] = await Promise.all([
          fetch('/api/requests').then(r => r.json()),
          fetch('/api/documents').then(r => r.json()).catch(() => ({ count: 0 })),
          fetch('/api/pointages').then(r => r.json()).catch(() => ({ count: 0 })),
        ]);

        setStats({
          myRequests: requests.count || 0,
          myDocuments: rac1.count || 0,
          myPointages: rac2.count || 0,
          notifications: 0,
        });
      } catch (error) {
        console.error('Failed to fetch agent stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container-main">
        {/* Hero Section */}
        <div className="rh-hero mb-8">
          <h1 className="rh-title">👋 Bienvenue, {agentName}!</h1>
          <p className="rh-sub">Votre espace personnel - Gérez vos demandes et documents</p>
          <div className="hero-tools">
            <a href="/requests" className="btn-rh main">
              ➕ Nouvelle demande
            </a>
            <a href="/documents" className="btn-rh main">
              📄 Mes documents
            </a>
            <a href="/pointages" className="btn-rh main">
              ⏰ Mon pointage
            </a>
          </div>
        </div>

        {/* Stats Grid - Agent View */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* My Requests */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📋 Mes demandes</p>
                  <div className="text-4xl font-bold text-blue-600">
                    {loading ? '...' : stats.myRequests}
                  </div>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </div>
          </div>

          {/* My Documents */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📄 Mes documents</p>
                  <div className="text-4xl font-bold text-green-600">
                    {loading ? '...' : stats.myDocuments}
                  </div>
                </div>
                <div className="text-3xl">🗂️</div>
              </div>
            </div>
          </div>

          {/* My Pointages */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">⏰ Pointages</p>
                  <div className="text-4xl font-bold text-orange-600">
                    {loading ? '...' : stats.myPointages}
                  </div>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">🔔 Notifications</p>
                  <div className="text-4xl font-bold text-purple-600">0</div>
                </div>
                <div className="text-3xl">🔔</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Quick Actions */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="card-header">⚡ Actions Rapides</div>
              <div className="card-body">
                <div className="grid md:grid-cols-2 gap-4">
                  <a href="/requests" className="btn btn-primary w-full justify-center">
                    ➕ Faire une demande
                  </a>
                  <a href="/documents" className="btn btn-primary w-full justify-center">
                    📤 Télécharger document
                  </a>
                  <a href="/pointages" className="btn btn-primary w-full justify-center">
                    ✓ Confirmer pointage
                  </a>
                  <a href="/profile" className="btn btn-primary w-full justify-center">
                    👤 Mon profil
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="card">
            <div className="card-header">👤 Mes Infos</div>
            <div className="card-body space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-grey-500 text-xs">Nom</p>
                <p className="text-grey-900 font-medium">{agentName}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-grey-500 text-xs">Email</p>
                <p className="text-grey-900 font-medium text-sm">{agentEmail}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-grey-500 text-xs">Status</p>
                <p className="text-green-600 font-bold text-sm">✓ Actif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="card">
          <div className="card-header">📚 Ressources Utiles</div>
          <div className="card-body">
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/documents" className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📄 Documents</p>
                <p className="text-sm text-grey-500">Accédez à vos documents</p>
              </a>
              <a href="/requests" className="p-4 border-l-4 border-green-500 bg-green-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">✉️ Demandes</p>
                <p className="text-sm text-grey-500">Gérez vos demandes</p>
              </a>
              <a href="/pointages" className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">⏱️ Pointages</p>
                <p className="text-sm text-grey-500">Vérifiez vos heures</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
