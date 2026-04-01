#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://tatbiurcijezsxsokwlh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdGJpdXJjaWplenN4c29rd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTY4ODUsImV4cCI6MjA5MDM5Mjg4NX0.aMC8Qi5EJMHmmd-4rmI17c4O4rCqErAxKtY9WS596p8';

console.log('🚀 Chargement du schéma PostgreSQL dans Supabase...\n');

// Lire le fichier SQL du projet portailrh.pnmls.cd
const sqlPath = path.join(__dirname, '../../portailrh.pnmls.cd/supabase-schema.sql');

if (!fs.existsSync(sqlPath)) {
  console.error('❌ Erreur: supabase-schema.sql non trouvé à', sqlPath);
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

// Diviser en statements SQL (par ;)
const statements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--') && !s.startsWith('/*'));

console.log(`📊 ${statements.length} statements SQL à exécuter\n`);

// Pour Supabase, on doit utiliser l'API REST pour exécuter du SQL brut
// En réalité, il faut utiliser le client PostgreSQL ou Supabase directement
console.log('ℹ️  Pour charger le schéma, deux options:\n');
console.log('OPTION 1: Supabase SQL Editor (Manuel)\n- URL: https://app.supabase.com/project/tatbiurcijezsxsokwlh/editor\n- Copier le contenu de supabase-schema.sql\n- Exécuter dans l'éditeur\n');

console.log('OPTION 2: PostgreSQL CLI (si vous avez psql)\n');
console.log('  # 1. Télécharger Supabase Connection String');
console.log('  # Dashboard > Project > Connection > PostgreSQL');
console.log('  # Remplacer [YOUR-PASSWORD] par le mot de passe');
console.log('  psql "postgresql://[user]:[password]@db.tatbiurcijezsxsokwlh.supabase.co:5432/postgres" < supabase-schema.sql\n');

console.log('OPTION 3: Node.js + pg (Recommandé)\n');
console.log('  npm install pg');
console.log('  node scripts/load-schema-pg.js\n');

console.log('✅ À vous de choisir!');
