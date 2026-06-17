/**
 * projects.js
 * Static data for the portfolio projects section.
 * Edit this file to update your project listings.
 */

export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce application with real-time inventory, secure checkout, and admin dashboard.",
    longDescription:
      "Built a complete e-commerce solution featuring product catalog management, cart & wishlist functionality, Stripe payment integration, order tracking, and an admin panel for inventory control. Implemented JWT authentication, image optimization, and server-side rendering for SEO.",
    image: "/project-images/ecommerce.jpg",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    featured: true,
    category: "Full Stack",
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "A collaborative project management tool with drag-and-drop boards, real-time updates, and team workspaces.",
    longDescription:
      "Developed a Trello-inspired task manager supporting multiple boards, lists, and cards with drag-and-drop reordering (dnd-kit). Features include real-time collaboration via WebSockets, deadline notifications, file attachments, team member assignment, and activity logs.",
    image: "/project-images/taskmanager.jpg",
    technologies: ["React", "Express.js", "PostgreSQL", "Socket.io", "CSS Modules"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    featured: true,
    category: "Full Stack",
  },
  {
    id: 3,
    title: "AI Chat Interface",
    description:
      "A sleek chat interface that integrates with multiple AI models, supporting markdown, code highlighting, and history.",
    longDescription:
      "Created a polished front-end interface for interacting with large language models. Features include markdown rendering with syntax highlighting, conversation history stored in localStorage, model switching, streaming responses, and an exportable chat log. Optimized for mobile and desktop.",
    image: "/project-images/aichat.jpg",
    technologies: ["React", "Tailwind CSS", "OpenAI API", "React Query"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    featured: true,
    category: "Frontend",
  },
  {
    id: 4,
    title: "Developer Portfolio v1",
    description:
      "My first personal portfolio site built with HTML, CSS, and vanilla JavaScript.",
    longDescription:
      "A clean, responsive portfolio showcasing my early projects. Features a CSS-grid layout, custom animations, contact form, and project filtering. Served as the foundation for my current portfolio redesign.",
    image: "/project-images/portfolio.jpg",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    featured: false,
    category: "Frontend",
  },
  {
    id: 5,
    title: "REST API Boilerplate",
    description:
      "A production-ready Node.js REST API template with authentication, rate limiting, and full test coverage.",
    longDescription:
      "A reusable API starter featuring JWT & refresh-token auth, role-based access control, input validation with Zod, request rate limiting, structured logging, Docker Compose setup, and Jest test suite. Designed to speed up backend project bootstrapping.",
    image: "/project-images/api.jpg",
    technologies: ["Node.js", "Express.js", "PostgreSQL", "Jest", "Docker"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    featured: false,
    category: "Backend",
  },
  {
    id: 6,
    title: "Real-time Dashboard",
    description:
      "Analytics dashboard with live charts, KPI cards, and filterable data tables.",
    longDescription:
      "Built an analytics dashboard that consumes a mock WebSocket data stream and renders live charts using Recharts. Includes responsive data tables with column sorting and filtering, date range pickers, CSV export, and dark/light mode support.",
    image: "/project-images/dashboard.jpg",
    technologies: ["React", "Recharts", "Tailwind CSS", "WebSocket"],
    github: "https://github.com",
    demo: "https://demo.example.com",
    featured: false,
    category: "Frontend",
  },
];
