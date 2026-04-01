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
    <main className="min-h-screen bg-gray-50">
      <div className="container-main">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user.name || user.email}! 👋
          </h1>
          <p className="text-gray-600 mb-8">
            Voici votre tableau de bord E-PNMLS
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-blue-600">42</div>
              <p className="text-gray-600 text-sm">Agents</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-green-600">8</div>
              <p className="text-gray-600 text-sm">Demandes en attente</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-orange-600">15</div>
              <p className="text-gray-600 text-sm">Tâches assignées</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-purple-600">3</div>
              <p className="text-gray-600 text-sm">Notifications</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📋 Actions Rapides</h2>
              <div className="space-y-2">
                <button className="w-full btn btn-primary text-left">
                  ➕ Ajouter un Agent
                </button>
                <button className="w-full btn btn-secondary text-left">
                  📄 Voir les Demandes
                </button>
                <button className="w-full btn btn-secondary text-left">
                  🎯 Mes Tâches
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📊 État du Système</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Supabase</span>
                  <span className="text-green-600 font-medium">✓ Connecté</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base de Données</span>
                  <span className="text-green-600 font-medium">✓ Opérationnel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auth</span>
                  <span className="text-green-600 font-medium">✓ JWT Valide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
