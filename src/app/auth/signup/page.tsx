'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !name) {
      setError('Tous les champs sont requis');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (signupError) {
        setError(signupError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login?registered=true');
        }, 2000);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          <div className="card shadow-lg text-center">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white rounded-t-lg">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold">Inscription réussie!</h2>
            </div>
            <div className="card-body">
              <p className="text-grey-600 mb-2">
                Un email de confirmation a été envoyé à <strong>{email}</strong>
              </p>
              <p className="text-grey-500 text-sm">Redirection vers la connexion...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="card shadow-lg">
          {/* Header with gradient  */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center rounded-t-lg">
            <h1 className="text-4xl font-bold mb-2">E-PNMLS</h1>
            <p className="text-blue-100 text-sm">Créer un nouveau compte</p>
          </div>

          <div className="card-body">
            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <div className="alert alert-danger">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="form-label">👤 Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="form-control w-full"
                  required
                />
              </div>

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
                <p className="text-xs text-grey-500 mt-1">Au moins 6 caractères</p>
              </div>

              <div>
                <label className="form-label">🔐 Confirmer mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? '⏳ Inscription en cours...' : '✍️ S&apos;inscrire'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-grey-600">
              Vous avez déjà un compte?{' '}
              <a href="/auth/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Se connecter
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
