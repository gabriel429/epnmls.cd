/**
 * Chef RH Dashboard
 * HR Manager view - manage agents, approve requests, manage documents
 */

'use client';

import { useState, useEffect } from 'react';

interface ChefRHDashboardProps {
  userName: string;
}

export function ChefRHDashboard({ userName }: ChefRHDashboardProps) {
  const [stats, setStats] = useState({
    totalAgents: 0,
    pendingRequests: 0,
    pendingDocuments: 0,
    departmentAgents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [agents, requests] = await Promise.all([
          fetch('/api/agents').then(r => r.json()),
          fetch('/api/requests').then(r => r.json()),
        ]);

        setStats({
          totalAgents: agents.count || 0,
          pendingRequests: requests.count || 0,
          pendingDocuments: 0,
          departmentAgents: agents.count ? Math.floor(agents.count * 0.7) : 0,
        });
      } catch (error) {
        console.error('Failed to fetch RH stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container-main">
        {/* Hero Section */}
        <div className="rh-hero mb-8 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h1 className="rh-title text-white">🎯 Tableau de Bord RH - {userName}</h1>
          <p className="rh-sub text-purple-100">
            Gestion des ressources humaines - Agents, demandes, documents
          </p>
          <div className="hero-tools">
            <a href="/rh/agents" className="btn-rh main bg-white text-purple-600 hover:bg-purple-50">
              ➕ Nouvel agent
            </a>
            <a href="/requests" className="btn-rh main bg-white text-purple-600 hover:bg-purple-50">
              📋 Demandes à approuver
            </a>
            <a href="/documents" className="btn-rh main bg-white text-purple-600 hover:bg-purple-50">
              📄 Gérer documents
            </a>
          </div>
        </div>

        {/* Stats Grid - HR Manager View */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Total Agents */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-purple-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">👥 Agents (Total)</p>
                  <div className="text-4xl font-bold text-purple-600">
                    {loading ? '...' : stats.totalAgents}
                  </div>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-red-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">⏳ Demandes en attente</p>
                  <div className="text-4xl font-bold text-red-600">
                    {loading ? '...' : stats.pendingRequests}
                  </div>
                </div>
                <div className="text-3xl">📋</div>
              </div>
            </div>
          </div>

          {/* Department Agents */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-blue-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">🏢 Agents du départ.</p>
                  <div className="text-4xl font-bold text-blue-600">
                    {loading ? '...' : stats.departmentAgents}
                  </div>
                </div>
                <div className="text-3xl">🏛️</div>
              </div>
            </div>
          </div>

          {/* Documents to Review */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📄 Documents à vérifier</p>
                  <div className="text-4xl font-bold text-green-600">
                    {loading ? '...' : stats.pendingDocuments}
                  </div>
                </div>
                <div className="text-3xl">🔍</div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Management Controls */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="card-header">⚙️ Gestion RH</div>
              <div className="card-body">
                <div className="grid md:grid-cols-3 gap-4">
                  <a href="/rh/agents" className="btn btn-primary w-full justify-center">
                    👥 Gérer agents
                  </a>
                  <a href="/requests" className="btn btn-primary w-full justify-center">
                    ✓ Approuver demandes
                  </a>
                  <a href="/documents" className="btn btn-primary w-full justify-center">
                    📄 Documents
                  </a>
                  <a href="/pointages" className="btn btn-primary w-full justify-center">
                    ⏱️ Pointages
                  </a>
                  <a href="/holidays" className="btn btn-primary w-full justify-center">
                    🏖️ Congés
                  </a>
                  <a href="/reports" className="btn btn-primary w-full justify-center">
                    📊 Rapports
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="card">
            <div className="card-header">📈 Résumé</div>
            <div className="card-body space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-grey-500 text-xs">Role</p>
                <p className="text-grey-900 font-medium">Chef RH</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-grey-500 text-xs">Actions urgentes</p>
                <p className="text-red-600 font-bold">{loading ? '...' : stats.pendingRequests} demandes</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-grey-500 text-xs">Agents actifs</p>
                <p className="text-green-600 font-bold">{loading ? '...' : stats.totalAgents}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Functions */}
        <div className="card">
          <div className="card-header">🔧 Fonctions principales</div>
          <div className="card-body">
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/rh/agents" className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">👥 Agents</p>
                <p className="text-sm text-grey-500">CRUD agents</p>
              </a>
              <a href="/requests" className="p-4 border-l-4 border-red-500 bg-red-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📋 Demandes</p>
                <p className="text-sm text-grey-500">Approuver/rejeter</p>
              </a>
              <a href="/documents" className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📄 Documents</p>
                <p className="text-sm text-grey-500">GED</p>
              </a>
              <a href="/pointages" className="p-4 border-l-4 border-green-500 bg-green-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">⏱️ Pointages</p>
                <p className="text-sm text-grey-500">Suivi présences</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
