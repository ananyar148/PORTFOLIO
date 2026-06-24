/**
 * app/api/chat/route.js
 *
 * POST /api/chat
 */

import { NextResponse } from 'next/server';
import { GoogleGenAI }  from '@google/genai';
import { JWT }          from 'google-auth-library';
import { readFileSync } from 'fs';
import { resolve }      from 'path';
import { resolveIntent } from '@/lib/chatbotLogic';
import { PROFILE, SKILLS, PROJECTS, EXPERIENCE } from '@/lib/chatData';

/* ── 1. Load Service Account Credentials ────────────────────────── */
let SA = null;
const b64EnvVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

try {
  if (b64EnvVar) {
    // Production: Decode Base64 string from environment variable
    SA = JSON.parse(Buffer.from(b64EnvVar.trim(), 'base64').toString('utf-8'));
  } else {
    // Local fallback: Read from training.json
    SA = JSON.parse(readFileSync(resolve(process.cwd(), 'training.json'), 'utf-8'));
  }
} catch (err) {
  console.error('[chat/route] SA load failed:', err.message);
}

/* ── 2. Lazy JWT Client ─────────────────────────────────────────── */
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

/* ── 3. Build Authenticated GoogleGenAI Instance ───────────────── */
async function buildGenAI() {
  const jwt = getJWT();
  if (jwt) {
    try {
      const { token } = await jwt.getAccessToken();
      if (token) {
        // Use Developer API (Free tier) with OAuth token to bypass Vertex AI billing
        return new GoogleGenAI({
          apiKey: token,
          httpOptions: {
            baseUrl: 'https://generativelanguage.googleapis.com',
          },
        });
      }
    } catch (e) {
      console.warn('[chat/route] SA token error – falling back to API key:', e.message);
    }
  }

  // Fallback to plain API key if SA fails or is missing
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    throw new Error(
      'No Gemini credentials available. ' +
      'Set GOOGLE_SERVICE_ACCOUNT_JSON or GEMINI_API_KEY in your deployment environment variables.'
    );
  }
  return new GoogleGenAI({ apiKey: key });
}

/* ── 4. Model and System Prompt ─────────────────────────────────── */
// const MODEL = 'gemini-2.0-flash';

// const SYSTEM_INSTRUCTION = `
// You are "Annu", a friendly and professional virtual assistant embedded in
// Ananya Raj's developer portfolio website. Help visitors learn about Ananya
// and navigate the site.

// PERSONALITY:
// - Warm, concise, conversational — never robotic
// - Use emojis sparingly for friendliness
// - Keep answers under 150 words unless the visitor asks for detail
// - Only answer questions related to Ananya's portfolio and work
// - For off-topic questions politely say you only know about Ananya's work

// ABOUT ANANYA RAJ:
// - Name: ${PROFILE.name}
// - Title: ${PROFILE.title}
// - Email: ${PROFILE.email}
// - GitHub: ${PROFILE.github}
// - LinkedIn: ${PROFILE.linkedin}
// - Location: ${PROFILE.location}
// - Education: ${PROFILE.education}
// - Bio: ${PROFILE.bio}

// SKILLS:
// - Frontend: ${SKILLS.frontend.join(', ')}
// - Backend: ${SKILLS.backend.join(', ')}
// - Databases: ${SKILLS.databases.join(', ')}
// - Tools: ${SKILLS.tools.join(', ')}

// PROJECTS:
// ${PROJECTS.map((p, i) => `${i + 1}. ${p.name} — ${p.desc}\n   Stack: ${p.stack.join(', ')}\n   GitHub: ${p.github}`).join('\n')}

// EXPERIENCE:
// ${EXPERIENCE.map((e, i) => `${i + 1}. ${e.role} @ ${e.company} (${e.duration})\n   ${e.summary}`).join('\n\n')}

// SITE PAGES:
// - Home: /
// - About (bio + skills): /about
// - Projects + Experience: /projects
// - Contact form: /contact

// When the visitor asks to navigate somewhere, confirm you are redirecting them
// and keep your reply to one sentence.
// `.trim();

/* ── 4. Model and System Prompt ─────────────────────────────────── */
const MODEL = 'gemini-2.0-flash';

const SYSTEM_INSTRUCTION = `
You are "Annu", a friendly and professional virtual assistant embedded in
Ananya Raj's developer portfolio website. Help visitors learn about Ananya
and navigate the site.

CRITICAL RULES:
1. UNDER NO CIRCUMSTANCES should you invent, hallucinate, or make up any details about Ananya's experience, projects, or education.
2. ONLY use the exact information provided below. Do not mention generic companies like "TechCorp".
3. If a user asks something not covered in the data below, politely say you only know about the specific projects and experience listed on her portfolio.
4. Keep answers conversational but strictly factual. Keep it under 150 words.

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

PROJECTS (ONLY MENTION THESE):
${PROJECTS.map((p, i) => `${i + 1}. ${p.name} — ${p.desc}\n   Stack: ${p.stack.join(', ')}\n   GitHub: ${p.github}`).join('\n')}

EXPERIENCE (ONLY MENTION THESE):
${EXPERIENCE.map((e, i) => `${i + 1}. ${e.role} @ ${e.company} (${e.duration})\n   ${e.summary}`).join('\n\n')}

SITE PAGES:
- Home: /
- About (bio + skills): /about
- Projects + Experience: /projects
- Contact form: /contact

When the visitor asks to navigate somewhere, confirm you are redirecting them
and keep your reply to one sentence.
`.trim();

/* ── 5. Navigation Intent Detection ─────────────────────────────── */
const NAV_PATTERNS = [
  { re: /\b(home|start|landing|main page|go back)\b/i,                    route: '/'         },
  { re: /\b(about page|about section|her background|who she is)\b/i,      route: '/about'    },
  { re: /\b(projects page|project section|her work|her portfolio)\b/i,    route: '/projects' },
  { re: /\b(contact page|contact section|get in touch|email her)\b/i,     route: '/contact'  },
];

const NAV_VERB = /\b(go to|take me to|open the|navigate to|visit the|redirect me|bring me to)\b/i;
const INFO_PHRASES = /\b(tell me|what is|who is|show me|explain|describe|list|what are|how|about ananya|her skills|her projects|her experience)\b/i;

function detectNav(msg) {
  if (INFO_PHRASES.test(msg)) return null;

  const hasVerb = NAV_VERB.test(msg);
  const isShort = msg.trim().split(/\s+/).length <= 3;
  if (!hasVerb && !isShort) return null;
  for (const { re, route } of NAV_PATTERNS) {
    if (re.test(msg)) return route;
  }
  return null;
}

function detectNavFromReply(reply) {
  const r = reply.toLowerCase();
  const isRedirecting = /\b(redirect(ing)?|taking you|navigating you|heading (to|over)|let me take|i('ll| will) (take|bring|send)|going to the)\b/i.test(reply);
  if (!isRedirecting) return null;

  if (/\b(project|portfolio)\b/i.test(r)) return '/projects';
  if (/\b(about page|about section)\b/i.test(r)) return '/about';
  if (/\b(contact page|contact section)\b/i.test(r)) return '/contact';
  if (/\b(home page|main page|landing page)\b/i.test(r)) return '/';
  return null;
}

/* ── 6. POST Handler ────────────────────────────────────────────── */
export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { message, history = [] } = body;
  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const navigate = detectNav(message);

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
        temperature:       0.2, // <-- CHANGED THIS FROM 0.7 TO 0.2
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

    /* Fallback: local rule-based engine */
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