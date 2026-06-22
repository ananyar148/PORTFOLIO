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

/* ── Intent definitions ─────────────────────────────────────────── */
const INTENTS = [

  /* ── Navigation ── */
  {
    name: 'nav_home',
    match: (t) => any(t, ['home', 'start', 'beginning', 'landing', 'main page', 'go back']),
    reply: () => ({
      text: `🏠 Taking you **home**!`,
      navigate: ROUTES.home,
    }),
  },
  {
    name: 'nav_about',
    match: (t) => any(t, ['about', 'who is', 'who are', 'tell me about', 'about page',
                          'go to about', 'open about', 'background']),
    reply: () => ({
      text: `📖 Sure! Heading to the **About** page now.`,
      navigate: ROUTES.about,
    }),
  },
  {
    name: 'nav_projects',
    match: (t) => any(t, ['project', 'work', 'portfolio', 'built', 'created', 'made',
                          'show work', 'open project', 'go to project', 'my project']),
    reply: () => ({
      text: `🚀 Let me show you Ananya's **Projects**!`,
      navigate: ROUTES.projects,
    }),
  },
  {
    name: 'nav_contact',
    match: (t) => any(t, ['contact', 'reach', 'email', 'message', 'hire', 'connect',
                          'get in touch', 'open contact', 'go to contact']),
    reply: () => ({
      text: `📬 Redirecting you to the **Contact** page!`,
      navigate: ROUTES.contact,
    }),
  },

  /* ── Skills / tech ── */
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

  /* ── Projects info ── */
  {
    name: 'project_list',
    match: (t) => any(t, ['list project', 'what project', 'projects she', 'projects has',
                          'all project', 'project list', 'what has she built']),
    reply: () => ({
      text:
        `💡 Here are some of Ananya's featured **projects**:\n\n` +
        PROJECTS.map((p) =>
          `• **${p.name}** — ${p.desc}\n  *(${p.stack.join(', ')})*`
        ).join('\n\n') +
        `\n\nWant to see them all? I can take you to the projects page!`,
      navigate: null,
    }),
  },

  /* ── Experience ── */
  {
    name: 'experience',
    match: (t) => any(t, ['experience', 'work history', 'career', 'job', 'worked',
                          'employment', 'company', 'professional']),
    reply: () => ({
      text:
        `💼 Ananya's **professional experience**:\n\n` +
        EXPERIENCE.map((e) =>
          `• **${e.role}** at ${e.company} *(${e.duration})*\n  ${e.summary}`
        ).join('\n\n'),
      navigate: null,
    }),
  },

  /* ── Education ── */
  {
    name: 'education',
    match: (t) => any(t, ['educat', 'degree', 'university', 'college', 'study',
                          'studied', 'qualification', 'graduate']),
    reply: () => ({
      text: `🎓 Ananya holds a **${PROFILE.education}**. She's a self-driven learner who constantly expands her skills through projects, open-source contributions, and online courses.`,
      navigate: null,
    }),
  },

  /* ── About / bio ── */
  {
    name: 'about',
    match: (t) => any(t, ['about ananya', 'who is ananya', 'introduce', 'yourself',
                          'tell me about her', 'describe', 'bio', 'summary']),
    reply: () => ({
      text:
        `👩‍💻 **About Ananya Raj**\n\n${PROFILE.bio}\n\n` +
        `📍 ${PROFILE.location} | 🎓 ${PROFILE.education}`,
      navigate: null,
    }),
  },

  /* ── Contact info ── */
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
        `Or just head to the Contact page and send a message directly!`,
      navigate: null,
    }),
  },

  /* ── GitHub ── */
  {
    name: 'github',
    match: (t) => any(t, ['github', 'git hub', 'repository', 'repo', 'code', 'source']),
    reply: () => ({
      text: `🐙 You can find Ananya's code on GitHub:\n**${PROFILE.github}**\n\nShe has 120+ stars across her repos and has contributed to open-source projects!`,
      navigate: null,
    }),
  },

  /* ── Resume ── */
  {
    name: 'resume',
    match: (t) => any(t, ['resume', 'cv', 'curriculum', 'download', 'pdf']),
    reply: () => ({
      text: `📄 Ananya's resume is available for download! You can grab it from the **Home** page using the "Download Resume" button, or directly at:\n\`/images/resume.pdf\``,
      navigate: null,
    }),
  },

  /* ── Greeting ── */
  {
    name: 'greeting',
    match: (t) => any(t, ['hello', 'hi', 'hey', 'howdy', 'good morning',
                          'good evening', 'good afternoon', 'greet', 'sup', 'yo']),
    reply: () => ({
      text: `👋 Hey there! Great to meet you! I'm **Annu**, Ananya's virtual assistant.\n\nI can tell you about her skills, projects, experience — or navigate you anywhere on the site. What would you like to know?`,
      navigate: null,
    }),
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
      return intent.reply();
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
