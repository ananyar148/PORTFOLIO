/**
 * app/api/chat/route.js
 *
 * POST /api/chat
 *
 * Calls Google Gemini via the @google/genai SDK using a service-account
 * bearer token (Vertex AI credentials, Developer API endpoint).
 *
 * Credential loading priority:
 *   1. GOOGLE_SERVICE_ACCOUNT_JSON env var  — base64-encoded JSON
 *      (used in production / Vercel where the file cannot be deployed)
 *   2. training.json on disk                — local development only
 *
 * The credentials NEVER reach the browser — server-only.
 *
 * Request body : { message: string, history: Array<{role,text}> }
 * Response     : { reply: string, navigate: string|null }
 */

import { NextResponse } from 'next/server';
import { GoogleGenAI }  from '@google/genai';
import { JWT }          from 'google-auth-library';
import { readFileSync } from 'fs';
import { resolve }      from 'path';
import { resolveIntent } from '@/lib/chatbotLogic';
import { PROFILE, SKILLS, PROJECTS, EXPERIENCE } from '@/lib/chatData';

/* ── Load service-account key ───────────────────────────────────── */
let SA = null;
const _b64EnvVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
console.log('[chat/route] GOOGLE_SERVICE_ACCOUNT_JSON present:', !!_b64EnvVar, '| length:', _b64EnvVar?.length ?? 0);

try {
  if (_b64EnvVar) {
    SA = JSON.parse(Buffer.from(_b64EnvVar.trim(), 'base64').toString('utf-8'));
    console.log('[chat/route] ✓ SA loaded from env var, project:', SA.project_id);
  } else {
    SA = JSON.parse(readFileSync(resolve(process.cwd(), 'training.json'), 'utf-8'));
    console.log('[chat/route] ✓ training.json loaded, project:', SA.project_id);
  }
} catch (err) {
  console.error('[chat/route] SA load failed:', err.message);
}

