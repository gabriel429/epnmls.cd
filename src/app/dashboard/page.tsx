'use client';

import { useUser } from '@/hooks/useUser';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-main">
        <div className="py-8">
          {/* Header with Greeting */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Bienvenue, {user.name || user.email}! 👋
            </h1>
            <p className="text-gray-600">Voici votre tableau de bord E-PNMLS</p>
          </div>

          {/* Stats Cards with Gradients */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Agents</p>
                  <div className="text-4xl font-bold text-blue-600">42</div>
                </div>
                <span className="text-3xl">👥</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Demandes en attente</p>
                  <div className="text-4xl font-bold text-green-600">8</div>
                </div>
                <span className="text-3xl">⏳</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Tâches assignées</p>
                  <div className="text-4xl font-bold text-orange-600">15</div>
                </div>
                <span className="text-3xl">🎯</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Notifications</p>
                  <div className="text-4xl font-bold text-purple-600">3</div>
                </div>
                <span className="text-3xl">🔔</span>
              </div>
            </div>
          </div>

          {/* Actions and Status */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📋</span> Actions Rapides
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:scale-105 transform duration-150 flex items-center justify-center gap-2">
                  <span>➕</span> Ajouter un Agent
                </button>
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:scale-105 transform duration-150 flex items-center justify-center gap-2">
                  <span>📄</span> Voir les Demandes
                </button>
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:scale-105 transform duration-150 flex items-center justify-center gap-2">
                  <span>🎯</span> Mes Tâches
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📊</span> État du Système
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🗄️</span>
                    <span className="text-gray-700 font-medium">Supabase</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 font-medium text-sm rounded-full">✓ Connecté</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💾</span>
                    <span className="text-gray-700 font-medium">Base de Données</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 font-medium text-sm rounded-full">✓ Opérationnel</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔐</span>
                    <span className="text-gray-700 font-medium">Auth</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 font-medium text-sm rounded-full">✓ JWT Valide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
