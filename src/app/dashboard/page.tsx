'use client';

import { useUser } from '@/hooks/useUser';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';

interface DashboardStats {
  agents: number;
  requests: number;
  tasks: number;
  notifications: number;
}

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    agents: 0,
    requests: 0,
    tasks: 0,
    notifications: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-grey-600">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container-main">
        {/* Hero Section */}
        <div className="rh-hero mb-8">
          <h1 className="rh-title">👋 Bienvenue, {user.name || user.email}!</h1>
          <p className="rh-sub">Tableau de bord E-PNMLS - Bienvenue dans votre espace de travail</p>
          <div className="hero-tools">
            <a href="/rh/agents" className="btn-rh main">
              ➕ Nouvel agent
            </a>
            <a href="/requests" className="btn-rh main">
              📋 Demandes
            </a>
            <a href="/pointages" className="btn-rh main">
              ⏰ Pointages
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Agents Card */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">👥 Agents</p>
                  <div className="text-4xl font-bold text-primary-600">
                    {statsLoading ? '...' : stats.agents}
                  </div>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">⏳ Demandes en attente</p>
                  <div className="text-4xl font-bold text-yellow-600">
                    {statsLoading ? '...' : stats.requests}
                  </div>
                </div>
                <div className="text-3xl">📋</div>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">🎯 Tâches assignées</p>
                  <div className="text-4xl font-bold text-orange-600">
                    {statsLoading ? '...' : stats.tasks}
                  </div>
                </div>
                <div className="text-3xl">✔️</div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">🔔 Notifications</p>
                  <div className="text-4xl font-bold text-purple-600">
                    {statsLoading ? '...' : stats.notifications}
                  </div>
                </div>
                <div className="text-3xl">🔴</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Quick Actions */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="card-header">📋 Actions Rapides</div>
              <div className="card-body">
                <div className="grid md:grid-cols-2 gap-4">
                  <a href="/rh/agents" className="btn btn-primary w-full justify-center">
                    ➕ Ajouter un Agent
                  </a>
                  <a href="/requests" className="btn btn-primary w-full justify-center">
                    📄 Voir les Demandes
                  </a>
                  <a href="/pointages" className="btn btn-primary w-full justify-center">
                    ⏰ Pointages
                  </a>
                  <a href="/documents" className="btn btn-primary w-full justify-center">
                    📊 Documents
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <div className="card-header">📊 État du Système</div>
            <div className="card-body space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-grey-700 font-medium">🗄️ Supabase</span>
                <span className="text-green-600 font-bold text-sm">✓ Connecté</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-grey-700 font-medium">💾 Base de Données</span>
                <span className="text-green-600 font-bold text-sm">✓ OK</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-grey-700 font-medium">🔐 Auth</span>
                <span className="text-green-600 font-bold text-sm">✓ JWT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">📝 Activité Récente</div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-grey-50 rounded-lg border-l-4 border-primary-500">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-grey-900">Agent créé</p>
                  <p className="text-sm text-grey-500">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-grey-50 rounded-lg border-l-4 border-blue-500">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold text-grey-900">Demande approuvée</p>
                  <p className="text-sm text-grey-500">Il y a 4 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-grey-50 rounded-lg border-l-4 border-green-500">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-grey-900">Tâche complétée</p>
                  <p className="text-sm text-grey-500">Il y a 1 jour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
