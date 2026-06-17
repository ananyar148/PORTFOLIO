/**
 * app/api/contact/route.js
 *
 * POST  /api/contact
 *
 * Accepts a JSON body, validates + sanitizes inputs, sends two emails
 * via Nodemailer (owner notification + visitor confirmation), and
 * returns a JSON response with an appropriate HTTP status code.
 *
 * Security measures:
 *   • Server-side validation (never trust the client)
 *   • Input sanitization (strip HTML tags, trim whitespace)
 *   • Only POST is accepted; all other methods return 405
 *   • SMTP credentials live in env vars — never reach the client
 *   • Errors are logged server-side but only generic messages reach the client
 *   • No sensitive data is written to the response body
 */

import { NextResponse }          from 'next/server';
import { sendMail }              from '@/lib/mailer';
import { ownerNotification,
         visitorConfirmation }   from '@/lib/emailTemplates';

/* ── Constants ─────────────────────────────────────────────────── */
const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN   = 100;
const MAX_SUBJECT_LEN = 200;
const MAX_MSG_LEN    = 5000;

/* ── Sanitize: strip HTML tags and trim whitespace ──────────────── */
function sanitize(str) {
  return String(str)
    .replace(/<[^>]*>/g, '')   // remove any HTML tags
    .replace(/[\u0000-\u001F\u007F]/g, '') // strip control chars
    .trim();
}

/* ── Field-level validation ─────────────────────────────────────── */
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

/* ── Route handler ──────────────────────────────────────────────── */
export async function POST(request) {
  /* 1. Parse JSON body */
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  /* 2. Validate */
  const validationErrors = validateBody(body);
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { success: false, message: 'Validation failed.', errors: validationErrors },
      { status: 422 }
    );
  }

  /* 3. Sanitize */
  const data = {
    name:    sanitize(body.name),
    email:   sanitize(body.email).toLowerCase(),
    subject: body.subject ? sanitize(body.subject) : '',
    message: sanitize(body.message),
  };

  /* 4. Check required env vars */
  const { FROM_EMAIL, OWNER_EMAIL } = process.env;
  if (!FROM_EMAIL || !OWNER_EMAIL) {
    console.error('[contact/route] Missing FROM_EMAIL or OWNER_EMAIL env vars.');
    return NextResponse.json(
      { success: false, message: 'Server configuration error. Please try again later.' },
      { status: 500 }
    );
  }

  /* 5. Send both emails */
  try {
    const ownerTpl   = ownerNotification(data);
    const visitorTpl = visitorConfirmation(data);

    /* Run in parallel — if one fails, Promise.all rejects and we catch below */
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

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (err) {
    /* Log the real error server-side only */
    console.error('[contact/route] Failed to send email:', err?.message ?? err);

    return NextResponse.json(
      {
        success: false,
        message:
          'Failed to send your message. Please try again later or email me directly.',
      },
      { status: 500 }
    );
  }
}

/* Reject every other HTTP method cleanly */
export function GET()    { return methodNotAllowed(); }
export function PUT()    { return methodNotAllowed(); }
export function PATCH()  { return methodNotAllowed(); }
export function DELETE() { return methodNotAllowed(); }

function methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed.' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
