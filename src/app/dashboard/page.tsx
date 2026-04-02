'use client';

import { useUserRole } from '@/hooks/useUserRole';
import { AgentDashboard } from '@/components/dashboards/AgentDashboard';
import { ChefRHDashboard } from '@/components/dashboards/ChefRHDashboard';
import { DirecteurDashboard } from '@/components/dashboards/DirecteurDashboard';
import { CAFDashboard } from '@/components/dashboards/CAFDashboard';
import { AssistantDashboard } from '@/components/dashboards/AssistantDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useUserRole();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-grey-600">Chargement du tableau de bord...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    redirect('/auth/login');
  }

  // Route to appropriate dashboard based on user role
  const roleName = user.role?.name;

  // Agent dashboard
  if (roleName === 'Agent') {
    return <AgentDashboard agentName={user.name} agentEmail={user.email} />;
  }

  // Chef RH dashboard
  if (roleName === 'Chef RH') {
    return <ChefRHDashboard userName={user.name} />;
  }

  // Director dashboard
  if (roleName === 'Directeur') {
    return <DirecteurDashboard userName={user.name} departmentName={user.agent?.fonction_id ? 'Département' : undefined} />;
  }

  // Finance Manager dashboard
  if (roleName === 'CAF') {
    return <CAFDashboard userName={user.name} />;
  }

  // Administrative Assistant dashboard
  if (roleName === 'Assistant') {
    return <AssistantDashboard userName={user.name} />;
  }

  // Admin/Super Admin dashboard
  if (roleName === 'Super Admin' || roleName === 'SEP' || roleName === 'SEN') {
    return <AdminDashboard userName={user.name} adminRole={roleName} />;
  }

  // Default fallback if role is not recognized
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="text-6xl mb-4">❓</div>
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Rôle non reconnu</h1>
        <p className="text-grey-600 mb-6">Impossible de déterminer votre tableau de bord</p>
        <p className="text-sm text-grey-500">Rôle: {roleName || 'Aucun'}</p>
        <a href="/auth/login" className="mt-6 inline-block btn btn-primary">
          Retour à la connexion
        </a>
      </div>
    </main>
  );
}
