/**
 * experience.js
 * Professional experience entries for the Projects/Experience section.
 */

export const experiences = [
  {
    id: 1,
    company: 'Lamda Infotech Pvt. Ltd.',
    role: 'Jr. Web Developer',
    duration: 'Dec 2025 – Feb 2026',
    location: 'Kolkata, West Bengal',
    type: 'Full-time',
    description:
      'Worked on internal web applications for school management, building responsive pages and forms for student admission and school information systems.',
    responsibilities: [
      'Built responsive web pages and forms for student admission and school information modules.',
      'Applied form validation, error handling, and navigation improvements to enhance overall application reliability and reduce user-facing errors.',
      'Executed SQL database operations to store, retrieve, and manage application data efficiently.',
      'Collaborated with senior developers on code reviews and feature implementation.',
    ],
    achievements: [
      'Reduced user-facing form errors by improving validation and error messaging across key workflows.',
      'Improved application navigation flow, resulting in a smoother user experience for school staff.',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'SQL', 'PHP'],
    color: '#3B82F6',
  },
  {
    id: 2,
    company: 'Freelance / Self-employed',
    role: 'Frontend Developer',
    duration: 'Jun 2024 – Nov 2024',
    location: 'Remote',
    type: 'Freelance',
    description:
      'Developed a client data collection and notification system using Google Forms integrated with a database and automated email delivery to both parties on submission.',
    responsibilities: [
      'Built and configured a Google Form for structured client data collection.',
      'Connected form submissions to a database for persistent storage and easy retrieval.',
      'Implemented automated email notifications sent to both the client and the business owner on every form submission.',
      'Ensured reliable data flow and tested end-to-end submission and notification pipeline.',
    ],
    achievements: [
      'Fully automated the client intake process, eliminating manual follow-ups.',
      'Delivered the project on time with zero post-launch issues reported.',
    ],
    technologies: ['Google Forms', 'Google Sheets', 'Apps Script', 'Email Automation'],
    color: '#06B6D4',
  },
];
