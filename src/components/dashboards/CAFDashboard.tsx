/**
 * CAF Dashboard
 * Finance Manager view - manage financial operations, budgets, salary management
 */

'use client';

import { useState, useEffect } from 'react';

interface CAFDashboardProps {
  userName: string;
}

export function CAFDashboard({ userName }: CAFDashboardProps) {
  const [stats, setStats] = useState({
    totalAgents: 0,
    pendingPayroll: 0,
    budgetItems: 0,
    financialDocuments: 0,
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
          pendingPayroll: requests.count || 0,
          budgetItems: 0,
          financialDocuments: 0,
        });
      } catch (error) {
        console.error('Failed to fetch CAF stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="container-main">
        {/* Hero Section */}
        <div className="rh-hero mb-8 bg-gradient-to-r from-green-600 to-emerald-600">
          <h1 className="rh-title text-white">💰 Tableau de Bord CAF - {userName}</h1>
          <p className="rh-sub text-green-100">
            Chef Administration Finances • Gestion budgétaire et paie
          </p>
          <div className="hero-tools">
            <a href="/dashboard/payroll" className="btn-rh main bg-white text-green-600 hover:bg-green-50">
              💵 Paie
            </a>
            <a href="/dashboard/budget" className="btn-rh main bg-white text-green-600 hover:bg-green-50">
              📊 Budget
            </a>
            <a href="/dashboard/documents" className="btn-rh main bg-white text-green-600 hover:bg-green-50">
              📄 Documents financiers
            </a>
          </div>
        </div>

        {/* Stats Grid - Finance Manager View */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Total Agents (for payroll) */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">👥 Agents à payer</p>
                  <div className="text-4xl font-bold text-green-600">
                    {loading ? '...' : stats.totalAgents}
                  </div>
                </div>
                <div className="text-3xl">💼</div>
              </div>
            </div>
          </div>

          {/* Pending Payroll */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-orange-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">💵 Paie en attente</p>
                  <div className="text-4xl font-bold text-orange-600">
                    {loading ? '...' : stats.pendingPayroll}
                  </div>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
          </div>

          {/* Budget Lines */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-blue-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📊 Lignes budgétaires</p>
                  <div className="text-4xl font-bold text-blue-600">
                    {loading ? '...' : stats.budgetItems}
                  </div>
                </div>
                <div className="text-3xl">📈</div>
              </div>
            </div>
          </div>

          {/* Financial Documents */}
          <div className="card hover:shadow-xl hover:scale-105 transition-all border-l-4 border-purple-500">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-grey-600 text-sm mb-2">📄 Documents financiers</p>
                  <div className="text-4xl font-bold text-purple-600">
                    {loading ? '...' : stats.financialDocuments}
                  </div>
                </div>
                <div className="text-3xl">💼</div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Financial Operations */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="card-header">💰 Gestion financière</div>
              <div className="card-body">
                <div className="grid md:grid-cols-3 gap-4">
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    💵 Paie
                  </a>
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    📊 Budget
                  </a>
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    🏦 Bonifications
                  </a>
                  <a href="/dashboard/agents" className="btn btn-primary w-full justify-center">
                    👥 Agents
                  </a>
                  <a href="/dashboard/documents" className="btn btn-primary w-full justify-center">
                    📄 Documents
                  </a>
                  <a href="/dashboard" className="btn btn-primary w-full justify-center">
                    📈 Rapports
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Finance Summary */}
          <div className="card">
            <div className="card-header">💳 Résumé financier</div>
            <div className="card-body space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-grey-500 text-xs">Rôle</p>
                <p className="text-grey-900 font-medium">CAF</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-grey-500 text-xs">En cours ce mois</p>
                <p className="text-orange-600 font-bold">Attente traitement</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-grey-500 text-xs">Exercice fiscal</p>
                <p className="text-blue-600 font-bold text-sm">2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Functions */}
        <div className="card">
          <div className="card-header">🔧 Fonctions principales</div>
          <div className="card-body">
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/dashboard" className="p-4 border-l-4 border-green-500 bg-green-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">💰 Paie</p>
                <p className="text-sm text-grey-500">Gestion de paie</p>
              </a>
              <a href="/dashboard" className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📊 Budget</p>
                <p className="text-sm text-grey-500">Lignes budgétaires</p>
              </a>
              <a href="/dashboard" className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">🏦 Boni/Avances</p>
                <p className="text-sm text-grey-500">Traitements spéciaux</p>
              </a>
              <a href="/dashboard/documents" className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded hover:shadow-md transition">
                <p className="font-semibold text-grey-900">📄 Documents</p>
                <p className="text-sm text-grey-500">Factures & reçus</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
