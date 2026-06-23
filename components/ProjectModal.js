'use client';

/**
 * ProjectModal.js
 * Animated modal overlay for detailed project information.
 * All spacing via inline styles to guarantee rendering (Tailwind v4 scanner bypass).
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJI = { 1: '🛒', 2: '📋', 3: '🤖', 4: '🌐', 5: '⚡', 6: '📊' };

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

  /* Prevent background scroll */
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
            style={{
              position:       'fixed',
              inset:          0,
              zIndex:         100,
              background:     'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(6px)',
            }}
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
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.9,   y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{
              position:       'fixed',
              inset:          0,
              zIndex:         101,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              padding:        '1rem',
              pointerEvents:  'none',
            }}
          >
            <div
              style={{
                position:        'relative',
                width:           '100%',
                maxWidth:        '40rem',
                maxHeight:       '90vh',
                overflowY:       'auto',
                borderRadius:    '1.5rem',
                boxShadow:       '0 24px 64px rgba(0,0,0,0.5)',
                pointerEvents:   'auto',
                background:      'var(--bg-primary)',
                border:          '1.5px solid var(--border)',
              }}
            >
              {/* Close button */}
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  position:       'absolute',
                  top:            '1rem',
                  right:          '1rem',
                  zIndex:         10,
                  width:          '2.25rem',
                  height:         '2.25rem',
                  borderRadius:   '50%',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '1rem',
                  background:     'var(--bg-card)',
                  color:          'var(--text-secondary)',
                  border:         '1.5px solid var(--border)',
                  cursor:         'pointer',
                  transition:     'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
              >
                ✕
              </button>

              {/* Banner */}
              <div
                style={{
                  height:         '13rem',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '5rem',
                  borderRadius:   '1.5rem 1.5rem 0 0',
                  background:     'var(--bg-secondary)',
                }}
                aria-hidden="true"
              >
                {EMOJI[project.id] ?? '💡'}
              </div>

              {/* Content */}
              <div
                style={{
                  padding:       '2rem 2.25rem 2.5rem',
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           '1.5rem',
                }}
              >
                {/* Category + title */}
                <div>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      display:      'inline-block',
                      padding:      '0.3rem 0.875rem',
                      borderRadius: '9999px',
                      background:   'var(--accent)',
                      color:        '#fff',
                      marginBottom: '0.875rem',
                    }}
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
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {project.longDescription}
                </p>

                {/* Technologies */}
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}
                  >
                    Technologies Used
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-sm font-medium"
                        style={{
                          padding:      '0.35rem 0.875rem',
                          borderRadius: '0.625rem',
                          border:       '1.5px solid var(--accent)',
                          background:   'rgba(59,130,246,0.1)',
                          color:        'var(--accent)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-sm font-semibold"
                    style={{
                      flex:           1,
                      minWidth:       '8rem',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            '0.5rem',
                      padding:        '0.875rem 1.5rem',
                      borderRadius:   '0.75rem',
                      border:         '1.5px solid var(--border)',
                      color:          'var(--text-primary)',
                      textDecoration: 'none',
                      transition:     'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
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
                    className="text-sm font-semibold"
                    style={{
                      flex:           1,
                      minWidth:       '8rem',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            '0.5rem',
                      padding:        '0.875rem 1.5rem',
                      borderRadius:   '0.75rem',
                      background:     'linear-gradient(135deg, var(--accent) 0%, #06B6D4 100%)',
                      color:          '#fff',
                      textDecoration: 'none',
                      transition:     'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
