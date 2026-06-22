/**
 * app/api/chat/route.js
 *
 * POST /api/chat
 *
 * Authentication strategy:
 *   - Uses training.json service account to obtain a Google OAuth2 access token
 *   - Falls back to GEMINI_API_KEY if Vertex AI is unavailable
 *   - Uses @google/genai SDK pointed at the Gemini Developer API endpoint
 *
 * The private key NEVER reaches the browser — server-side only.
 *
 * Body:  { message: string, history: Array<{role, text}> }
 * Reply: { reply: string, navigate: string|null }
 */

import { NextResponse }  from 'next/server';
import { GoogleGenAI }   from '@google/genai';
import { JWT }           from 'google-auth-library';
import { readFileSync }  from 'fs';
import { resolve }       from 'path';

/* ── Load service-account credentials ──────────────────────────── */
let CREDENTIALS = null;
try {
  CREDENTIALS = JSON.parse(
    readFileSync(resolve(process.cwd(), 'training.json'), 'utf-8')
  );
} catch {
  console.warn('[chat/route] training.json not found — will use GEMINI_API_KEY');
}

/* ── Auth scope needed for Vertex AI ───────────────────────────── */
const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];

/* Lazy singleton JWT client — used to get service-account access token */
let _jwtClient = null;
function getJWT() {
  if (!CREDENTIALS) return null;
  if (!_jwtClient) {
    _jwtClient = new JWT({
      email:  CREDENTIALS.client_email,
      key:    CREDENTIALS.private_key,
      scopes: SCOPES,
    });
  }
  return _jwtClient;
}

/**
 * Get an authenticated GoogleGenAI client.
 * Priority:
 *   1. Service account (training.json) → get access token → use as apiKey
 *   2. GEMINI_API_KEY env var
 */
async function getGenAI() {
  /* Try service account first */
  const jwt = getJWT();
  if (jwt) {
    try {
      const { token } = await jwt.getAccessToken();
      if (token) {
        /* Pass the OAuth2 bearer token via authClient pattern */
        return new GoogleGenAI({
          apiKey:       token,
          apiVersion:   'v1beta',
        });
      }
    } catch (e) {
      console.warn('[chat/route] Service account token failed, using API key:', e.message);
    }
  }

  /* Fallback: plain API key */
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('No valid auth: set GEMINI_API_KEY in .env.local or fix training.json');
  }
  return new GoogleGenAI({ apiKey });
}

/* ── System instruction — Annu's full knowledge base ───────────── */
const SYSTEM_INSTRUCTION = `
You are "Annu", a friendly and professional virtual assistant for Ananya Raj's
developer portfolio website. You help visitors learn about Ananya and navigate
the site. Be warm, concise, and helpful — never robotic. Keep answers under
150 words unless asked for more detail. Use emojis sparingly.

ABOUT ANANYA RAJ:
- Full Stack Developer with 3+ years of experience
- Specialises in React, Next.js, Node.js, PostgreSQL, MongoDB
- Education: B.Sc. Computer Science, 2023
- GitHub: https://github.com/ananyar148
- Email: ananya@email.com
- Currently open to full-time roles and freelance projects

SKILLS:
- Frontend: HTML5, CSS3, JavaScript, React, Next.js, Tailwind CSS
- Backend: Node.js, Express.js
- Databases: MongoDB, PostgreSQL, MySQL
- Tools: Git, GitHub, VS Code, Postman, Figma

PROJECTS:
1. E-Commerce Platform – Next.js, Node.js, MongoDB, Stripe payments, admin dashboard
2. Task Management App – React, PostgreSQL, Socket.io, drag-and-drop boards
3. AI Chat Interface – React, OpenAI API, streaming responses, multi-model support
4. REST API Boilerplate – Node.js, Express.js, PostgreSQL, JWT auth, Jest tests
5. Real-time Dashboard – Recharts, WebSocket, live data, CSV export
6. Developer Portfolio v1 – Vanilla HTML/CSS/JS first portfolio

EXPERIENCE:
- Junior Full Stack Developer @ TechCorp Solutions (Jan 2024–Present)
  Builds React dashboards and Node.js APIs for a SaaS product
- Freelance Frontend Developer (Jun–Dec 2023)
  Delivered 8 client projects with 100% satisfaction
- Open Source Contributor (2022–Present)
  120+ GitHub stars, PRs merged into popular libraries

PORTFOLIO PAGES:
- Home: /
- About (bio + skills): /about
- Projects + Experience: /projects
- Contact form: /contact

RULES:
- Only answer questions about Ananya's portfolio and work
- For unrelated questions, say you only know about Ananya's work
- When someone asks to navigate, confirm you're redirecting them
`.trim();

