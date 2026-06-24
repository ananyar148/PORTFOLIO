/**
 * app/api/contact/route.js
 *
 * POST /api/contact
 *
 * Flow:
 *   1. Parse + validate + sanitize the request body
 *   2. Ensure the contacts table exists (idempotent)
 *   3. INSERT the submission into PostgreSQL (parameterized — no SQL injection)
 *   4. Only if the INSERT succeeds → send both emails in parallel
 *   5. Return a structured JSON response
 *
 * If the DB insert fails, emails are NOT sent and a 500 is returned.
 * SMTP failures after a successful insert return 500 but the record is
 * already safely stored — the visitor can be contacted manually.
 *
 * Security:
 *   • Server-side validation + sanitization
 *   • Parameterized queries only
 *   • Credentials never reach the client
 *   • Generic error messages in responses; details logged server-side only
 */

import { NextResponse }        from 'next/server';
import { query, initSchema }   from '@/lib/db';
import { sendMail }            from '@/lib/mailer';
import { ownerNotification,
         visitorConfirmation } from '@/lib/emailTemplates';

/* ── Constants ──────────────────────────────────────────────────── */
const EMAIL_REGEX     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN    = 100;
const MAX_SUBJECT_LEN = 200;
const MAX_MSG_LEN     = 5000;

/* Track whether we've already run initSchema in this process */
let schemaReady = false;

/* ── Sanitize helper ────────────────────────────────────────────── */
function sanitize(str) {
  return String(str)
    .replace(/<[^>]*>/g, '')              // strip HTML tags
    .replace(/[\u0000-\u001F\u007F]/g, '') // strip control characters
    .trim();
}

/* ── Validation ─────────────────────────────────────────────────── */
function validateBody({ name, email, subject, message }) {
  const errors = [];

  if (!name || sanitize(name).length === 0)
    errors.push({ field: 'name', message: 'Name is required.' });
  else if (sanitize(name).length > MAX_NAME_LEN)
    errors.push({ field: 'name', message: `Name must be ${MAX_NAME_LEN} characters or fewer.` });

  if (!email || sanitize(email).length === 0)
    errors.push({ field: 'email', message: 'Email is required.' });
  else if (!EMAIL_REGEX.test(sanitize(email)))
    errors.push({ field: 'email', message: 'Please provide a valid email address.' });

  if (subject && sanitize(subject).length > MAX_SUBJECT_LEN)
    errors.push({ field: 'subject', message: `Subject must be ${MAX_SUBJECT_LEN} characters or fewer.` });

  if (!message || sanitize(message).length < 10)
    errors.push({ field: 'message', message: 'Message must be at least 10 characters.' });
  else if (sanitize(message).length > MAX_MSG_LEN)
    errors.push({ field: 'message', message: `Message must be ${MAX_MSG_LEN} characters or fewer.` });

  return errors;
}

/* ── POST handler ───────────────────────────────────────────────── */
export async function POST(request) {

  /* ── Step 1: Parse body ───────────────────────────────────────── */
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  /* ── Step 2: Validate ─────────────────────────────────────────── */
  const validationErrors = validateBody(body);
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { success: false, message: 'Validation failed.', errors: validationErrors },
      { status: 422 }
    );
  }

  /* ── Step 3: Sanitize ─────────────────────────────────────────── */
  const data = {
    name:    sanitize(body.name),
    email:   sanitize(body.email).toLowerCase(),
    subject: body.subject ? sanitize(body.subject) : '',
    message: sanitize(body.message),
  };

  /* ── Step 4: Ensure DB schema exists (once per process) ────────── */
  try {
    if (!schemaReady) {
      await initSchema();
      schemaReady = true;
    }
  } catch (err) {
    // Log the full error server-side for debugging; never send details to client
    console.error('[contact/route] DB schema init failed:', err.message);
    console.error('[contact/route] Hint: check DATABASE_URL is set correctly in Vercel env vars.');
    return NextResponse.json(
      { success: false, message: 'Database unavailable. Please try again later.' },
      { status: 503 }
    );
  }

  /* ── Step 5: Insert into PostgreSQL ─────────────────────────────
     Parameterized query — values are passed separately, never
     interpolated into the SQL string, so SQL injection is impossible.
  ─────────────────────────────────────────────────────────────────── */
  let insertedRow;
  try {
    const sql = `
      INSERT INTO contacts (full_name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at
    `;
    const result = await query(sql, [
      data.name,
      data.email,
      data.subject || null,  // store NULL for empty subject
      data.message,
    ]);

    insertedRow = result.rows[0];
    console.log(
      `[contact/route] Saved submission id=${insertedRow.id} ` +
      `from ${data.email} at ${insertedRow.created_at}`
    );
  } catch (err) {
    console.error('[contact/route] DB insert failed:', err.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save your submission. Please try again later.',
      },
      { status: 500 }
    );
  }

  /* ── Step 6: Send emails (only after successful DB insert) ──────── */
  const { FROM_EMAIL, OWNER_EMAIL } = process.env;

  if (!FROM_EMAIL || !OWNER_EMAIL) {
    /* DB record is already saved — warn but don't block the response */
    console.error('[contact/route] Missing FROM_EMAIL or OWNER_EMAIL — emails not sent.');
    return NextResponse.json(
      {
        success: true,
        message: 'Your message was received, but email notification failed. I\'ll check the database.',
        id: insertedRow.id,
      },
      { status: 200 }
    );
  }

  try {
    const ownerTpl   = ownerNotification(data);
    const visitorTpl = visitorConfirmation(data);

    /* Both emails sent in parallel for speed */
    await Promise.all([
      sendMail({
        from:    `"Portfolio Contact" <${FROM_EMAIL}>`,
        to:      OWNER_EMAIL,
        replyTo: data.email,
        subject: ownerTpl.subject,
        html:    ownerTpl.html,
        text:    ownerTpl.text,
      }),
      sendMail({
        from:    `"Ananya Raj" <${FROM_EMAIL}>`,
        to:      data.email,
        subject: visitorTpl.subject,
        html:    visitorTpl.html,
        text:    visitorTpl.text,
      }),
    ]);

    console.log(`[contact/route] Emails sent for submission id=${insertedRow.id}`);
  } catch (err) {
    /*
     * DB insert already succeeded — the message is NOT lost.
     * Log the SMTP failure but return partial success to the frontend
     * so the user isn't confused.
     */
    console.error('[contact/route] SMTP failed (record saved):', err.message);
    return NextResponse.json(
      {
        success: true,
        message:
          'Your message was saved! Email delivery had a hiccup — ' +
          'I\'ll still see your submission and get back to you.',
        id: insertedRow.id,
      },
      { status: 200 }
    );
  }

  /* ── Step 7: Full success ───────────────────────────────────────── */
  return NextResponse.json(
    {
      success: true,
      message: 'Message sent successfully! Check your inbox for a confirmation email.',
      id: insertedRow.id,
    },
    { status: 200 }
  );
}

/* ── Reject all other HTTP methods ──────────────────────────────── */
export function GET()    { return _methodNotAllowed(); }
export function PUT()    { return _methodNotAllowed(); }
export function PATCH()  { return _methodNotAllowed(); }
export function DELETE() { return _methodNotAllowed(); }

function _methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed.' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
