/**
 * lib/db.js
 *
 * PostgreSQL connection pool — works with both:
 *   • Supabase (production / Vercel) via DATABASE_URL  ← preferred
 *   • Local PostgreSQL via individual DB_* vars         ← fallback for dev
 *
 * Supabase requires SSL. We enable it automatically when:
 *   - DATABASE_URL is provided (always Supabase / remote), OR
 *   - NODE_ENV is "production"
 *
 * Usage (unchanged):
 *   import { query, getClient, initSchema } from '@/lib/db';
 */

import pkg from 'pg';
const { Pool } = pkg;

/* ── Build connection config ────────────────────────────────────── */
function buildPoolConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    console.log('[db] Using DATABASE_URL (Supabase / remote Postgres)');

    /*
     * Parse host/port/database from DATABASE_URL but take the password
     * from DB_PASSWORD env var if provided. This sidesteps the '#' in URL
     * encoding issue entirely — special chars in passwords are safe in a
     * plain env var but break URL parsing when embedded in the URL string.
     */
    let parsedConfig;
    try {
      const u = new URL(databaseUrl);

      const host     = u.hostname;
      const port     = parseInt(u.port || '5432', 10);
      const database = u.pathname.replace(/^\//, '');
      const user     = decodeURIComponent(u.username);

      // Prefer DB_PASSWORD standalone var — avoids # encoding issues in URLs
      // Fall back to whatever is in the URL (already decoded by URL parser)
      const password = process.env.DB_PASSWORD_PLAIN || decodeURIComponent(u.password);

      if (!host || host === 'postgres' || !host.includes('.')) {
        throw new Error(
          `DATABASE_URL has an invalid host "${host}". ` +
          `If your password contains # set DB_PASSWORD_PLAIN=yourpassword as a ` +
          `separate Vercel env var and use a placeholder in DATABASE_URL.`
        );
      }

      console.log(`[db] Connecting to ${host}:${port}/${database} as ${user}`);

      parsedConfig = {
        host,
        port,
        database,
        user,
        password,
        ssl:  { rejectUnauthorized: false },
        max:  10,
        idleTimeoutMillis:       30_000,
        connectionTimeoutMillis: 10_000,
      };
    } catch (e) {
      console.error('[db] DATABASE_URL parse error:', e.message);
      throw e;
    }

    return parsedConfig;
  }

  /* ── Local development fallback ─────────────────────────────── */
  const required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing  = required.filter((k) => !process.env[k]);

  if (missing.length > 0) {
    throw new Error(
      `[db] No DATABASE_URL found and individual DB vars are incomplete.\n` +
      `Missing: ${missing.join(', ')}.\n` +
      `For Supabase: add DATABASE_URL to .env.local\n` +
      `For local Postgres: add all DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD vars.`
    );
  }

  /**
   * Strip surrounding quotes that dotenv sometimes leaves when a value
   * contains special characters (e.g. DB_PASSWORD="#5Family").
   */
  function stripQuotes(val = '') {
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1);
    }
    return val;
  }

  console.log('[db] Using individual DB_* vars (local Postgres)');
  return {
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: stripQuotes(process.env.DB_PASSWORD),
    // No SSL for local dev unless explicitly requested
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  };
}

/* ── Module-level singleton ─────────────────────────────────────── */
let _pool = null;

function getPool() {
  if (!_pool) {
    const config = buildPoolConfig();
    _pool = new Pool(config);

    _pool.on('error', (err) => {
      console.error('[db] Unexpected pool error:', err.message);
      // Reset pool so the next request tries to reconnect
      _pool = null;
    });

    // Verify the connection is reachable on first pool creation
    _pool.connect()
      .then((client) => {
        console.log('[db] Connection to PostgreSQL established successfully.');
        client.release();
      })
      .catch((err) => {
        console.error('[db] Initial connection test failed:', err.message);
        // Don't crash — let individual queries surface the error
      });
  }
  return _pool;
}

/**
 * Run a parameterized SQL query using an auto-managed pool connection.
 *
 * @param {string}  text     SQL with $1, $2 … placeholders
 * @param {Array}   [params] Parameter values (prevents SQL injection)
 * @returns {Promise<import('pg').QueryResult>}
 */
export async function query(text, params) {
  const pool  = getPool();
  const start = Date.now();

  try {
    const result = await pool.query(text, params);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[db] query (${Date.now() - start}ms):`, text.slice(0, 80));
    }

    return result;
  } catch (err) {
    console.error(`[db] Query failed (${Date.now() - start}ms):`, err.message);
    console.error('[db] SQL:', text.slice(0, 200));
    throw err;
  }
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
 * Uses IF NOT EXISTS — completely safe to run multiple times.
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

    CREATE INDEX IF NOT EXISTS contacts_email_idx
      ON contacts (email);

    CREATE INDEX IF NOT EXISTS contacts_created_at_idx
      ON contacts (created_at DESC);
  `;

  await query(sql);
  console.log('[db] Schema ready (contacts table exists).');
}
