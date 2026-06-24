/**
 * lib/chatbotLogic.js
 *
 * Pure intent-matching engine — no external dependencies, no API calls.
 * Returns { text, navigate } where:
 *   text      — bot reply (supports **bold** markdown)
 *   navigate  — optional route string (e.g. '/projects') or null
 */

import {
  PROFILE, SKILLS, PROJECTS, EXPERIENCE, ROUTES,
} from './chatData';

/* ── Normalise input ────────────────────────────────────────────── */
const norm = (s) => s.toLowerCase().replace(/[^\w\s]/g, '').trim();

/* ── Keyword matcher ────────────────────────────────────────────── */
const any = (text, words) => words.some((w) => text.includes(w));

/* ── Navigation verb detector ───────────────────────────────────── */
/* Only trigger navigation when the user actually wants to GO somewhere */
const NAV_VERBS = ['go to', 'take me', 'show me', 'open', 'navigate', 'visit',
                   'redirect', 'head to', 'jump to', 'bring me'];
const hasNavVerb = (t) => NAV_VERBS.some((v) => t.includes(v));

/* ── Intent definitions ─────────────────────────────────────────── */
const INTENTS = [

  /* ── Greeting (highest priority) ── */
  {
    name: 'greeting',
    match: (t) => any(t, ['hello', 'hi', 'hey', 'howdy', 'good morning',
                          'good evening', 'good afternoon', 'greet', 'sup', 'yo']),
    reply: () => ({
      text: `� Hey there! Great to meet you! I'm **Annu**, Ananya's virtual assistant.\n\nI can tell you about her skills, projects, experience — or navigate you anywhere on the site. What would you like to know?`,
      navigate: null,
    }),
  },

  /* ── About / bio (info — before nav) ── */
  {
    name: 'about',
    match: (t) => any(t, ['about ananya', 'who is ananya', 'introduce', 'yourself',
                          'tell me about', 'describe', 'bio', 'summary', 'who is she',
                          'tell me more']),
    reply: () => ({
      text:
        `�‍💻 **About Ananya Raj**\n\n${PROFILE.bio}\n\n` +
        `📍 ${PROFILE.location} | 🎓 ${PROFILE.education}`,
      navigate: null,
    }),
  },

  /* ── Skills / tech (info — before nav) ── */
  {
    name: 'skills',
    match: (t) => any(t, ['skill', 'tech', 'technolog', 'stack', 'language', 'tool',
                          'framework', 'know', 'use', 'expert', 'proficient', 'familiar']),
    reply: () => ({
      text:
        `🛠️ Here's Ananya's **tech stack**:\n\n` +
        `**Frontend:** ${SKILLS.frontend.join(', ')}\n` +
        `**Backend:** ${SKILLS.backend.join(', ')}\n` +
        `**Databases:** ${SKILLS.databases.join(', ')}\n` +
        `**Tools:** ${SKILLS.tools.join(', ')}`,
      navigate: null,
    }),
  },

  /* ── Experience (info — before nav) ── */
  {
    name: 'experience',
    match: (t) => any(t, ['experience', 'work history', 'career', 'job', 'worked',
                          'employment', 'company', 'professional', 'internship']),
    reply: () => ({
      text:
        `� Ananya's **professional experience**:\n\n` +
        EXPERIENCE.map((e) =>
          `• **${e.role}** at ${e.company} *(${e.duration})*\n  ${e.summary}`
        ).join('\n\n'),
      navigate: null,
    }),
  },

  /* ── Projects info (info — before nav) ── */
  {
    name: 'project_list',
    match: (t) => any(t, ['list project', 'what project', 'projects she', 'projects has',
                          'all project', 'project list', 'what has she built',
                          'what did she build', 'her projects', 'show project']),
    reply: () => ({
      text:
        `� Here are Ananya's featured **projects**:\n\n` +
        PROJECTS.map((p) =>
          `• **${p.name}** — ${p.desc}\n  *(${p.stack.join(', ')})*`
        ).join('\n\n') +
        `\n\nWant to see them all? Say "take me to projects"!`,
      navigate: null,
    }),
  },

  /* ── Education (info — before nav) ── */
  {
    name: 'education',
    match: (t) => any(t, ['educat', 'degree', 'university', 'college', 'study',
                          'studied', 'qualification', 'graduate', 'btech', 'b tech']),
    reply: () => ({
      text: `🎓 Ananya is pursuing a **${PROFILE.education}**. She's a self-driven learner who constantly expands her skills through projects and online courses.`,
      navigate: null,
    }),
  },

  /* ── Contact info (info — before nav) ── */
  {
    name: 'contact_info',
    match: (t) => any(t, ['email address', 'her email', 'contact info', 'contact detail',
                          'how to reach', 'how can i contact', 'social', 'linkedin',
                          'github link', 'where to find']),
    reply: () => ({
      text:
        `📬 You can reach Ananya at:\n\n` +
        `• **Email:** ${PROFILE.email}\n` +
        `• **GitHub:** ${PROFILE.github}\n` +
        `• **LinkedIn:** ${PROFILE.linkedin}\n` +
        `• **Location:** ${PROFILE.location}\n\n` +
        `Or head to the Contact page to send a message directly!`,
      navigate: null,
    }),
  },

  /* ── GitHub ── */
  {
    name: 'github',
    match: (t) => any(t, ['github', 'git hub', 'repository', 'repo', 'source code']),
    reply: () => ({
      text: `🐙 You can find Ananya's code on GitHub:\n**${PROFILE.github}**\n\nShe has projects ranging from full-stack apps to frontend utilities — check them out!`,
      navigate: null,
    }),
  },

  /* ── Resume ── */
  {
    name: 'resume',
    match: (t) => any(t, ['resume', 'cv', 'curriculum', 'download', 'pdf']),
    reply: () => ({
      text: `📄 Ananya's resume is available for download on the **Home** page using the "Download Resume" button.`,
      navigate: null,
    }),
  },

  /* ── Hire ── */
  {
    name: 'hire',
    match: (t) => any(t, ['hire', 'available', 'freelance', 'opportunity',
                          'job offer', 'work with', 'collaborate', 'work together']),
    reply: () => ({
      text: `🎯 Ananya is **open to opportunities**!\n\nShe's available for full-time roles, freelance projects, and collaborations. The best way to reach her is through the **Contact** page. Want me to take you there?`,
      navigate: null,
    }),
  },

  /* ── Navigation (only fires when user explicitly wants to go somewhere) ── */
  {
    name: 'nav_home',
    match: (t) => (hasNavVerb(t) || any(t, ['go back', 'main page', 'landing page'])) && any(t, ['home', 'start', 'beginning', 'landing', 'main']),
    reply: () => ({
      text: `🏠 Taking you **home**!`,
      navigate: ROUTES.home,
    }),
  },
  {
    name: 'nav_about',
    match: (t) => hasNavVerb(t) && any(t, ['about', 'background', 'bio', 'about page']),
    reply: () => ({
      text: `� Sure! Heading to the **About** page now.`,
      navigate: ROUTES.about,
    }),
  },
  {
    name: 'nav_projects',
    match: (t) => hasNavVerb(t) && any(t, ['project', 'work', 'portfolio', 'built']),
    reply: () => ({
      text: `🚀 Let me show you Ananya's **Projects**!`,
      navigate: ROUTES.projects,
    }),
  },
  {
    name: 'nav_contact',
    match: (t) => (hasNavVerb(t) || any(t, ['go to contact', 'open contact'])) && any(t, ['contact', 'reach', 'hire', 'get in touch']),
    reply: () => ({
      text: `📬 Redirecting you to the **Contact** page!`,
      navigate: ROUTES.contact,
    }),
  },

  /* ── "take me to X" shorthand ── */
  {
    name: 'nav_take_me',
    match: (t) => t.includes('take me') || t.includes('bring me') || t.startsWith('go to'),
    reply: (t) => {
      if (any(t, ['project', 'work', 'portfolio'])) return { text: `� Taking you to **Projects**!`, navigate: ROUTES.projects };
      if (any(t, ['about', 'bio', 'background']))   return { text: `📖 Taking you to **About**!`,    navigate: ROUTES.about };
      if (any(t, ['contact', 'reach', 'hire']))      return { text: `📬 Taking you to **Contact**!`,  navigate: ROUTES.contact };
      if (any(t, ['home', 'start', 'main']))         return { text: `🏠 Taking you **home**!`,        navigate: ROUTES.home };
      return { text: `🤔 Where would you like to go? I can take you to **Home**, **About**, **Projects**, or **Contact**.`, navigate: null };
    },
  },

  /* ── Thanks ── */
  {
    name: 'thanks',
    match: (t) => any(t, ['thank', 'thanks', 'thx', 'cheers', 'appreciate',
                          'helpful', 'awesome', 'great', 'cool', 'nice']),
    reply: () => ({
      text: `😊 Happy to help! Is there anything else you'd like to know about Ananya or her work?`,
      navigate: null,
    }),
  },

  /* ── Goodbye ── */
  {
    name: 'bye',
    match: (t) => any(t, ['bye', 'goodbye', 'see you', 'see ya', 'later', 'ciao',
                          'take care', 'farewell', 'done', 'close']),
    reply: () => ({
      text: `👋 Goodbye! Feel free to chat again anytime. Hope you enjoyed exploring Ananya's portfolio! ✨`,
      navigate: null,
    }),
  },
];

/* ── Main resolve function ──────────────────────────────────────── */
/**
 * @param {string} userInput
 * @returns {{ text: string, navigate: string|null }}
 */
export function resolveIntent(userInput) {
  const t = norm(userInput);

  for (const intent of INTENTS) {
    if (intent.match(t)) {
      return intent.reply(t);
    }
  }

  /* ── Fallback ── */
  return {
    text:
      `🤔 I'm not quite sure I understood that.\n\n` +
      `You can ask me about:\n` +
      `• Ananya's **skills** or **tech stack**\n` +
      `• Her **projects** or **experience**\n` +
      `• **Contact** information\n` +
      `• Or say *"take me to projects"* to navigate the site!\n\n` +
      `What would you like to know?`,
    navigate: null,
  };
}
