/**
 * scripts/test-smtp.mjs
 *
 * Quick SMTP connectivity test — run BEFORE starting the dev server.
 * Usage:  node scripts/test-smtp.mjs
 *
 * Reads credentials from .env.local and attempts to send a test email.
 * Tells you EXACTLY what is wrong if it fails.
 */

import { readFileSync } from 'fs';
import { createTransport } from 'nodemailer';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

/* ── Load .env.local manually (no dotenv dependency needed) ──────── */
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

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, OWNER_EMAIL } = env;

/* ── Preflight checks ───────────────────────────────────────────── */
console.log('\n🔍  SMTP Diagnostics\n' + '─'.repeat(40));
console.log('  Host :', SMTP_HOST   || '❌  MISSING');
console.log('  Port :', SMTP_PORT   || '❌  MISSING');
console.log('  User :', SMTP_USER   || '❌  MISSING');
console.log('  Pass :', SMTP_PASS   ? `${'*'.repeat(SMTP_PASS.length)} (${SMTP_PASS.length} chars)` : '❌  MISSING');
console.log('  From :', FROM_EMAIL  || '❌  MISSING');
console.log('  Owner:', OWNER_EMAIL || '❌  MISSING');
console.log('─'.repeat(40));

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.error('\n❌  One or more required env vars are missing. Fix .env.local first.\n');
  process.exit(1);
}

const port   = parseInt(SMTP_PORT, 10);
const secure = port === 465;
const pass   = SMTP_PASS.replace(/\s+/g, ''); // strip accidental spaces

console.log(`\n⚙️   Connecting to ${SMTP_HOST}:${port} (${secure ? 'TLS/SSL' : 'STARTTLS'})…`);

const transporter = createTransport({
  host: SMTP_HOST,
  port,
  secure,
  auth: { user: SMTP_USER, pass },
  connectionTimeout: 10_000,
  tls: { rejectUnauthorized: false },
});

/* ── Verify credentials ─────────────────────────────────────────── */
try {
  await transporter.verify();
  console.log('✅  SMTP credentials verified — connection successful!\n');
} catch (err) {
  console.error('\n❌  SMTP verification failed:', err.message);

  if (err.message.includes('535') || err.message.includes('BadCredentials')) {
    console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO FIX: 535 BadCredentials
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are using: ${SMTP_USER}

${SMTP_USER.endsWith('@gmail.com') ? `
This is a personal Gmail account.
Steps:
  1. Go to https://myaccount.google.com/security
  2. Make sure "2-Step Verification" is ON
  3. Go to https://myaccount.google.com/apppasswords
  4. Create a new App Password (name it "Portfolio")
  5. Copy the 16-char password (ignore the spaces)
  6. Paste it into SMTP_PASS in .env.local
  7. Restart the dev server
` : `
This is a Google Workspace account (not @gmail.com).
App Passwords may be DISABLED by your Workspace admin.

Two options:

OPTION 1 — Ask your Workspace admin to enable App Passwords:
  Admin Console → Security → API controls
  → "Allow users to manage their access to less secure apps"
  Then create an App Password at:
  https://myaccount.google.com/apppasswords

OPTION 2 (Recommended — no admin needed):
  Use a personal Gmail account as the SMTP sender.
  Update .env.local:
    SMTP_USER=your_personal@gmail.com
    SMTP_PASS=<16-char App Password from that Gmail>
    FROM_EMAIL=your_personal@gmail.com
    OWNER_EMAIL=${SMTP_USER}   ← your work email still receives messages
`}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  } else if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
    console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO FIX: Connection refused / timed out
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Check that SMTP_HOST and SMTP_PORT are correct
  • Port 465 = TLS (Gmail, most providers)
  • Port 587 = STARTTLS
  • Your firewall or ISP may be blocking outbound SMTP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  }

  process.exit(1);
}

/* ── Send test email ─────────────────────────────────────────────── */
console.log(`\n📤  Sending test email to ${OWNER_EMAIL}…`);
try {
  const info = await transporter.sendMail({
    from:    `"Portfolio Test" <${FROM_EMAIL}>`,
    to:      OWNER_EMAIL,
    subject: '✅ Portfolio SMTP test — it works!',
    text:    'Your SMTP configuration is working correctly. The contact form is ready.',
    html:    `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="color:#6366f1;">✅ SMTP test passed!</h2>
        <p>Your portfolio contact form SMTP configuration is working correctly.</p>
        <p style="color:#64748b;font-size:13px;">Sent from: ${FROM_EMAIL}</p>
      </div>
    `,
  });

  console.log(`\n✅  Test email sent! Message ID: ${info.messageId}`);
  console.log('   Check your inbox at', OWNER_EMAIL);
  console.log('\n🎉  Everything is working — your contact form is ready.\n');
} catch (err) {
  console.error('\n❌  Failed to send test email:', err.message, '\n');
  process.exit(1);
}
