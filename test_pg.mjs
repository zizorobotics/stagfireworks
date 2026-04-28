import pg from 'pg';

const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://postgres:sb_secret_3EOHuGWRO1ldsms6kS9U8Q_TO_3aSof@db.sxrjbhfcxuvrctpnhoxm.supabase.co:5432/postgres'
});

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Connected to Supabase PostgreSQL!', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

test();
