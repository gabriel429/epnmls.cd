'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';

export function Navbar() {
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar-main flex items-center justify-between h-20 px-6">
      {/* Brand */}
      <a href="/dashboard" className="navbar-brand flex items-center gap-2">
        <div className="brand-text">
          <div className="brand-title">E-PNMLS</div>
          <div className="brand-sub">HR Portal</div>
        </div>
      </a>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-2">
        <a href="/dashboard" className="nav-link">📊 Tableau de bord</a>
        <a href="/dashboard" className="nav-link">👥 Agents</a>
        <a href="/dashboard" className="nav-link">📋 Demandes</a>
        <a href="/dashboard" className="nav-link">⏰ Pointages</a>
        <a href="/dashboard" className="nav-link">📄 Documents</a>
      </div>

      {/* User Menu */}
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/20">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-white text-sm font-medium hidden lg:inline max-w-[140px] truncate">
            {user.name}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
