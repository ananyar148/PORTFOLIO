/**
 * projects.js
 * Ananya Raj's actual project listings with real GitHub links.
 */

export const projects = [
  {
    id: 1,
    title: 'Blog App',
    description:
      'A full-featured blogging platform where users can create, edit, and delete posts with rich text support.',
    longDescription:
      'Built a complete blogging application with user authentication, CRUD operations for posts, rich-text editing, category tagging, and a responsive reading layout. Implemented search functionality and pagination for browsing articles.',
    image: '/project-images/blog.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JWT'],
    github: 'https://github.com/AnanyaRaj14/Blog-App',
    featured: true,
    category: 'Full Stack',
  },
  {
    id: 2,
    title: 'Job Portal',
    description:
      'A job listing platform connecting candidates with employers, featuring search, filters, and application tracking.',
    longDescription:
      'Developed a job portal with role-based access for employers and job seekers. Employers can post and manage listings; candidates can search, filter by location/category, bookmark jobs, and track application status. Includes a dashboard for both user types.',
    image: '/project-images/jobportal.jpg',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Express.js', 'Tailwind CSS'],
    github: 'https://github.com/AnanyaRaj14/Job_Portal',
    featured: true,
    category: 'Full Stack',
  },
  {
    id: 3,
    title: 'Pixel Bazar',
    description:
      'A beautiful image gallery app with search, category browsing, and full-screen preview.',
    longDescription:
      'Created an image gallery powered by the Unsplash API. Features include keyword search, category-based browsing, masonry grid layout, full-screen lightbox preview, lazy loading for performance, and the ability to download images directly.',
    image: '/project-images/pixelbazar.jpg',
    technologies: ['React', 'Unsplash API', 'CSS Modules', 'JavaScript'],
    github: 'https://github.com/AnanyaRaj14',
    featured: true,
    category: 'Frontend',
  },
  {
    id: 4,
    title: 'Todo App',
    description:
      'A clean, minimal task manager with add, complete, filter, and delete functionality.',
    longDescription:
      'A productivity-focused todo application with local storage persistence, task completion toggling, priority filtering (all / active / completed), and smooth animations. Built with a clean UI and keyboard accessibility in mind.',
    image: '/project-images/todo.jpg',
    technologies: ['React', 'CSS', 'JavaScript', 'LocalStorage'],
    github: 'https://github.com/AnanyaRaj14/react-todo',
    featured: false,
    category: 'Frontend',
  },
  {
    id: 5,
    title: 'BG Colour Changer',
    description:
      'An interactive background colour picker that generates random or custom colour schemes instantly.',
    longDescription:
      'A fun interactive tool that changes the page background colour on button click or by entering a hex/rgb value. Features include random colour generation, hex/rgb input support, colour history, and copy-to-clipboard for the current colour code.',
    image: '/project-images/bgchanger.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/AnanyaRaj14/react_bgcolor',
    featured: false,
    category: 'Frontend',
  },
  {
    id: 6,
    title: 'Digital Clock',
    description:
      'A real-time digital clock with date display, 12/24-hour toggle, and a sleek UI.',
    longDescription:
      'A live digital clock that displays the current time and date, updated every second. Includes a 12/24-hour format toggle, AM/PM indicator, dynamic greeting based on time of day, and a minimalist dark/light themed interface.',
    image: '/project-images/clock.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/AnanyaRaj14/Digital-Clock',
    featured: false,
    category: 'Frontend',
  },
];
