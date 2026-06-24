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
  email:      'ananyar@steorasystems.com',
  github:     'https://github.com/AnanyaRaj14',
  linkedin:   'https://linkedin.com',
  location:   'Kolkata, West Bengal, India',
  education:  'B.Tech. Computer Science (pursuing, 2026)',
  resume:     '/images/ananya_raj_.pdf',
  bio: `I'm a Full Stack Developer with around 1 year of hands-on experience in React, Next.js, Node.js, PostgreSQL, and MongoDB. I'm passionate about building scalable web applications, writing clean code, and creating great user experiences. I'm always eager to learn new technologies and am open to full-time and freelance opportunities.
`,
};

/* ── Skills ────────────────────────────────────────────────────── */
export const SKILLS = {
  frontend:  ['HTML5', 'CSS3', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS'],
  backend:   ['Node.js', 'Express.js'],
  databases: ['MongoDB', 'PostgreSQL', 'MySQL'],
  tools:     ['Git', 'GitHub', 'VS Code', 'Postman', 'Figma', 'SQL'],
};

/* ── Projects (keep in sync with data/projects.js) ─────────────── */
export const PROJECTS = [
  {
    name:  'Blog App',
    desc:  'Full-stack blog platform with authentication and CRUD for posts.',
    stack: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JWT'],
    github: 'https://github.com/AnanyaRaj14/Blog-App',
  },
  {
    name:  'Job Portal',
    desc:  'Full-stack job listing and application platform.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Express.js', 'Tailwind CSS'],
    github: 'https://github.com/AnanyaRaj14/Job_Portal',
  },
  {
    name:  'Pixel Bazar',
    desc:  'Image gallery app powered by the Unsplash API.',
    stack: ['React', 'Unsplash API', 'CSS Modules', 'JavaScript'],
    github: 'https://github.com/AnanyaRaj14',
  },
  {
    name:  'Todo App',
    desc:  'Frontend task manager with local storage persistence.',
    stack: ['React', 'CSS', 'JavaScript', 'LocalStorage'],
    github: 'https://github.com/AnanyaRaj14/react-todo',
  },
  {
    name:  'BG Colour Changer',
    desc:  'Interactive background colour changer.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/AnanyaRaj14/react_bgcolor',
  },
  {
    name:  'Digital Clock',
    desc:  'Live digital clock built with vanilla web tech.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/AnanyaRaj14/Digital-Clock',
  },
];

/* ── Experience ─────────────────────────────────────────────────── */
export const EXPERIENCE = [
  {
    company:  'Lamda Infotech Pvt. Ltd., Kolkata',
    role:     'Jr. Web Developer',
    duration: 'Dec 2025 – Feb 2026',
    summary:  'Built responsive web pages and forms for student admission and school information systems. Applied form validation, error handling, and SQL database operations. Collaborated with senior developers on code reviews.',
  },
  {
    company:  'Freelance (Remote)',
    role:     'Frontend Developer',
    duration: 'Jun 2024 – Nov 2024',
    summary:  'Built a Google Form-based client data collection and notification system. Connected form submissions to a database and implemented automated email notifications using Apps Script.',
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
  `Hi! I'm **Annu**, Ananya's virtual guide.\n\n` +
  `I can tell you about her **projects**, **skills**, **experience**, ` +
  `or take you directly to any section of the portfolio.\n\n` +
  `How can I help you today?`;
