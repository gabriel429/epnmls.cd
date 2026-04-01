#!/usr/bin/env node

const pg = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
  host: 'db.tatbiurcijezsxsokwlh.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
};

async function loadSchema() {
  const client = new pg.Client(DB_CONFIG);

  try {
    if (!DB_CONFIG.password) {
      console.error('❌ Erreur: SUPABASE_DB_PASSWORD not set');
      process.exit(1);
    }

    console.log('🔌 Connexion à Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Connecté à tatbiurcijezsxsokwlh!\n');

    // Lire le fichier SQL depuis portailrh.pnmls.cd
    const sqlPath = path.join(__dirname, '../../portailrh.pnmls.cd/supabase-schema.sql');

    if (!fs.existsSync(sqlPath)) {
      console.error(`❌ Fichier SQL non trouvé: ${sqlPath}`);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    console.log('📂 Fichier SQL chargé (supabase-schema.sql)');
    console.log(`📊 Taille: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

    console.log('⏳ Exécution du schéma PostgreSQL...');
    console.log('─'.repeat(50));

    await client.query(sqlContent);

    console.log('─'.repeat(50));
    console.log('✅ Schéma chargé avec succès!\n');

    // Vérifier les tables
    console.log('📈 Vérification des tables...\n');
    const checkTables = await client.query(`
      SELECT COUNT(*) as total_tables
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const tableCount = checkTables.rows[0].total_tables;
    console.log(`✅ Total tables créées: ${tableCount}\n`);

    const tablesList = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Liste des tables:');
    console.log('─'.repeat(50));
    tablesList.rows.forEach((row, idx) => {
      console.log(`  ${idx + 1}. ${row.table_name}`);
    });

    console.log('─'.repeat(50));
    console.log('\n🎉 Phase 1/8 ✅ COMPLÈTÉE!');
    console.log('\n📝 Prochaines étapes:');
    console.log('  2. Setup RLS policies sécurité');
    console.log('  3. Seed données initiales (rôles, permissions, provinces)');
    console.log('  4. Initialiser Next.js components');
    console.log('  5. Intégrer Supabase client + Auth');
    console.log('  6. Migrer données MySQL → Supabase');
    console.log('  7. Components React (Dashboard, Agents)');
    console.log('  8. Push GitHub + Déployer Vercel');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Déconnexion...');
  }
}

loadSchema();
