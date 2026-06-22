'use client';

/**
 * ProjectCard.js
 * Reusable card for a single project.
 * Clicking it opens the modal via the onOpen callback.
 */

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProjectCard({ project, onOpen }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl overflow-hidden border card-glow cursor-pointer
                 flex flex-col h-full"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(project)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title}`}
    >
      {/* Project image */}
      <div className="relative h-48 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        {/* Placeholder — swap for a real <Image> when you have project images */}
        <div
          className="w-full h-full flex items-center justify-center text-6xl
                     transition-transform duration-500 group-hover:scale-110"
          aria-hidden="true"
        >
          {project.id === 1 && '🛒'}
          {project.id === 2 && '📋'}
          {project.id === 3 && '🤖'}
          {project.id === 4 && '🌐'}
          {project.id === 5 && '⚡'}
          {project.id === 6 && '📊'}
        </div>

        {/* Category badge */}
        <span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {project.category}
        </span>
      </div>

      {/* Card body */}
      <div className="p-6 sm:p-7 lg:p-8 flex flex-col flex-1">
        <h3 className="text-lg sm:text-xl font-bold mb-3 leading-tight" style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--text-secondary)' }}>
          {project.description}
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg text-xs font-medium border transition-colors"
              style={{
                background: 'rgba(99,102,241,0.08)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span
              className="px-3 py-1 rounded-lg text-xs font-medium"
              style={{ color: 'var(--accent)' }}
            >
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Action links — stop propagation so clicking them doesn't also open the modal */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto pt-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg
                       border transition-colors duration-200 hover:bg-opacity-10"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            {/* GitHub icon */}
            <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
                1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56
                .82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0
                1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg
                       transition-colors duration-200 text-white hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            🔗 Live Demo
          </a>
        </div>
      </div>
    </motion.article>
  );
}