/* ── Navigation intent detector ────────────────────────────────── */
const NAV_PATTERNS = [
  { pattern: /\b(home|go back|landing|start page)\b/i,              route: '/'         },
  { pattern: /\b(about|who is|her background|about page)\b/i,       route: '/about'    },
  { pattern: /\b(project|work|portfolio|built|created|show work)\b/i, route: '/projects' },
  { pattern: /\b(contact|reach|hire|get in touch|email her)\b/i,    route: '/contact'  },
];

function detectNavigation(message) {
  const isNavRequest = /\b(go to|take me|show me|open|navigate|visit|redirect)\b/i.test(message);
  if (!isNavRequest) return null;
  for (const { pattern, route } of NAV_PATTERNS) {
    if (pattern.test(message)) return route;
  }
  return null;
}

/* ── Build Vertex AI request body ───────────────────────────────── */
function buildRequestBody(history, message) {
  /* Convert our history format → Vertex AI Content[] */
  const historyContents = history
    .filter((m) => m.role === 'user' || m.role === 'model')
    .map((m) => ({
      role:  m.role,
      parts: [{ text: m.text }],
    }));

  return {
    systemInstruction: {
      role:  'system',
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      ...historyContents,
      { role: 'user', parts: [{ text: message }] },
    ],
    generationConfig: {
      maxOutputTokens: 512,
      temperature:     0.7,
      topP:            0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };
}

/* ── POST handler ───────────────────────────────────────────────── */
export async function POST(request) {

  /* Parse body */
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { message, history = [] } = body;

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  /* Fast nav check — no AI needed */
  const navigate = detectNavigation(message);

  try {
    /* Get a fresh OAuth2 access token from the service account */
    const jwt         = getJWT();
    const tokenResult = await jwt.getAccessToken();
    const accessToken = tokenResult.token;

    if (!accessToken) {
      throw new Error('Failed to obtain access token from service account');
    }

    /* Call Vertex AI Gemini */
    const vertexRes = await fetch(VERTEX_URL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(buildRequestBody(history, message.trim())),
    });

    if (!vertexRes.ok) {
      const errBody = await vertexRes.text();
      console.error('[chat/route] Vertex AI error:', vertexRes.status, errBody);
      throw new Error(`Vertex AI returned ${vertexRes.status}`);
    }

    const data  = await vertexRes.json();

    /* Extract text from Vertex AI response structure */
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      ?? "I'm sorry, I couldn't generate a response right now.";

    return NextResponse.json({ reply, navigate }, { status: 200 });

  } catch (err) {
    console.error('[chat/route] Error:', err?.message ?? err);

    /* Graceful fallback — UI never breaks */
    return NextResponse.json(
      {
        reply:
          `I'm having a little trouble connecting to my AI brain right now. 🤔\n\n` +
          `You can still ask me about Ananya's **skills**, **projects**, or **experience**, ` +
          `or say *"take me to contact"* to navigate the site!`,
        navigate,
        error: true,
      },
      { status: 200 }
    );
  }
}

/* Reject other HTTP methods */
export function GET()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export function PUT()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export function DELETE() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
