# 🚀 Charger le schéma PostgreSQL sur Supabase

## Étape 1: Accéder à Supabase SQL Editor

1. Aller à: https://app.supabase.com/
2. Sélectionner votre projet: `tatbiurcijezsxsokwlh`
3. Cliquer sur **SQL Editor** (gauche)
4. Cliquer sur **New Query**

## Étape 2: Copier le SQL

1. Ouvrir le fichier `supabase-schema.sql`
2. **Copier tout le contenu**

## Étape 3: Exécuter le SQL

1. Coller le SQL dans l'éditeur Supabase
2. Cliquer sur **Run** (ou Ctrl+Enter)
3. Vérifier les succès ✅

## ✅ Vérification

Une fois exécuté, vérifier dans Supabase:

```sql
-- Vérifier les tables créées
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

## 📝 Tables créées (14 principales)

- agents
- affectations
- agent_statuses
- provinces
- departments
- sections
- cellules
- localites
- fonctions
- grades
- institutions
- organes
- users
- roles
- permissions
- requests
- documents
- document_travails
- categorie_documents
- pointages
- holidays
- holiday_plannings
- taches
- tache_commentaires
- activite_plans
- messages
- communiques
- signalements
- notifications_portail
- historique_modifications
- audit_logs

## 🔗 Liens utiles

- Dashboard Supabase: https://app.supabase.com/project/tatbiurcijezsxsokwlh/editor
- SQL Reference: https://www.postgresql.org/docs/current/
