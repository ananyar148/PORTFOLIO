/**
 * scripts/test-db.mjs
 *
 * Tests the PostgreSQL / Supabase connection.
 * Run:  node scripts/test-db.mjs
 *
 * Reads DATABASE_URL (or DB_* vars) from .env.local via --env-file flag.
 * Node 20.6+ supports --env-file natively.
 * If your Node is older, install dotenv: npm i -D dotenv  and uncomment
 * the import line below.
 */

// import 'dotenv/config';   // ← uncomment if Node < 20.6

import pkg from 'pg';
const { Pool } = pkg;

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('❌  DATABASE_URL is not set.');
  console.error('    Make sure .env.local has DATABASE_URL= and you ran:');
  console.error('    node --env-file=.env.local scripts/test-db.mjs');
  process.exit(1);
}

// Mask the password in logs
const masked = url.replace(/:([^:@]+)@/, ':****@');
console.log('🔌  Connecting to:', masked);

const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
});

try {
  const client = await pool.connect();

  // 1. Basic connectivity
  const { rows: [ver] } = await client.query('SELECT version()');
  console.log('✅  Connected!');
  console.log('    Server:', ver.version.split(' ').slice(0, 2).join(' '));

  // 2. Create table if missing
  await client.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id          SERIAL        PRIMARY KEY,
      full_name   VARCHAR(255)  NOT NULL,
      email       VARCHAR(255)  NOT NULL,
      subject     VARCHAR(255),
      message     TEXT          NOT NULL,
      created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS contacts_email_idx      ON contacts (email);
    CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at DESC);
  `);
  console.log('✅  Schema ready (contacts table exists).');

  // 3. Test insert
  const { rows: [row] } = await client.query(
    `INSERT INTO contacts (full_name, email, subject, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    ['Test User', 'test@example.com', 'DB Test', 'This is a test message from test-db.mjs']
  );
  console.log(`✅  Test row inserted: id=${row.id}  created_at=${row.created_at}`);

  // 4. Clean up test row
  await client.query('DELETE FROM contacts WHERE id = $1', [row.id]);
  console.log('✅  Test row cleaned up.');

  client.release();
  console.log('\n🎉  All checks passed — Supabase is ready for the contact form!');
} catch (err) {
  console.error('\n❌  Connection failed:', err.message);

  if (err.message.includes('password authentication')) {
    console.error('    → Wrong password. Check DATABASE_URL in .env.local.');
    console.error('    → If password contains #, it must be encoded as %23 in the URL.');
  } else if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
    console.error('    → Host unreachable. Check the hostname and port in DATABASE_URL.');
    console.error('    → For Supabase, use the Transaction pooler URL (port 6543), not port 5432.');
  } else if (err.message.includes('SSL')) {
    console.error('    → SSL error. The ssl: { rejectUnauthorized: false } config should handle this.');
  }

  process.exit(1);
} finally {
  await pool.end();
}
