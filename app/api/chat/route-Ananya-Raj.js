/**
 * app/api/chat/route.js
 *
 * POST /api/chat
 *
 * Calls Google Gemini via the @google/genai SDK.
 *
 * Auth priority:
 *   1. training.json service account  →  exchanges private key for an
 *      OAuth2 bearer token which is used as httpOptions.headers
 *   2. GEMINI_API_KEY in .env.local   →  plain API-key auth (fallback)
 *
 * The credentials NEVER reach the browser — this file is server-only.
 *
 * Request body : { message: string, history: Array<{role,text}> }
 * Response     : { reply: string, navigate: string|null }
 */

import { NextResponse } from 'next/server';
import { GoogleGenAI }  from '@google/genai';
import { JWT }          from 'google-auth-library';
import { readFileSync } from 'fs';
import { resolve }      from 'path';

/* ── Load service-account key (best-effort) ─────────────────────── */
let SA = null;
try {
  SA = JSON.parse(readFileSync(resolve(process.cwd(), 'training.json'), 'utf-8'));
} catch {
  /* File absent → will use GEMINI_API_KEY instead */
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
  /* ── Option A: service account bearer token ── */
  const jwt = getJWT();
  if (jwt) {
    try {
      const { token } = await jwt.getAccessToken();
      if (token) {
        /*
         * The @google/genai SDK accepts an arbitrary API key string.
         * When we pass a short-lived OAuth2 bearer token here the SDK
         * sends it as  x-goog-api-key: <token>  which Gemini's
         * generativelanguage.googleapis.com endpoint honours.
         * We pin the endpoint explicitly so it goes to the Developer
         * API (not Vertex AI which needs a separate quota enablement).
         */
        return new GoogleGenAI({
          apiKey: token,
          httpOptions: {
            baseUrl: 'https://generativelanguage.googleapis.com',
          },
        });
      }
    } catch (e) {
      console.warn('[chat] SA token error – falling back to API key:', e.message);
    }
  }

  /* ── Option B: plain API key ── */
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    throw new Error(
      'No Gemini credentials available. ' +
      'Add a valid GEMINI_API_KEY to .env.local or fix training.json.'
    );
  }
  return new GoogleGenAI({ apiKey: key });
}

/* ── Gemini model to use ────────────────────────────────────────── */
const MODEL = 'gemini-2.0-flash';

/* ── System prompt — Annu's full knowledge base ────────────────── */
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
- Full Stack Developer with around 1 year of hands-on experience
- Specialises in React, Next.js, Node.js, PostgreSQL, MongoDB
- Education: B.Tech. Computer Science, 2026 (currently pursuing)
- Location: Kolkata, West Bengal, India
- GitHub: https://github.com/ananyar148
- Email: ananyar@steorasystems.com
- Languages: English, Hindi, Maithli
- Goal: Build impactful, accessible products
- Open to full-time roles and freelance opportunities

SKILLS:
- Frontend: HTML5, CSS3, JavaScript, React, Next.js, Tailwind CSS
- Backend: Node.js, Express.js
- Databases: MongoDB, PostgreSQL, MySQL
- Tools: Git, GitHub, VS Code, Postman, Figma, SQL

PROJECTS (all on GitHub at https://github.com/AnanyaRaj14):
1. Blog App – Full Stack | React, Node.js, MongoDB, Express.js, JWT
   GitHub: https://github.com/AnanyaRaj14/Blog-App
2. Job Portal – Full Stack | React, Node.js, PostgreSQL, Express.js, Tailwind CSS
   GitHub: https://github.com/AnanyaRaj14/Job_Portal
3. Pixel Bazar – Image gallery | React, Unsplash API, CSS Modules, JavaScript
   GitHub: https://github.com/AnanyaRaj14
4. Todo App – Frontend | React, CSS, JavaScript, LocalStorage
   GitHub: https://github.com/AnanyaRaj14/react-todo
5. BG Colour Changer – Frontend | HTML, CSS, JavaScript
   GitHub: https://github.com/AnanyaRaj14/react_bgcolor
6. Digital Clock – Frontend | HTML, CSS, JavaScript
   GitHub: https://github.com/AnanyaRaj14/Digital-Clock

EXPERIENCE:
1. Jr. Web Developer @ Lamda Infotech Pvt. Ltd., Kolkata (Dec 2025 – Feb 2026)
   - Built responsive web pages and forms for student admission and school information systems
   - Applied form validation, error handling, and navigation improvements to reduce user-facing errors
   - Executed SQL database operations to store and retrieve application data
   - Collaborated with senior developers on code reviews and features
   Tech: HTML, CSS, JavaScript, SQL, PHP

2. Freelance Frontend Developer (Jun 2024 – Nov 2024, Remote)
   - Built a Google Form-based client data collection and notification system
   - Connected form submissions to a database for persistent storage
   - Implemented automated email notifications sent to both client and business owner on every submission
   Tech: Google Forms, Google Sheets, Apps Script, Email Automation

SITE PAGES:
- Home: /
- About (bio + skills): /about
- Projects + Experience: /projects
- Contact form: /contact

When the visitor asks to navigate somewhere, confirm you are redirecting them
and keep your reply to one sentence.
`.trim();

/* ── Navigation intent detection (no AI needed) ─────────────────── */
const NAV_PATTERNS = [
  { re: /\b(home|start|landing|main page|go back)\b/i,               route: '/'         },
  { re: /\b(about|who is|her background|about page)\b/i,             route: '/about'    },
  { re: /\b(project|work|portfolio|built|show me|what.*built)\b/i,   route: '/projects' },
  { re: /\b(contact|reach|hire|get in touch|email her)\b/i,          route: '/contact'  },
];

const NAV_VERB = /\b(go to|take me|show me|open|navigate|visit|redirect|see|yes|sure|ok|okay|yep|yup|please|do it)\b/i;

function detectNav(msg) {
  const hasVerb = NAV_VERB.test(msg);
  const isShort = msg.trim().split(/\s+/).length <= 4;
  if (!hasVerb && !isShort) return null;
  for (const { re, route } of NAV_PATTERNS) {
    if (re.test(msg)) return route;
  }
  return null;
}

/* ── Fallback: extract route from Gemini's reply text ───────────── */
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

    /* Build Gemini history: user/model turns only */
    const geminiHistory = history
      .filter((m) => m.role === 'user' || m.role === 'model')
      .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

    /* Create multi-turn chat session */
    const chat = ai.chats.create({
      model:  MODEL,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens:   512,
        temperature:       0.7,
      },
      history: geminiHistory,
    });

    /* Send message and get reply */
    const response = await chat.sendMessage({ message: message.trim() });
    const reply    = response.text?.trim()
      ?? "I'm sorry, I couldn't generate a response right now.";

    /* Use detectNav result, or fall back to scanning Gemini's reply */
    const finalNavigate = navigate ?? detectNavFromReply(reply);

    return NextResponse.json({ reply, navigate: finalNavigate }, { status: 200 });

  } catch (err) {
    console.error('[chat/route] Gemini error:', err?.message ?? err);

    return NextResponse.json(
      {
        reply:
          `I'm having a little trouble connecting right now. 🤔\n\n` +
          `You can ask me about Ananya's **skills**, **projects**, **experience**, ` +
          `or say *"take me to projects"* to navigate the site!`,
        navigate,
        error: true,
      },
      { status: 200 }   // always 200 so the UI shows the fallback gracefully
    );
  }
}

export function GET()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export function PUT()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export function DELETE() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
