/**
 * skills.js
 * Grouped skill data for the About section.
 * Add, remove, or reorder entries freely.
 */

export const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    icon: "🎨",
    color: "#6366f1",        // indigo
    skills: [
      { name: "HTML5",       level: 95 },
      { name: "CSS3",        level: 90 },
      { name: "JavaScript",  level: 92 },
      { name: "React",       level: 90 },
      { name: "Next.js",     level: 85 },
      { name: "Tailwind CSS",level: 88 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "⚙️",
    color: "#10b981",        // emerald
    skills: [
      { name: "Node.js",     level: 82 },
      { name: "Express.js",  level: 80 },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    icon: "🗄️",
    color: "#f59e0b",        // amber
    skills: [
      { name: "MongoDB",     level: 78 },
      { name: "PostgreSQL",  level: 75 },
      { name: "MySQL",       level: 72 },
    ],
  },
  {
    id: "tools",
    label: "Tools & Workflow",
    icon: "🛠️",
    color: "#ec4899",        // pink
    skills: [
      { name: "Git",         level: 90 },
      { name: "GitHub",      level: 88 },
      { name: "VS Code",     level: 92 },
      { name: "Postman",     level: 80 },
      { name: "Figma",       level: 70 },
    ],
  },
];

/** Quick stats shown as highlight cards in the About section */
export const stats = [
  { label: "Projects Completed", value: "20+", icon: "🚀" },
  { label: "Technologies Used",  value: "15+", icon: "💡" },
  { label: "Years Learning",     value: "3+",  icon: "📅" },
  { label: "Cups of Coffee",     value: "∞",   icon: "☕" },
];
