/**
 * lib/emailTemplates.js
 *
 * Pure functions that return { subject, html, text } objects.
 * No framework / DOM dependency — safe to import from server-only code.
 *
 * Two templates:
 *   ownerNotification  — sent to OWNER_EMAIL when a visitor submits the form
 *   visitorConfirmation — sent to the visitor as an auto-reply
 */

/* ── Shared brand colours ────────────────────────────────────────── */
const ACCENT      = '#60A5FA'; // indigo-400 (matches the portfolio dark theme)
const ACCENT_DARK = '#3B82F6'; // indigo-500

/* ── Shared inline-CSS helpers ──────────────────────────────────── */
const base = `
  font-family: 'Segoe UI', Arial, sans-serif;
  line-height: 1.6;
  color: #1e1b4b;
`;

const container = `
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
`;

const header = `
  background: linear-gradient(135deg, ${ACCENT_DARK} 0%, #06B6D4 100%);
  padding: 40px 40px 32px;
  text-align: center;
`;

const body = `
  padding: 40px;
`;

const footer = `
  background: #f8fafc;
  padding: 24px 40px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
`;

const badge = (text) => `
  <span style="
    display:inline-block;
    background:${ACCENT};
    color:#fff;
    font-size:11px;
    font-weight:700;
    letter-spacing:0.08em;
    text-transform:uppercase;
    padding:4px 12px;
    border-radius:999px;
    margin-bottom:16px;
  ">${text}</span>
`;

const divider = `<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">`;

const infoRow = (label, value) => `
  <tr>
    <td style="padding:8px 12px;font-size:13px;font-weight:600;
               color:#475569;white-space:nowrap;vertical-align:top;
               width:110px;">${label}</td>
    <td style="padding:8px 12px;font-size:14px;color:#1e293b;
               vertical-align:top;">${value}</td>
  </tr>
`;

/* ════════════════════════════════════════════════════════════════════
   1. Owner notification email
   ════════════════════════════════════════════════════════════════════ */

/**
 * @param {{ name: string, email: string, subject: string, message: string }} data
 * @returns {{ subject: string, html: string, text: string }}
 */
