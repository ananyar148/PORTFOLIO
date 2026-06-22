/**
 * lib/chatData.js
 *
 * Single source of truth for Annu's knowledge base.
 * Update this file to change any chatbot responses without touching components.
 */

/* ── Owner profile ─────────────────────────────────────────────── */
export const PROFILE = {
  name:       'Ananya Raj',
  title:      'Full Stack Developer',
  email:      'ananya@email.com',
  github:     'https://github.com/ananyar148',
  linkedin:   'https://linkedin.com',
  location:   'Your City, Country',
  education:  'B.Sc. Computer Science, 2023',
  resume:     '/images/resume.pdf',
  bio: `Ananya is a passionate Full Stack Developer with 3+ years of experience
building modern web applications. She specialises in React, Next.js, Node.js,
and modern databases. She loves clean code, great UX, and continuous learning.`,
};

/* ── Skills ────────────────────────────────────────────────────── */
export const SKILLS = {
  frontend:  ['HTML5', 'CSS3', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS'],
  backend:   ['Node.js', 'Express.js'],
  databases: ['MongoDB', 'PostgreSQL', 'MySQL'],
  tools:     ['Git', 'GitHub', 'VS Code', 'Postman', 'Figma'],
};

/* ── Projects (keep in sync with data/projects.js) ─────────────── */
export const PROJECTS = [
  {
    name:  'E-Commerce Platform',
    desc:  'Full-stack e-commerce app with Stripe payments and admin dashboard.',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
  },
  {
    name:  'Task Management App',
    desc:  'Collaborative project manager with drag-and-drop and real-time updates.',
    stack: ['React', 'Express.js', 'PostgreSQL', 'Socket.io'],
  },
  {
    name:  'AI Chat Interface',
    desc:  'Sleek chat UI for multiple LLMs with streaming responses and history.',
    stack: ['React', 'OpenAI API', 'Tailwind CSS'],
  },
  {
    name:  'REST API Boilerplate',
    desc:  'Production-ready Node.js API starter with auth, rate limiting and tests.',
    stack: ['Node.js', 'Express.js', 'PostgreSQL', 'Jest'],
  },
];

/* ── Experience ─────────────────────────────────────────────────── */
export const EXPERIENCE = [
  {
    company:  'TechCorp Solutions',
    role:     'Junior Full Stack Developer',
    duration: 'Jan 2024 – Present',
    summary:  'Building React dashboards and Node.js APIs for a SaaS product.',
  },
  {
    company:  'Freelance',
    role:     'Frontend Developer',
    duration: 'Jun 2023 – Dec 2023',
    summary:  'Delivered 8 client websites and web apps with 100% satisfaction.',
  },
  {
    company:  'Open Source',
    role:     'Contributor',
    duration: '2022 – Present',
    summary:  '120+ GitHub stars, PRs merged into two popular libraries.',
  },
];

/* ── Navigation routes ──────────────────────────────────────────── */
export const ROUTES = {
  home:     '/',
  about:    '/about',
  projects: '/projects',
  contact:  '/contact',
};

/* ── Suggested quick-reply chips ────────────────────────────────── */
export const SUGGESTIONS = [
  { label: '👩‍💻 About Ananya',         query: 'Tell me about Ananya'      },
  { label: '🚀 View Projects',          query: 'Show me the projects'      },
  { label: '🛠️ Tech Stack',             query: 'What technologies does she know?' },
  { label: '💼 Experience',             query: 'What is her experience?'   },
  { label: '📬 Contact',                query: 'How can I contact her?'    },
  { label: '🎓 Education',              query: 'Tell me about education'   },
];

/* ── Welcome message ────────────────────────────────────────────── */
export const WELCOME =
  `👋 Hi! I'm **Annu**, Ananya's virtual guide.\n\n` +
  `I can tell you about her **projects**, **skills**, **experience**, ` +
  `or take you directly to any section of the portfolio.\n\n` +
  `How can I help you today?`;
