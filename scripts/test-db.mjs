/**
 * scripts/test-db.mjs
 *
 * Verifies PostgreSQL connectivity and creates the contacts table if needed.
 * Run BEFORE starting the dev server after adding DB_ vars to .env.local:
 *
 *   node scripts/test-db.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath }    from 'url';
import pkg from 'pg';
const { Pool } = pkg;

/* ── Load .env.local ────────────────────────────────────────────── */
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath   = resolve(__dirname, '../.env.local');

let envContent;
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch {
  console.error('❌  .env.local not found at', envPath);
  process.exit(1);
}

const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  if (key) env[key.trim()] = rest.join('=').trim();
}

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD: DB_PASSWORD_RAW } = env;

/* Strip surrounding quotes — needed when value contains # and is quoted */
const DB_PASSWORD = DB_PASSWORD_RAW
  ? DB_PASSWORD_RAW.replace(/^["']|["']$/g, '')
  : '';

/* ── Preflight ──────────────────────────────────────────────────── */
console.log('\n🔍  PostgreSQL Diagnostics\n' + '─'.repeat(40));
console.log('  Host    :', DB_HOST     || '❌  MISSING');
console.log('  Port    :', DB_PORT     || '❌  MISSING');
console.log('  Database:', DB_NAME     || '❌  MISSING');
console.log('  User    :', DB_USER     || '❌  MISSING');
console.log('  Password:', DB_PASSWORD && DB_PASSWORD !== 'your_postgres_password_here'
  ? '*'.repeat(DB_PASSWORD.length)
  : '❌  NOT SET (still placeholder)');
console.log('─'.repeat(40));

if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD
    || DB_PASSWORD === 'your_postgres_password_here') {
  console.error('\n❌  Fix .env.local first — set real DB credentials.\n');
  process.exit(1);
}

/* ── Connect ────────────────────────────────────────────────────── */
const pool = new Pool({
  host:     DB_HOST,
  port:     parseInt(DB_PORT, 10),
  database: DB_NAME,
  user:     DB_USER,
  password: DB_PASSWORD,
  connectionTimeoutMillis: 5000,
});

console.log(`\n⚙️   Connecting to PostgreSQL at ${DB_HOST}:${DB_PORT}/${DB_NAME}…`);

let client;
try {
  client = await pool.connect();
  console.log('✅  Connected successfully!\n');
} catch (err) {
  console.error('❌  Connection failed:', err.message);

  if (err.message.includes('password authentication failed')) {
    console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX: Wrong password
  Update DB_PASSWORD in .env.local with your real postgres password.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  } else if (err.message.includes('does not exist')) {
    console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX: Database "${DB_NAME}" does not exist
  Create it first:
    psql -U ${DB_USER} -c "CREATE DATABASE \\"${DB_NAME}\\";"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  } else if (err.message.includes('ECONNREFUSED')) {
    console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX: PostgreSQL is not running or wrong host/port
  • Start PostgreSQL service
  • Verify DB_HOST=${DB_HOST} and DB_PORT=${DB_PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }
  await pool.end();
  process.exit(1);
}

/* ── Create table ───────────────────────────────────────────────── */
console.log('📋  Ensuring contacts table exists…');
try {
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
  console.log('✅  contacts table is ready.\n');
} catch (err) {
  console.error('❌  Failed to create table:', err.message);
  client.release();
  await pool.end();
  process.exit(1);
}

/* ── Insert + read test row ─────────────────────────────────────── */
console.log('🧪  Inserting test row…');
try {
  const res = await client.query(
    `INSERT INTO contacts (full_name, email, subject, message)
     VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
    ['Test User', 'test@example.com', 'DB test', 'This is a test submission from test-db.mjs']
  );
  const row = res.rows[0];
  console.log(`✅  Inserted test row  id=${row.id}  created_at=${row.created_at}`);

  /* Clean up test row */
  await client.query('DELETE FROM contacts WHERE id = $1', [row.id]);
  console.log('🧹  Test row cleaned up.\n');
} catch (err) {
  console.error('❌  Test insert failed:', err.message);
  client.release();
  await pool.end();
  process.exit(1);
}

client.release();
await pool.end();

console.log('🎉  PostgreSQL is fully configured and working!');
console.log('   You can now run:  npm run dev\n');
