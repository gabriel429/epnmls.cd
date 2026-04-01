import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = 'https://tatbiurcijezsxsokwlh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_KEY not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFromFile() {
  try {
    console.log('📂 Lecture du fichier SQL...');
    const sqlPath = join(process.cwd(), 'supabase-schema.sql');
    const sqlContent = readFileSync(sqlPath, 'utf-8');

    console.log('🔄 Exécution du schéma PostgreSQL...');

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    let executedCount = 0;
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement,
        });

        if (error) {
          console.warn(`⚠️  Erreur (probablement déjà existant): ${statement.substring(0, 50)}...`);
        } else {
          executedCount++;
          console.log(`✅ Exécuté: ${statement.substring(0, 50)}...`);
        }
      } catch (err) {
        console.warn(`⚠️  Erreur lors execution: ${err}`);
      }
    }

    console.log(`\n✅ Schéma chargé! (${executedCount} statements)`);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

executeSqlFromFile();
