/**
 * app/api/chat/route.js
 *
 * POST /api/chat
 *
 * Calls Gemini via the @google/genai SDK in Vertex AI mode (global region).
 * Service-account credentials are read from training.json — bearer-token auth
 * is handled entirely server-side; nothing sensitive reaches the browser.
 *
 * Request body : { message: string, history: Array<{role,text}> }
 * Response     : { reply: string, navigate: string|null }
 */

import { NextResponse } from 'next/server';
import { GoogleGenAI }  from '@google/genai';
import { JWT }          from 'google-auth-library';
import { readFileSync } from 'fs';
import { resolve }      from 'path';

/* ── Load service-account key ───────────────────────────────────── */
let SA = null;
try {
  SA = JSON.parse(readFileSync(resolve(process.cwd(), 'training.json'), 'utf-8'));
  console.log('[chat/route] ✓ training.json loaded, project:', SA.project_id);
} catch (err) {
  console.warn('[chat/route] training.json not found:', err.message);
}

const PROJECT_ID = SA?.project_id ?? process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION   = 'global';           // always global region per requirement

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

/* ── Build a GoogleGenAI instance ───────────────────────────────── */
async function buildGenAI() {
  /* Option A — service account: get a bearer token and inject it */
  const jwt = getJWT();
  if (jwt && PROJECT_ID) {
    try {
      const { token } = await jwt.getAccessToken();
      if (token) {
        /*
         * Vertex AI mode sends the token correctly as:
         *   Authorization: Bearer <token>
         * rather than x-goog-api-key, which is what caused the 400.
         */
        return new GoogleGenAI({
          vertexai:  true,
          project:   PROJECT_ID,
          location:  LOCATION,
          googleAuthOptions: {
            authClient: jwt,
          },
        });
      }
    } catch (e) {
      console.warn('[chat/route] SA token error – falling back to API key:', e.message);
    }
  }

  /* Option B — plain Gemini API key (fallback) */
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    throw new Error(
      'No Gemini credentials available. ' +
      'Ensure training.json is present and valid, or set GEMINI_API_KEY in .env.local.'
    );
  }
  console.log('[chat/route] Using GEMINI_API_KEY (Developer API)');
  return new GoogleGenAI({ apiKey: key });
}

/* ── Model ──────────────────────────────────────────────────────── */
const MODEL = 'gemini-2.5-flash';

/* ── System prompt ──────────────────────────────────────────────── */
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

/* ── Navigation intent detection ────────────────────────────────── */
const NAV_PATTERNS = [
  { re: /\b(home|start|landing|main page|go back)\b/i,               route: '/'         },
  { re: /\b(about|who is|her background|about page)\b/i,             route: '/about'    },
  { re: /\b(project|work|portfolio|built|show me|what.*built)\b/i,   route: '/projects' },
  { re: /\b(contact|reach|hire|get in touch|email her)\b/i,          route: '/contact'  },
];

/* Verbs that signal navigation intent */
const NAV_VERB = /\b(go to|take me|show me|open|navigate|visit|redirect|see|yes|sure|ok|okay|yep|yup|please|do it)\b/i;

function detectNav(msg) {
  /* Check if message contains a nav verb OR is a short confirmation */
  const hasVerb     = NAV_VERB.test(msg);
  const isShort     = msg.trim().split(/\s+/).length <= 4;
  if (!hasVerb && !isShort) return null;

  for (const { re, route } of NAV_PATTERNS) {
    if (re.test(msg)) return route;
  }
  return null;
}

/* ── Fallback: extract route from Gemini's reply text ───────────── */
/* If detectNav returned null but Gemini says "redirecting to X", trust it */
function detectNavFromReply(reply) {
  const r = reply.toLowerCase();
  if (/project|portfolio|built|work/i.test(r) && /redirect|taking|navigat|going|heading/i.test(r)) return '/projects';
  if (/about|bio|skill|background/i.test(r)    && /redirect|taking|navigat|going|heading/i.test(r)) return '/about';
  if (/contact|reach|hire|touch/i.test(r)      && /redirect|taking|navigat|going|heading/i.test(r)) return '/contact';
  if (/home|landing|main/i.test(r)             && /redirect|taking|navigat|going|heading/i.test(r)) return '/';
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

    /* Build history: user/model turns only */
    const geminiHistory = history
      .filter((m) => m.role === 'user' || m.role === 'model')
      .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

    /* Multi-turn chat session */
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
      { status: 200 }
    );
  }
}

export function GET()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export function PUT()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export function DELETE() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
