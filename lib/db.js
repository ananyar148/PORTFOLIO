/**
 * lib/db.js
 *
 * PostgreSQL connection pool — single shared instance for the entire
 * Next.js server process.
 *
 * Why a pool?
 *   • Reuses connections instead of opening a new TCP socket per request.
 *   • pg.Pool is safe to call query() on concurrently.
 *   • On Vercel / serverless each function invocation is isolated, but
 *     locally (and on long-lived servers) the pool saves significant
 *     overhead.
 *
 * Usage:
 *   import { query, getClient } from '@/lib/db';
 *
 *   // Simple query (auto-releases connection back to pool)
 *   const { rows } = await query('SELECT * FROM contacts WHERE id = $1', [id]);
 *
 *   // Transaction (manual client management)
 *   const client = await getClient();
 *   try {
 *     await client.query('BEGIN');
 *     ...
 *     await client.query('COMMIT');
 *   } catch (e) {
 *     await client.query('ROLLBACK');
 *     throw e;
 *   } finally {
 *     client.release();
 *   }
 */

import pkg from 'pg';
const { Pool } = pkg;

/* ── Validate required env vars at module load ──────────────────── */
const required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing  = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  throw new Error(
    `[db] Missing PostgreSQL environment variables: ${missing.join(', ')}. ` +
    'Please add them to .env.local'
  );
}

/**
 * Strip surrounding double-quotes that dotenv sometimes leaves when a value
 * contains special characters like # and is quoted in .env.local.
 * e.g.  DB_PASSWORD="#5Family"  →  #5Family
 */
function stripQuotes(val = '') {
  if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1);
  if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1);
  return val;
}

/* ── Pool configuration ─────────────────────────────────────────── */
const poolConfig = {
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: stripQuotes(process.env.DB_PASSWORD),

  /* Pool sizing — sensible defaults for both local dev and production */
  max:              10,   // maximum simultaneous connections
  idleTimeoutMillis: 30_000,  // close idle clients after 30 s
  connectionTimeoutMillis: 5_000, // fail fast if DB is unreachable
};

/* ── Module-level singleton ─────────────────────────────────────── */
let _pool = null;

function getPool() {
  if (!_pool) {
    _pool = new Pool(poolConfig);

    /* Surface connection errors without crashing the process */
    _pool.on('error', (err) => {
      console.error('[db] Unexpected pool error:', err.message);
    });
  }
  return _pool;
}

/**
 * Run a parameterized SQL query using an auto-managed pool connection.
 *
 * @param {string}  text    — SQL with $1, $2 … placeholders
 * @param {Array}   [params] — parameter values (prevents SQL injection)
 * @returns {Promise<import('pg').QueryResult>}
 */
export async function query(text, params) {
  const pool  = getPool();
  const start = Date.now();

  const result = await pool.query(text, params);

  /* Development-only query timing log */
  if (process.env.NODE_ENV === 'development') {
    console.log(`[db] query (${Date.now() - start}ms):`, text.slice(0, 80));
  }

  return result;
}

/**
 * Acquire a dedicated client from the pool.
 * Caller MUST call client.release() in a finally block.
 * Use only when you need a transaction.
 *
 * @returns {Promise<import('pg').PoolClient>}
 */
export async function getClient() {
  return getPool().connect();
}

/**
 * Initialise the database schema.
 * Called once on server startup (from the API route on first request).
 * Uses IF NOT EXISTS so it is completely safe to run multiple times.
 */
export async function initSchema() {
  const sql = `
    CREATE TABLE IF NOT EXISTS contacts (
      id          SERIAL        PRIMARY KEY,
      full_name   VARCHAR(255)  NOT NULL,
      email       VARCHAR(255)  NOT NULL,
      subject     VARCHAR(255),
      message     TEXT          NOT NULL,
      created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- Index on email for fast look-ups / deduplication queries later
    CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts (email);

    -- Index on created_at for time-based queries / admin dashboards
    CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at DESC);
  `;

  await query(sql);
  console.log('[db] Schema ready (contacts table exists).');
}
