#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://tatbiurcijezsxsokwlh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdGJpdXJjaWplenN4c29rd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTY4ODUsImV4cCI6MjA5MDM5Mjg4NX0.aMC8Qi5EJMHmmd-4rmI17c4O4rCqErAxKtY9WS596p8';

console.log('🚀 Chargement du schéma via Supabase SQL Editor API\n');

// Lire le fichier SQL
const sqlPath = path.join(__dirname, '../../portailrh.pnmls.cd/supabase-schema.sql');

if (!fs.existsSync(sqlPath)) {
  console.error(`❌ Fichier SQL non trouvé: ${sqlPath}`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

console.log('📂 Fichier SQL chargé');
console.log(`📊 Taille: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

console.log('⚠️  APPROCHE REST API:');
console.log('─'.repeat(50));
console.log('La migration directe via REST n\'est pas supportée.\n');

console.log('✅ SOLUTION RAPIDE - Supabase SQL Editor Direct:');
console.log('─'.repeat(50));
console.log('1. Aller à: https://app.supabase.com/project/tatbiurcijezsxsokwlh/editor');
console.log('2. Cliquer "New Query"');
console.log('3. Copier-coller le contenu de supabase-schema.sql');
console.log('4. Cliquer "Run" (Ctrl+Enter)');
console.log('5. Attendre ~30 secondes\n');

console.log('📋 Alternative CLI - PostgreSQL:');
console.log('─'.repeat(50));

const connStr = 'postgresql://postgres:Pnmls@portailrh26@db.tatbiurcijezsxsokwlh.supabase.co:5432/postgres';

console.log('# 1. Installer psql (PostgreSQL client)');
console.log('# 2. Execute:');
console.log(`psql -d "${connStr}" -f supabase-schema.sql\n`);

console.log('💡 Ou utilisez pg_restore si disponible.\n');

console.log('✅ Je peux vous montrer comment charger manuellement ou');
console.log('   vous pouvez me dire quand le schéma est chargé! 🎉');
