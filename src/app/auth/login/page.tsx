'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    <main className="min-h-screen flex">
      {/* Left Side - Blue Gradient with PNMLS Info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-800"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-sm">
          {/* Building Image Circle */}
          <div className="w-48 h-48 rounded-full bg-white bg-opacity-15 border-4 border-white border-opacity-30 flex items-center justify-center mx-auto mb-8 overflow-hidden">
            <div className="text-6xl">🏢</div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-2">PNMLS</h1>

          {/* Subtitle */}
          <div className="text-blue-100 text-lg mb-2">
            Programme National Multisectoriel
          </div>
          <div className="text-blue-100 text-lg mb-6">
            de Lutte contre le Sida
          </div>

          {/* Divider */}
          <div className="h-1 w-16 bg-white bg-opacity-50 mx-auto mb-6"></div>

          {/* Description */}
          <p className="text-blue-50 text-sm uppercase tracking-widest">
            Système de Gestion des Ressources Humaines
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 bg-grey-50 flex flex-col items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Login Icon and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl">🔐</span>
            </div>

            <h2 className="text-3xl font-bold text-grey-900 mb-2">Connexion</h2>
            <p className="text-grey-500">Accédez à votre espace personnel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <span className="text-xl">⚠️</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-grey-700 mb-2">
                📧 Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.cd"
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-grey-700 mb-2">
                🔑 Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-grey-600">
                Se souvenir de moi
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Connexion en cours...' : '🔓 Se connecter'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-grey-600">
            Pas de compte?{' '}
            <a href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              S&apos;inscrire
            </a>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-grey-200 text-center text-xs text-grey-500">
            🔒 PNMLS - Portail RH
          </div>
        </div>
      </div>
    </main>
  );
}
