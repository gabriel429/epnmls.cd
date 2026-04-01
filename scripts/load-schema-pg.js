#!/usr/bin/env node

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase PostgreSQL Connection (vous aurez besoin du mot de passe)
const DB_CONFIG = {
  host: 'db.tatbiurcijezsxsokwlh.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD || '', // À fournir dans .env
};

const client = new pg.Client(DB_CONFIG);

async function loadSchema() {
  try {
    if (!DB_CONFIG.password) {
      console.error('❌ Erreur: SUPABASE_DB_PASSWORD not set in environment');
      console.log('\n📝 Ajouter à .env:');
      console.log('SUPABASE_DB_PASSWORD=<votre_mot_de_passe>');
      process.exit(1);
    }

    console.log('🔌 Connexion à Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Connecté!\n');

    const sqlPath = path.join(__dirname, '../../portailrh.pnmls.cd/supabase-schema.sql');

    if (!fs.existsSync(sqlPath)) {
      console.error(`❌ Fichier SQL non trouvé: ${sqlPath}`);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📊 Exécution du schéma PostgreSQL...\n');

    // Exécuter tout le SQL en une seule requête
    const result = await client.query(sqlContent);
    console.log('✅ Schéma chargé avec succès!\n');

    // Vérifier les tables
    const checkTables = await client.query(`
      SELECT COUNT(*) as total_tables
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log(`📈 Tables créées: ${checkTables.rows[0].total_tables}`);

    const tablesList = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\n📋 Tables:');
    tablesList.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    console.log('\n✅ Schéma PostgreSQL complètement chargé sur Supabase!');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

loadSchema();
