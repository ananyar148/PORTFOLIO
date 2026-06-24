'use client';

/**
 * Experience.js
 * Professional Experience timeline — standalone page component.
 * All spacing via inline styles to guarantee rendering (Tailwind v4 scanner bypass).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experiences } from '@/data/experience';

/* ── Experience timeline entry ─────────────────────────────────────── */
function ExperienceEntry({ exp, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ marginBottom: '2rem' }}
    >
      <div
        style={{
          padding:      '2rem 2.25rem',
          borderRadius: '1.25rem',
          border:       '1.5px solid var(--border)',
          background:   'var(--bg-card)',
          transition:   'box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
      >
        {/* Header: Role + Duration */}
        <div
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            justifyContent: 'space-between',
            alignItems:     'flex-start',
            gap:            '1rem',
            marginBottom:   '1.5rem',
          }}
        >
          <div style={{ flex: 1, minWidth: '12rem' }}>
            <h4
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)', marginBottom: '0.4rem' }}
            >
              {exp.role}
            </h4>
            {/* Company name — clickable if href provided */}
            {exp.href ? (
              <a
                href={exp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold"
                style={{
                  color:          exp.color,
                  textDecoration: 'none',
                  borderBottom:   `1.5px solid ${exp.color}`,
                  paddingBottom:  '0.05rem',
                  transition:     'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {exp.company} ↗
              </a>
            ) : (
              <p className="text-sm font-semibold" style={{ color: exp.color }}>
                {exp.company}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span
              className="text-xs font-medium"
              style={{
                display:      'inline-block',
                padding:      '0.35rem 0.875rem',
                borderRadius: '9999px',
                border:       '1.5px solid var(--border)',
                color:        'var(--text-secondary)',
                marginBottom: '0.4rem',
              }}
            >
              {exp.duration}
            </span>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {exp.location} · {exp.type}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'var(--border)', marginBottom: '1.5rem' }} />

        {/* Description */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}
        >
          {exp.description}
        </p>

        {/* Responsibilities */}
        <ul
          style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          aria-label="Responsibilities"
        >
          {exp.responsibilities.map((r) => (
            <li
              key={r}
              className="text-sm"
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)' }}
            >
              <span style={{ color: exp.color, flexShrink: 0, marginTop: '0.125rem' }} aria-hidden="true">▸</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>

        {/* Achievements */}
        {exp.achievements.length > 0 && (
          <div
            style={{
              padding:      '1.25rem 1.5rem',
              borderRadius: '0.75rem',
              background:   `${exp.color}08`,
              borderLeft:   `3px solid ${exp.color}`,
              marginBottom: '1.5rem',
            }}
          >
            <h5
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--text-primary)', marginBottom: '0.875rem' }}
            >
              🏆 Key Achievements
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {exp.achievements.map((a) => (
                <li
                  key={a}
                  className="text-sm"
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)' }}
                >
                  <span style={{ flexShrink: 0, marginTop: '0.125rem', color: '#facc15' }} aria-hidden="true">★</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {exp.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium"
              style={{
                padding:      '0.35rem 0.75rem',
                borderRadius: '0.5rem',
                border:       `1.5px solid ${exp.color}`,
                background:   `${exp.color}12`,
                color:        exp.color,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main export ────────────────────────────────────────────────────── */
export default function Experience() {
  const headerRef  = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section
      className="section-padding"
      style={{ background: 'var(--bg-primary)', paddingTop: '7rem' }}
    >
      <div className="container-custom">

        {/* ── Section header ─────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)', marginBottom: '0.875rem' }}
          >
            Where I&apos;ve worked
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold"
            style={{ color: 'var(--text-primary)' }}
          >
            Professional <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        {/* ── Experience timeline ─────────────────────────────────── */}
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
          {experiences.map((exp, i) => (
            <ExperienceEntry key={exp.id} exp={exp} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
