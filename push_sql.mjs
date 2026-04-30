import pg from 'pg';
import fs from 'fs';

const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://postgres:sb_secret_3EOHuGWRO1ldsms6kS9U8Q_TO_3aSof@db.sxrjbhfcxuvrctpnhoxm.supabase.co:5432/postgres'
});

async function runMigration() {
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();

    console.log('Applying SQL schema for Testimonials and Community tables...');
    const sql = fs.readFileSync('supabase/migrations/20260430000000_testimonials_community.sql', 'utf8');

    await client.query(sql);

    console.log('✅ Success! The tables and policies have been successfully created.');
    
    // Let's verify the tables exist
    const res1 = await client.query('SELECT COUNT(*) FROM public.testimonials');
    console.log(`✅ Testimonials table active. Currently ${res1.rows[0].count} entries.`);
    
    const res2 = await client.query('SELECT COUNT(*) FROM public.community_posts');
    console.log(`✅ Community Posts table active. Currently ${res2.rows[0].count} entries.`);

  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
