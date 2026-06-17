/**
 * lib/mailer.js
 *
 * Creates and exports a reusable Nodemailer transporter.
 * All credentials are read exclusively from environment variables —
 * nothing sensitive ever reaches the client bundle.
 *
 * The transporter is created once (module-level singleton) so that
 * the SMTP connection pool is reused across requests in the same
 * Node.js process (important on long-lived servers; on Vercel each
 * function invocation is fresh, so the cost is negligible).
 */

import nodemailer from 'nodemailer';

/* ── Build transporter from env vars ────────────────────────────── */
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Missing SMTP environment variables. ' +
      'Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in .env.local'
    );
  }

  const port   = parseInt(SMTP_PORT, 10);
  const secure = port === 465; // TLS on port 465, STARTTLS on 587

  return nodemailer.createTransport({
    host:   SMTP_HOST,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS.replace(/\s+/g, ''), // strip spaces (App Passwords are shown with spaces)
    },
    connectionTimeout: 10_000,
    greetingTimeout:   10_000,
    socketTimeout:     15_000,
    ...(SMTP_HOST.includes('gmail') && {
      tls: { rejectUnauthorized: false },
    }),
  });
}

/* Singleton — only constructed on first import */
let _transporter = null;

export function getTransporter() {
  if (!_transporter) {
    _transporter = createTransporter();
  }
  return _transporter;
}

/**
 * Convenience wrapper — sends one mail and resolves with Nodemailer's info object.
 * Throws on failure so the caller can catch and return a 500 response.
 *
 * @param {import('nodemailer').SendMailOptions} options
 */
export async function sendMail(options) {
  const transporter = getTransporter();
  return transporter.sendMail(options);
}
