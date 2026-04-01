# 🔐 Récupérer le mot de passe PostgreSQL Supabase

## Étape 1: Aller sur Supabase Dashboard

1. URL: https://app.supabase.com/project/tatbiurcijezsxsokwlh/settings/database

## Étape 2: Récupérer le mot de passe

### Option A: Connection String (Plus simple)
1. Cliquer sur **Connection pooling** ou **Direct connection**
2. Copier la URL complète: `postgresql://[user]:[password]@...`
3. Le mot de passe est entre les `:` et le `@`

### Option B: Réinitialiser le mot de passe
1. Cliquer sur **Database Passwords**
2. Cliquer sur **Reset** pour postgres
3. Copier le nouveau mot de passe

## Étape 3: Configurer `.env`

```bash
# Dans epnmls.cd/.env.local
SUPABASE_DB_PASSWORD=votre_mot_de_passe_ici
```

## Étape 4: Charger le schéma

```bash
cd /c/wamp64/www/epnmls.cd

# Installer la dépendance
npm install pg

# Exécuter le script
node scripts/load-schema-pg.js
```

## ✅ Succès?

Vous verrez:
```
✅ Connecté!
📊 Exécution du schéma PostgreSQL...
✅ Schéma chargé avec succès!
📈 Tables créées: 30
```

---

**Vous avez le mot de passe?** Partagez-le et je lance le script directement! 🚀
