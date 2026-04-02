/**
 * Migration Script: MySQL (Laravel) → PostgreSQL (Supabase)
 * Converts E-PNMLS agent data from original MySQL database to Supabase
 */

import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// MySQL connection config
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'u605154961_pnmls',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function migrateDepartments(connection: any) {
  console.log('📦 Migrating departments...');
  const [departments] = await connection.query('SELECT * FROM departments WHERE deleted_at IS NULL');

  for (const dept of departments) {
    await supabase.from('departments').insert({
      name: dept.nom,
      code: dept.code,
      description: dept.description,
      is_active: true,
    });
  }
  console.log(`✅ ${departments.length} departments migrated`);
}

async function migrateFonctions(connection: any) {
  console.log('📦 Migrating fonctions (job titles)...');
  const [fonctions] = await connection.query('SELECT * FROM fonctions WHERE synced_at IS NULL');

  for (const fonction of fonctions) {
    await supabase.from('fonctions').insert({
      name: fonction.nom,
      code: fonction.id.toString(),
      description: fonction.description,
      level: 0,
      is_active: true,
    });
  }
  console.log(`✅ ${fonctions.length} fonctions migrated`);
}

async function migrateGrades(connection: any) {
  console.log('📦 Migrating grades...');
  const [grades] = await connection.query('SELECT * FROM grades WHERE synced_at IS NULL');

  for (const grade of grades) {
    await supabase.from('grades').insert({
      name: grade.libelle,
      code: grade.categorie,
      seniority_level: grade.ordre,
      salary_scale: grade.libelle,
      description: grade.nom_categorie,
      is_active: true,
    });
  }
  console.log(`✅ ${grades.length} grades migrated`);
}

async function migrateAgents(connection: any) {
  console.log('📦 Migrating agents...');
  const [agents] = await connection.query(
    `SELECT * FROM agents WHERE deleted_at IS NULL ORDER BY id ASC`
  );

  let successCount = 0;
  let errorCount = 0;

  for (const agent of agents) {
    try {
      const { error } = await supabase.from('agents').insert({
        matricule: agent.matricule_etat,
        prenom: agent.prenom,
        nom: agent.nom,
        sexe: agent.sexe === 'F' ? 'F' : 'M',
        date_naissance: agent.date_naissance,
        lieu_naissance: agent.lieu_naissance,
        numero_identite: null,
        date_delivrance_identite: null,
        lieu_delivrance_identite: null,
        nationalite: 'Congo',
        etat_civil: agent.situation_familiale,
        fonction_id: agent.grade_id,
        grade_id: agent.grade_id,
        institution_id: agent.institution_id,
        department_id: agent.departement_id,
        province_id: agent.province_id,
        organe: agent.organe || 'SEN',
        email: agent.email_professionnel || agent.email,
        telephone: agent.telephone,
        adresse: agent.adresse,
        domaine_etudes: agent.domaine_etudes,
        date_embauche: agent.date_embauche,
        statut_emploi: agent.statut || 'active',
        role_id: agent.role_id,
        date_derniere_promotion: null,
        notes: null,
        is_active: agent.statut === 'actif',
      });

      if (!error) {
        successCount++;
      } else {
        console.error(`❌ Error migrating agent ${agent.id}:`, error.message);
        errorCount++;
      }
    } catch (err) {
      console.error(`❌ Exception migrating agent ${agent.id}:`, err);
      errorCount++;
    }
  }

  console.log(`✅ ${successCount} agents migrated, ${errorCount} errors`);
}

async function migrateUsers(connection: any) {
  console.log('📦 Migrating users...');
  const [users] = await connection.query('SELECT * FROM users');

  for (const user of users) {
    const { error } = await supabase.from('users').insert({
      email: user.email,
      name: user.name,
      agent_id: user.agent_id,
      is_super_admin: user.is_super_admin || false,
      frozen: user.is_frozen || false,
    });

    if (error && !error.message.includes('duplicate')) {
      console.error(`⚠️ Error migrating user ${user.email}:`, error.message);
    }
  }
  console.log(`✅ Users migrated`);
}

async function migrateAffectations(connection: any) {
  console.log('📦 Migrating affectations...');
  const [affectations] = await connection.query(
    'SELECT * FROM affectations WHERE deleted_at IS NULL'
  );

  let count = 0;
  for (const aff of affectations) {
    const { error } = await supabase.from('affectations').insert({
      agent_id: aff.agent_id,
      fonction_id: aff.fonction_id,
      department_id: aff.department_id,
      localite_id: aff.localite_id,
      date_affectation: aff.date_debut,
      date_fin: aff.date_fin,
      motif: aff.remarque,
      statut: aff.actif ? 'active' : 'inactive',
      is_active: aff.actif === 1,
    });

    if (!error) count++;
  }
  console.log(`✅ ${count} affectations migrated`);
}

async function runMigration() {
  let connection;

  try {
    console.log('🚀 Starting E-PNMLS Data Migration\n');

    // Connect to MySQL
    connection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connected to MySQL');

    // Run migrations in order
    await migrateDepartments(connection);
    await migrateFonctions(connection);
    await migrateGrades(connection);
    await migrateAgents(connection);
    await migrateUsers(connection);
    await migrateAffectations(connection);

    console.log('\n✨ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
