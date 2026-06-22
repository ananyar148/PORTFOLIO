'use client';

/**
 * Projects.js
 * Projects grid with category filter + Professional Experience timeline.
 * Clicking a card opens ProjectModal with detailed info.
 * All spacing via inline styles to guarantee rendering (Tailwind v4 scanner bypass).
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { projects }    from '@/data/projects';
import { experiences } from '@/data/experience';
import ProjectCard  from './ProjectCard';
import ProjectModal from './ProjectModal';

const CATEGORIES = ['All', 'Full Stack', 'Frontend', 'Backend'];

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
            <p className="text-sm font-semibold" style={{ color: exp.color }}>
              {exp.company}
            </p>
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
export default function Projects() {
  const [activeFilter,     setFilter]   = useState('All');
  const [selectedProject, setSelected] = useState(null);

  const headerRef  = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-80px' });

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section
      className="section-padding"
      style={{ background: 'var(--bg-primary)', paddingTop: '7rem' }}
    >
      <div className="container-custom">

        {/* ── Projects header ─────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}
          >
            What I&apos;ve built
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold"
            style={{ color: 'var(--text-primary)', margin: '0.75rem 0 1.25rem' }}
          >
            My <span className="gradient-text">Projects</span>
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)', maxWidth: '38rem', margin: '0 auto', padding: '0 1rem' }}
          >
            A collection of projects that showcase my skills across the full stack.
            Click any card to learn more.
          </p>
        </motion.div>

        {/* ── Filter pills ────────────────────────────────────────── */}
        <div
          role="group"
          aria-label="Filter projects by category"
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            justifyContent: 'center',
            gap:            '0.75rem',
            marginBottom:   '2.5rem',
            marginTop:      '0.5rem',
          }}
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              aria-pressed={activeFilter === cat}
              className="text-sm font-semibold"
              style={{
                padding:      '0.5rem 1.375rem',
                borderRadius: '9999px',
                border:       `1.5px solid ${activeFilter === cat ? 'var(--accent)' : 'var(--border)'}`,
                background:   activeFilter === cat ? 'var(--accent)' : 'var(--bg-card)',
                color:        activeFilter === cat ? '#fff' : 'var(--text-secondary)',
                cursor:       'pointer',
                transition:   'all 0.2s',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* ── Project grid ────────────────────────────────────────── */}
        <motion.div
          layout
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap:                 '1.75rem',
            marginBottom:        '6rem',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{   opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}
              >
                <ProjectCard project={project} onOpen={setSelected} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Experience section header ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '1rem' }}
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

        {/* ── Experience timeline ──────────────────────────────────── */}
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
          {experiences.map((exp, i) => (
            <ExperienceEntry key={exp.id} exp={exp} index={i} />
          ))}
        </div>

      </div>

      {/* Project detail modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelected(null)} />
    </section>
  );
}
