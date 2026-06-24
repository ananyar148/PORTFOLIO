'use client';

/**
 * Projects.js
 * Projects grid with category filter.
 * Clicking a card opens ProjectModal with detailed info.
 * All spacing via inline styles to guarantee rendering (Tailwind v4 scanner bypass).
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { projects }    from '@/data/projects';
import ProjectCard  from './ProjectCard';
import ProjectModal from './ProjectModal';

const CATEGORIES = ['All', 'Full Stack', 'Frontend', 'Backend'];

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
            marginBottom:        '4rem',
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

      </div>

      {/* Project detail modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelected(null)} />
    </section>
  );
}
