# E-PNMLS - Portail RH Moderne

**E-PNMLS** est une plateforme complète de gestion des ressources humaines, totalement modernisée avec **Next.js 14**, **React 18**, et **Supabase**.

## 🚀 Stack Technologique

- **Frontend**: React 18 + Next.js 14 (App Router)
- **Backend/BDD**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Auth**: Supabase JWT + Session Management
- **Deployment**: Vercel

## 📊 Fonctionnalités

- ✅ **Authentification** - JWT via Supabase
- ✅ **Gestion Agents** - CRUD, affectations, grades
- ✅ **Pointages** - Attendance tracking
- ✅ **Demandes** - Workflow approvals
- ✅ **Documents** - GED (Gestion Électronique Docs)
- ✅ **Tâches** - Task management avec commentaires
- ✅ **Notifications** - Real-time alerts
- ✅ **Audit** - Historique modifications & logs

## 🔧 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/gabriel429/epnmls.cd.git
cd epnmls.cd

# 2. Installer les dépendances
npm install

# 3. Configurer les variables
cp .env.example .env.local
# Ajouter les credentials Supabase dans .env.local

# 4. Démarrer le dev server
npm run dev
```

Accéder à: **http://localhost:3000**

## 📁 Structure du Projet

```
epnmls.cd/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── (auth)/          # Auth pages
│   ├── components/          # React components
│   │   ├── Auth/            # Auth components
│   │   ├── Dashboard/       # Dashboard UI
│   │   └── ...
│   ├── lib/                 # Utilities
│   │   ├── supabase.ts      # Supabase client
│   │   ├── types.ts         # Types
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   ├── store/               # Zustand store
│   └── styles/              # Global CSS
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── .env.local               # Local environment
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.js
```

## 🔐 Sécurité

- ✅ RLS (Row Level Security) configurées
- ✅ JWT tokens sécurisés
- ✅ HTTPS enforced
- ✅ CORS configuré
- ✅ SQL injection prevention

## 📈 Performance

- ⚡ Next.js SSR/SSG optimization
- ⚡ Image optimization
- ⚡ Code splitting automatique
- ⚡ Lazy loading des composants

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
# 1. Push sur GitHub
git push -u origin main

# 2. Connecter à Vercel
# - Aller à https://vercel.com
# - Importer le repo
# - Ajouter les env vars

# 3. Deploy automatique on push
```

## 📚 Documentation

- [Supabase Guide](./docs/SUPABASE.md)
- [Migration Guide](./docs/MIGRATION.md)
- [API Reference](./docs/API.md)

## 🤝 Contribution

Les PRs sont bienvenues! Consultez `CONTRIBUTING.md` pour plus d'infos.

## 📄 License

ISC

## 👨‍💼 Auteur

**PNMLS** - HR Management Platform

---

**Status**: 🚀 In Development

**Dernière mise à jour**: Avril 2026
# epnmls.cd
