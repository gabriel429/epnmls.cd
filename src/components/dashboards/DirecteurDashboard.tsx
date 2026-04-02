/**
 * Directeur Dashboard
 * Director view - oversee department operations, manage teams, track performance
 */

'use client';

import { useState, useEffect } from 'react';

interface DirecteurDashboardProps {
  userName: string;
  departmentName?: string;
}

export function DirecteurDashboard({ userName, departmentName }: DirecteurDashboardProps) {
  const [stats, setStats] = useState({
    teamAgents: 0,
    pendingRequests: 0,
    teamPointages: 0,
    departmentDocuments: 0,
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
          teamAgents: agents.count || 0,
          pendingRequests: requests.count || 0,
          teamPointages: 0,
          departmentDocuments: 0,
        });
      } catch (error) {
        console.error('Failed to fetch Directeur stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      <div className="container-main">
        {/* Hero Section */}
        <div className="rh-hero mb-8 bg-gradient-to-r from-amber-600 to-orange-600">
          <h1 className="rh-title text-white">🏛️ Tableau de Bord Directeur - {userName}</h1>
          <p className="rh-sub text-amber-100">
            {departmentName ? `Département: ${departmentName}` : 'Gestion de département'} • Suivi des performances
          </p>
          <div className="hero-tools">
            <a href="/dashboard/agents" className="btn-rh main bg-white text-amber-600 hover:bg-amber-50">
              👥 Mon équipe
            </a>
            <a href="/dashboard/pointages" className="btn-rh main bg-white text-amber-600 hover:bg-amber-50">
              ⏰ Pointages équipe
            </a>
            <a href="/dashboard/requests" className="btn-rh main bg-white text-amber-600 hover:bg-amber-50">
              📋 Demandes
            </a>
          </div>
        </div>

        {/* Stats Grid - Director View */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Team Agents */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-amber-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">👥 Agents de l&apos;équipe</p>
                  <div className="text-4xl font-bold text-amber-600">
                    {loading ? '...' : stats.teamAgents}
                  </div>
                </div>
                <div className="text-3xl">👨‍💼</div>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-red-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📋 Demandes en attente</p>
                  <div className="text-4xl font-bold text-red-600">
                    {loading ? '...' : stats.pendingRequests}
                  </div>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
          </div>

          {/* Team Pointages */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-blue-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📊 Pointages mois</p>
                  <div className="text-4xl font-bold text-blue-600">
                    {loading ? '...' : stats.teamPointages}
                  </div>
                </div>
                <div className="text-3xl">📈</div>
              </div>
            </div>
          </div>

          {/* Department Documents */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📄 Documents dept.</p>
                  <div className="text-4xl font-bold text-green-600">
                    {loading ? '...' : stats.departmentDocuments}
                  </div>
                </div>
                <div className="text-3xl">📁</div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Team Management */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="card-header">👥 Gestion de l&apos;équipe</div>
              <div className="card-body">
                <div className="grid md:grid-cols-3 gap-4">
                  <a href="/dashboard/agents" className="btn btn-primary w-full justify-center">
                    👥 Voir équipe
                  </a>
                  <a href="/dashboard/pointages" className="btn btn-primary w-full justify-center">
                    ⏰ Pointages
                  </a>
                  <a href="/dashboard/requests" className="btn btn-primary w-full justify-center">
                    ✓ Demandes
                  </a>
                  <a href="/dashboard/documents" className="btn btn-primary w-full justify-center">
                    📄 Documents
                  </a>
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    📊 Rapports
                  </a>
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    🎯 Affectations
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Department Info */}
          <div className="card">
            <div className="card-header">🏛️ Mon département</div>
            <div className="card-body space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-grey-500 text-xs">Rôle</p>
                <p className="text-grey-900 font-medium">Directeur</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-grey-500 text-xs">Département</p>
                <p className="text-grey-900 font-medium text-sm">{departmentName || 'N/A'}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-grey-500 text-xs">Statut</p>
                <p className="text-green-600 font-bold text-sm">✓ Actif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Functions */}
        <div className="card">
          <div className="card-header">🔧 Fonctions principales</div>
          <div className="card-body">
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/dashboard/agents" className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">👥 Équipe</p>
                <p className="text-sm text-grey-500">Gestion équipe</p>
              </a>
              <a href="/dashboard/requests" className="p-4 border-l-4 border-red-500 bg-red-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📋 Demandes</p>
                <p className="text-sm text-grey-500">Approuver/rejeter</p>
              </a>
              <a href="/dashboard/pointages" className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📊 Pointages</p>
                <p className="text-sm text-grey-500">Suivi présences</p>
              </a>
              <a href="/dashboard/documents" className="p-4 border-l-4 border-green-500 bg-green-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📄 Documents</p>
                <p className="text-sm text-grey-500">GED département</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
