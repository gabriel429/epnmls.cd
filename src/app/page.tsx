export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container-main">
        <div className="py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🚀 E-PNMLS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Portail Ressources Humaines - Modernisé avec Next.js & Supabase
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-lg mb-2">Performance</h3>
              <p className="text-gray-600 text-sm">
                Next.js 14 avec SSR/SSG pour une vitesse optimale
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">🔐</div>
              <h3 className="font-bold text-lg mb-2">Sécurité</h3>
              <p className="text-gray-600 text-sm">
                RLS, JWT tokens, et authentification robuste
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-lg mb-2">Scalabilité</h3>
              <p className="text-gray-600 text-sm">
                Supabase PostgreSQL avec indexes optimisés
              </p>
            </div>
          </div>

          <div className="mt-16">
            <p className="text-gray-600 mb-4">
              Prêt à démarrer? Consultez la documentation:
            </p>
            <a
              href="https://github.com/gabriel429/epnmls.cd"
              className="btn btn-primary inline-block"
            >
              📚 Repository GitHub
            </a>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">🎯 Fonctionnalités</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Authentification JWT
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Gestion Agents & Affectations
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Pointages & Absences
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Demandes CRUD Workflow
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              GED (Documents Électroniques)
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Task Management
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Notifications Real-time
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              Audit Logs Complets
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
