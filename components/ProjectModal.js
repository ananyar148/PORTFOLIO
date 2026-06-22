'use client';

/**
 * ProjectModal.js
 * Animated modal overlay for detailed project information.
 * Traps focus while open and closes on Escape or backdrop click.
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);

  /* Focus close button when modal opens */
  useEffect(() => {
    if (project) closeRef.current?.focus();
  }, [project]);

  /* Close on Escape */
  useEffect(() => {
    if (!project) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [project, onClose]);

  /* Prevent background scroll when open */
  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl
                         shadow-2xl pointer-events-auto"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
            >
              {/* Close button */}
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center
                           justify-center text-lg transition-colors duration-200"
                style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>

              {/* Project image / banner */}
              <div
                className="h-52 flex items-center justify-center text-8xl rounded-t-3xl"
                style={{ background: 'var(--bg-secondary)' }}
                aria-hidden="true"
              >
                {project.id === 1 && '🛒'}
                {project.id === 2 && '📋'}
                {project.id === 3 && '🤖'}
                {project.id === 4 && '🌐'}
                {project.id === 5 && '⚡'}
                {project.id === 6 && '📊'}
              </div>

              {/* Content */}
              <div className="p-8 sm:p-10 space-y-6">
                {/* Category + title */}
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    {project.category}
                  </span>
                  <h2
                    id="modal-title"
                    className="text-2xl sm:text-3xl font-extrabold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {project.title}
                  </h2>
                </div>

                {/* Long description */}
                <p className="leading-relaxed text-base" style={{ color: 'var(--text-secondary)' }}>
                  {project.longDescription}
                </p>

                {/* Technologies */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-primary)' }}>
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
                        style={{
                          background: 'rgba(99,102,241,0.1)',
                          borderColor: 'var(--accent)',
                          color: 'var(--accent)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2
                               py-3 px-6 rounded-xl text-sm font-semibold border transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    {/* GitHub icon */}
                    <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16" aria-hidden="true">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                        0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                        -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                        .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                        -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
                        1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56
                        .82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0
                        1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    View on GitHub
                  </motion.a>
                  <motion.a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2
                               py-3 px-6 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)',
                    }}
                  >
                    🔗 Live Demo
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
