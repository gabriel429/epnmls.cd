/**
 * Admin Dashboard
 * System Administrator view - manage system, users, configurations, monitoring
 * Used by: Super Admin, SEP (Service d'Efficacité Professionnelle), SEN (Service d'Évaluation Numérique)
 */

'use client';

import { useState, useEffect } from 'react';

interface AdminDashboardProps {
  userName: string;
  adminRole?: string;
}

export function AdminDashboard({ userName, adminRole = 'Super Admin' }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    systemHealth: 100,
    activeRequests: 0,
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
          totalUsers: 9, // From seed data
          totalAgents: agents.count || 0,
          systemHealth: 98,
          activeRequests: requests.count || 0,
        });
      } catch (error) {
        console.error('Failed to fetch Admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container-main">
        {/* Hero Section */}
        <div className="rh-hero mb-8 bg-gradient-to-r from-red-600 to-rose-600">
          <h1 className="rh-title text-white">⚙️ Tableau de Bord Admin - {userName}</h1>
          <p className="rh-sub text-red-100">
            {adminRole} • Administration système et configuration
          </p>
          <div className="hero-tools">
            <a href="/admin/users" className="btn-rh main bg-white text-red-600 hover:bg-red-50">
              👥 Utilisateurs
            </a>
            <a href="/admin/roles" className="btn-rh main bg-white text-red-600 hover:bg-red-50">
              🔐 Rôles & Permissions
            </a>
            <a href="/admin/settings" className="btn-rh main bg-white text-red-600 hover:bg-red-50">
              ⚙️ Paramètres système
            </a>
          </div>
        </div>

        {/* Stats Grid - Admin View */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Total Users */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-red-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">👤 Utilisateurs</p>
                  <div className="text-4xl font-bold text-red-600">
                    {loading ? '...' : stats.totalUsers}
                  </div>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
          </div>

          {/* Total Agents */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-orange-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">💼 Agents actifs</p>
                  <div className="text-4xl font-bold text-orange-600">
                    {loading ? '...' : stats.totalAgents}
                  </div>
                </div>
                <div className="text-3xl">👨‍💼</div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">💚 Système santé</p>
                  <div className="text-4xl font-bold text-green-600">
                    {loading ? '...' : stats.systemHealth}%
                  </div>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
          </div>

          {/* Active Requests */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-blue-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">⚡ Requêtes actives</p>
                  <div className="text-4xl font-bold text-blue-600">
                    {loading ? '...' : stats.activeRequests}
                  </div>
                </div>
                <div className="text-3xl">📡</div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* System Administration */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="card-header">🔧 Administration système</div>
              <div className="card-body">
                <div className="grid md:grid-cols-3 gap-4">
                  <a href="/admin/users" className="btn btn-primary w-full justify-center">
                    👤 Utilisateurs
                  </a>
                  <a href="/admin/roles" className="btn btn-primary w-full justify-center">
                    🔐 Rôles
                  </a>
                  <a href="/admin/permissions" className="btn btn-primary w-full justify-center">
                    🔑 Permissions
                  </a>
                  <a href="/admin/audit" className="btn btn-primary w-full justify-center">
                    📋 Audit logs
                  </a>
                  <a href="/admin/settings" className="btn btn-primary w-full justify-center">
                    ⚙️ Configuration
                  </a>
                  <a href="/admin/monitoring" className="btn btn-primary w-full justify-center">
                    📊 Monitoring
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="card">
            <div className="card-header">📊 Statut système</div>
            <div className="card-body space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-grey-500 text-xs">Rôle</p>
                <p className="text-grey-900 font-medium">{adminRole}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-grey-500 text-xs">Santé système</p>
                <p className="text-green-600 font-bold">✓ Optimal</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-grey-500 text-xs">Version</p>
                <p className="text-blue-600 font-bold text-sm">1.0.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Functions */}
        <div className="card">
          <div className="card-header">🔧 Fonctions principales</div>
          <div className="card-body">
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/admin/users" className="p-4 border-l-4 border-red-500 bg-red-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">👤 Utilisateurs</p>
                <p className="text-sm text-grey-500">CRUD utilisateurs</p>
              </a>
              <a href="/admin/roles" className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">🔐 Rôles</p>
                <p className="text-sm text-grey-500">Gestion des rôles</p>
              </a>
              <a href="/admin/audit" className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📋 Audit</p>
                <p className="text-sm text-grey-500">Journaux système</p>
              </a>
              <a href="/admin/settings" className="p-4 border-l-4 border-green-500 bg-green-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">⚙️ Configuration</p>
                <p className="text-sm text-grey-500">Paramétrages système</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