export function ownerNotification({ name, email, subject, message }) {
  const submittedAt = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZoneName: 'short',
  });

  const safeMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f1f5f9;${base}">
  <div style="${container}">

    <!-- Header -->
    <div style="${header}">
      ${badge('New Contact')}
      <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;line-height:1.2;">
        New Portfolio Message
      </h1>
      <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.85);">
        Someone reached out through your contact form
      </p>
    </div>

    <!-- Body -->
    <div style="${body}">
      <p style="font-size:16px;margin:0 0 24px;color:#334155;">
        Hi Ananya,<br><br>
        You've received a new message from your portfolio website.
        Here are the details:
      </p>

      <!-- Info table -->
      <div style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;
                  overflow:hidden;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${infoRow('From', `<strong>${name}</strong>`)}
            ${infoRow('Email', `<a href="mailto:${email}" style="color:${ACCENT_DARK};">${email}</a>`)}
            ${infoRow('Subject', subject || '<em style="color:#94a3b8;">No subject</em>')}
            ${infoRow('Sent', submittedAt)}
          </tbody>
        </table>
      </div>

      <!-- Message -->
      <p style="font-size:13px;font-weight:700;text-transform:uppercase;
                letter-spacing:0.08em;color:#64748b;margin:0 0 10px;">
        Message
      </p>
      <div style="background:#f8fafc;border-left:4px solid ${ACCENT_DARK};
                  padding:20px 24px;border-radius:0 12px 12px 0;
                  font-size:15px;color:#1e293b;line-height:1.7;">
        ${safeMessage}
      </div>

      ${divider}

      <!-- Reply CTA -->
      <div style="text-align:center;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your portfolio message')}"
           style="display:inline-block;background:linear-gradient(135deg,${ACCENT_DARK} 0%,#06B6D4 100%);
                  color:#fff;text-decoration:none;font-weight:700;font-size:14px;
                  padding:14px 36px;border-radius:999px;
                  box-shadow:0 4px 16px rgba(59,130,246,0.35);">
          ✉️ Reply to ${name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="${footer}">
      This email was sent automatically from your portfolio contact form.<br>
      ananyar148 · github.com/ananyar148
    </div>

  </div>
</body>
</html>`;

  const text = [
    `NEW PORTFOLIO MESSAGE`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `From:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject || '(none)'}`,
    `Sent:    ${submittedAt}`,
    ``,
    `Message:`,
    message,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `Reply: mailto:${email}`,
  ].join('\n');

  return {
    subject: `New Portfolio Contact: ${name}`,
    html,
    text,
  };
}

/* ════════════════════════════════════════════════════════════════════
   2. Visitor auto-reply / confirmation email
   ════════════════════════════════════════════════════════════════════ */

/**
 * @param {{ name: string, email: string, subject: string, message: string }} data
 * @returns {{ subject: string, html: string, text: string }}
 */
export function visitorConfirmation({ name, email, subject, message }) {
  const firstName = name.split(' ')[0];

  const safeMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f1f5f9;${base}">
  <div style="${container}">

    <!-- Header -->
    <div style="${header}">
      ${badge('Message Received')}
      <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;line-height:1.2;">
        Thanks for reaching out!
      </h1>
      <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.85);">
        I'll get back to you as soon as possible
      </p>
    </div>

    <!-- Body -->
    <div style="${body}">
      <p style="font-size:16px;margin:0 0 20px;color:#334155;">
        Hi <strong>${firstName}</strong> 👋
      </p>
      <p style="font-size:15px;margin:0 0 16px;color:#475569;line-height:1.75;">
        Thank you for getting in touch through my portfolio!
        I've received your message and will do my best to respond within
        <strong style="color:#1e293b;">1–2 business days</strong>.
      </p>
      <p style="font-size:15px;margin:0 0 28px;color:#475569;line-height:1.75;">
        In the meantime, feel free to check out my projects on
        <a href="https://github.com/ananyar148" style="color:${ACCENT_DARK};font-weight:600;">
          GitHub
        </a>.
      </p>

      <!-- Message summary -->
      <div style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;
                  padding:24px;margin-bottom:28px;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:700;
                  text-transform:uppercase;letter-spacing:0.08em;color:#64748b;">
          Your message summary
        </p>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${infoRow('Subject', subject || '<em style="color:#94a3b8;">No subject</em>')}
          </tbody>
        </table>
        ${divider}
        <div style="font-size:14px;color:#475569;line-height:1.75;
                    border-left:3px solid ${ACCENT};padding-left:16px;">
          ${safeMessage}
        </div>
      </div>

      ${divider}

      <!-- Signature -->
      <table style="width:100%;">
        <tr>
          <td style="vertical-align:top;">
            <p style="margin:0;font-size:15px;font-weight:700;color:#1e293b;">
              Ananya Raj
            </p>
            <p style="margin:4px 0 0;font-size:13px;color:#64748b;">
              Full Stack Developer
            </p>
            <a href="https://github.com/ananyar148"
               style="font-size:13px;color:${ACCENT_DARK};text-decoration:none;">
              github.com/ananyar148
            </a>
          </td>
          <td style="text-align:right;vertical-align:top;">
            <span style="
              font-size:13px;font-weight:800;
              background:linear-gradient(135deg,${ACCENT_DARK} 0%,#06B6D4 100%);
              -webkit-background-clip:text;
              -webkit-text-fill-color:transparent;
            ">&lt;Ananya Raj /&gt;</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="${footer}">
      You're receiving this because you contacted Ananya Raj via her portfolio.<br>
      Please do not reply directly to this auto-reply email.
    </div>

  </div>
</body>
</html>`;

  const text = [
    `Hi ${firstName},`,
    ``,
    `Thanks for reaching out! I've received your message and will get back to`,
    `you within 1–2 business days.`,
    ``,
    `Your message summary`,
    `────────────────────`,
    `Subject: ${subject || '(none)'}`,
    ``,
    message,
    ``,
    `────────────────────`,
    `Best,`,
    `Ananya Raj`,
    `Full Stack Developer`,
    `github.com/ananyar148`,
    ``,
    `(This is an automated confirmation — please don't reply to this email.)`,
  ].join('\n');

  return {
    subject: `Got your message, ${firstName}! ✨`,
    html,
    text,
  };
}
