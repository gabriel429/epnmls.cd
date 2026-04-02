'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="card shadow-lg">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center rounded-t-lg">
            <h1 className="text-4xl font-bold mb-2">E-PNMLS</h1>
            <p className="text-blue-100 text-sm">Portail de Gestion RH Moderne</p>
          </div>

          <div className="card-body">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="alert alert-danger">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="form-label">📧 Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="form-control w-full"
                  required
                />
              </div>

              <div>
                <label className="form-label">🔐 Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-control w-full"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center text-lg"
              >
                {loading ? '⏳ Connexion en cours...' : '🔓 Se Connecter'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-grey-600">
              Pas de compte?{' '}
              <a href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                S&apos;inscrire
              </a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="text-primary-600 font-bold">
            <div className="text-2xl mb-1">⚡</div>
            <div>Rapide</div>
          </div>
          <div className="text-primary-600 font-bold">
            <div className="text-2xl mb-1">🔐</div>
            <div>Sécurisé</div>
          </div>
          <div className="text-primary-600 font-bold">
            <div className="text-2xl mb-1">📊</div>
            <div>Moderne</div>
          </div>
        </div>
      </div>
    </main>
  );
}
