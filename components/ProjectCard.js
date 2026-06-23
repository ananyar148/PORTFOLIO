'use client';

/**
 * ProjectCard.js
 * Reusable card for a single project. No live demo button.
 * All spacing via inline styles to guarantee rendering (Tailwind v4 scanner bypass).
 */

import { motion } from 'framer-motion';

const EMOJI = { 1: '�', 2: '�', 3: '🖼️', 4: '✅', 5: '🎨', 6: '�' };

export default function ProjectCard({ project, onOpen }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(project)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title}`}
      style={{
        background:    'var(--bg-card)',
        border:        '1.5px solid var(--border)',
        borderRadius:  '1rem',
        overflow:      'hidden',
        display:       'flex',
        flexDirection: 'column',
        height:        '100%',
        cursor:        'pointer',
        transition:    'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 28px rgba(59,130,246,0.22)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* ── Image banner ─────────────────────────────────────────── */}
      <div
        style={{
          position:       'relative',
          height:         '11rem',
          background:     'var(--bg-secondary)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '4rem',
          overflow:       'hidden',
        }}
        aria-hidden="true"
      >
        <motion.span
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'block', lineHeight: 1 }}
        >
          {EMOJI[project.id] ?? '💡'}
        </motion.span>

        {/* Category badge */}
        <span
          className="text-xs font-semibold"
          style={{
            position:     'absolute',
            top:          '0.75rem',
            right:        '0.75rem',
            padding:      '0.3rem 0.75rem',
            borderRadius: '9999px',
            background:   'var(--accent)',
            color:        '#fff',
          }}
        >
          {project.category}
        </span>
      </div>

      {/* ── Card body ────────────────────────────────────────────── */}
      <div
        style={{
          padding:       '1.5rem 1.75rem',
          display:       'flex',
          flexDirection: 'column',
          flex:          1,
        }}
      >
        <h3
          className="text-lg font-bold leading-tight"
          style={{ color: 'var(--text-primary)', marginBottom: '0.625rem' }}
        >
          {project.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}
        >
          {project.description}
        </p>

        {/* Tech stack badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium"
              style={{
                padding:      '0.3rem 0.7rem',
                borderRadius: '0.5rem',
                border:       '1.5px solid var(--border)',
                background:   'rgba(59,130,246,0.08)',
                color:        'var(--text-secondary)',
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span
              className="text-xs font-medium"
              style={{ padding: '0.3rem 0.5rem', color: 'var(--accent)' }}
            >
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* GitHub only — no live demo */}
        <div style={{ marginTop: 'auto' }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold"
            style={{
              width:          '100%',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '0.5rem',
              padding:        '0.65rem 1rem',
              borderRadius:   '0.625rem',
              border:         '1.5px solid var(--border)',
              color:          'var(--text-secondary)',
              textDecoration: 'none',
              transition:     'background 0.2s, border-color 0.2s, color 0.2s',
              boxSizing:      'border-box',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background    = 'rgba(59,130,246,0.08)';
              e.currentTarget.style.borderColor   = 'var(--accent)';
              e.currentTarget.style.color         = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background    = 'transparent';
              e.currentTarget.style.borderColor   = 'var(--border)';
              e.currentTarget.style.color         = 'var(--text-secondary)';
            }}
          >
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
            View on GitHub
          </a>
        </div>
      </div>
    </motion.article>
  );
}
