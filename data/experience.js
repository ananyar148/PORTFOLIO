/**
 * experience.js
 * Professional experience entries for the Projects/Experience section.
 */

export const experiences = [
  {
    id: 1,
    company: "TechCorp Solutions",
    role: "Junior Full Stack Developer",
    duration: "Jan 2024 – Present",
    location: "Remote",
    type: "Full-time",
    description:
      "Work within an agile team to build and maintain customer-facing web applications using React and Node.js.",
    responsibilities: [
      "Developed and maintained React components for the company's SaaS dashboard.",
      "Built RESTful APIs with Express.js and optimised PostgreSQL queries.",
      "Collaborated with designers to implement pixel-perfect UI from Figma specs.",
      "Participated in code reviews and improved test coverage by 30%.",
    ],
    achievements: [
      "Reduced page load time by 40% through code splitting and lazy loading.",
      "Led the migration of legacy class components to React hooks.",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "AWS"],
    color: "#6366f1",
  },
  {
    id: 2,
    company: "Freelance / Self-employed",
    role: "Frontend Developer",
    duration: "Jun 2023 – Dec 2023",
    location: "Remote",
    type: "Freelance",
    description:
      "Designed and developed websites and web apps for small businesses and startup clients.",
    responsibilities: [
      "Translated client requirements into responsive, accessible web experiences.",
      "Integrated third-party APIs (payment, maps, email).",
      "Set up CI/CD pipelines and deployed projects to Vercel and Netlify.",
    ],
    achievements: [
      "Delivered 8 projects on time with 100% client satisfaction.",
      "Increased one client's conversion rate by 25% via UX improvements.",
    ],
    technologies: ["Next.js", "Tailwind CSS", "Stripe", "Vercel"],
    color: "#10b981",
  },
  {
    id: 3,
    company: "OpenSource Contributions",
    role: "Open Source Contributor",
    duration: "2022 – Present",
    location: "Remote",
    type: "Volunteer",
    description:
      "Active contributor to several open-source JavaScript projects on GitHub.",
    responsibilities: [
      "Submitted bug-fix PRs and documentation improvements.",
      "Engaged in issue triage and community discussions.",
      "Built and published a small npm utility package.",
    ],
    achievements: [
      "Accumulated 120+ GitHub stars across personal repositories.",
      "Had PRs merged into two popular open-source libraries.",
    ],
    technologies: ["JavaScript", "Git", "GitHub", "Node.js"],
    color: "#f59e0b",
  },
];