/* ── Lazy JWT client ────────────────────────────────────────────── */
let _jwt = null;
function getJWT() {
  if (!SA) return null;
  if (!_jwt) {
    _jwt = new JWT({
      email:  SA.client_email,
      key:    SA.private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
  }
  return _jwt;
}

/* ── Build an authenticated GoogleGenAI instance ───────────────── */
async function buildGenAI() {
  const jwt = getJWT();
  if (jwt) {
    try {
      /*
       * Use Vertex AI mode — this sends credentials as
       * "Authorization: Bearer <token>" which the Vertex AI
       * endpoint accepts. The authClient handles token refresh automatically.
       */
      const PROJECT_ID = SA.project_id ?? process.env.GOOGLE_CLOUD_PROJECT;
      return new GoogleGenAI({
        vertexai:  true,
        project:   PROJECT_ID,
        location:  'us-central1',
        googleAuthOptions: {
          authClient: jwt,
        },
      });
    } catch (e) {
      console.warn('[chat/route] Vertex AI setup error:', e.message);
    }
  }

  throw new Error(
    'No Gemini credentials available. ' +
    'Set GOOGLE_SERVICE_ACCOUNT_JSON in your deployment environment variables.'
  );
}

/* ── Model ──────────────────────────────────────────────────────── */
const MODEL = 'gemini-2.5-flash';

/* ── System prompt — built from chatData.js (single source of truth) ── */
const SYSTEM_INSTRUCTION = `
You are "Annu", a friendly and professional virtual assistant embedded in
Ananya Raj's developer portfolio website. Help visitors learn about Ananya
and navigate the site.

PERSONALITY:
- Warm, concise, conversational — never robotic
- Use emojis sparingly for friendliness
- Keep answers under 150 words unless the visitor asks for detail
- Only answer questions related to Ananya's portfolio and work
- For off-topic questions politely say you only know about Ananya's work

ABOUT ANANYA RAJ:
- Name: ${PROFILE.name}
- Title: ${PROFILE.title}
- Email: ${PROFILE.email}
- GitHub: ${PROFILE.github}
- LinkedIn: ${PROFILE.linkedin}
- Location: ${PROFILE.location}
- Education: ${PROFILE.education}
- Bio: ${PROFILE.bio}

SKILLS:
- Frontend: ${SKILLS.frontend.join(', ')}
- Backend: ${SKILLS.backend.join(', ')}
- Databases: ${SKILLS.databases.join(', ')}
- Tools: ${SKILLS.tools.join(', ')}

PROJECTS:
${PROJECTS.map((p, i) => `${i + 1}. ${p.name} — ${p.desc}\n   Stack: ${p.stack.join(', ')}\n   GitHub: ${p.github}`).join('\n')}

EXPERIENCE:
${EXPERIENCE.map((e, i) => `${i + 1}. ${e.role} @ ${e.company} (${e.duration})\n   ${e.summary}`).join('\n\n')}

SITE PAGES:
- Home: /
- About (bio + skills): /about
- Projects + Experience: /projects
- Contact form: /contact

When the visitor asks to navigate somewhere, confirm you are redirecting them
and keep your reply to one sentence.
`.trim();

/* ── Navigation intent detection ────────────────────────────────── */
const NAV_PATTERNS = [
  { re: /\b(home|start|landing|main page|go back)\b/i,               route: '/'         },
  { re: /\b(about|who is|her background|about page)\b/i,             route: '/about'    },
  { re: /\b(project|work|portfolio|built|show me|what.*built)\b/i,   route: '/projects' },
  { re: /\b(contact|reach|hire|get in touch|email her)\b/i,          route: '/contact'  },
];

const NAV_VERB = /\b(go to|take me|show me|open|navigate|visit|redirect|see|yes|sure|ok|okay|yep|yup|please|do it)\b/i;

/* Phrases that indicate the user wants information, NOT navigation */
const INFO_PHRASES = /\b(tell me|what is|who is|show me|explain|describe|list|what are|how|about ananya|her skills|her projects|her experience)\b/i;

function detectNav(msg) {
  /* If it looks like an info request, never navigate */
  if (INFO_PHRASES.test(msg)) return null;

  const hasVerb = NAV_VERB.test(msg);
  const isShort = msg.trim().split(/\s+/).length <= 3;   // tightened: 3 words max for short-form nav
  if (!hasVerb && !isShort) return null;
  for (const { re, route } of NAV_PATTERNS) {
    if (re.test(msg)) return route;
  }
  return null;
}

function detectNavFromReply(reply) {
  const r = reply.toLowerCase();
  if (/project|portfolio|built|work/i.test(r) && /redirect|taking|navigat|going|heading/i.test(r)) return '/projects';
  if (/about|bio|skill|background/i.test(r)   && /redirect|taking|navigat|going|heading/i.test(r)) return '/about';
  if (/contact|reach|hire|touch/i.test(r)     && /redirect|taking|navigat|going|heading/i.test(r)) return '/contact';
  if (/home|landing|main/i.test(r)            && /redirect|taking|navigat|going|heading/i.test(r)) return '/';
  return null;
}

/* ── POST handler ───────────────────────────────────────────────── */
export async function POST(request) {

  /* 1. Parse body */
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { message, history = [] } = body;
  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  /* 2. Fast navigation check */
  const navigate = detectNav(message);

  /* 3. Call Gemini */
  try {
    const ai = await buildGenAI();

    const geminiHistory = history
      .filter((m) => m.role === 'user' || m.role === 'model')
      .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

    const chat = ai.chats.create({
      model:  MODEL,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens:   512,
        temperature:       0.7,
      },
      history: geminiHistory,
    });

    const response = await chat.sendMessage({ message: message.trim() });
    const reply    = response.text?.trim()
      ?? "I'm sorry, I couldn't generate a response right now.";

    const finalNavigate = navigate ?? detectNavFromReply(reply);

    return NextResponse.json({ reply, navigate: finalNavigate }, { status: 200 });

  } catch (err) {
    console.error('[chat/route] Gemini error:', err?.message ?? err);

    /* ── Fallback: local rule-based engine ── */
    try {
      const fallback = resolveIntent(message);
      return NextResponse.json(
        { reply: fallback.text, navigate: navigate ?? fallback.navigate ?? null },
        { status: 200 }
      );
    } catch (fallbackErr) {
      console.error('[chat/route] fallback error:', fallbackErr?.message);
    }

    return NextResponse.json(
      {
        reply:
          `I'm having a little trouble connecting right now. 🤔\n\n` +
          `You can ask me about Ananya's **skills**, **projects**, **experience**, ` +
          `or say *"take me to projects"* to navigate the site!`,
        navigate,
        error: true,
      },
      { status: 200 }
    );
  }
}

export function GET()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export function PUT()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export function DELETE() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
