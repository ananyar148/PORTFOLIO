'use client';

/**
 * Projects.js
 * Projects grid with category filter + Professional Experience timeline.
 * Clicking a card opens ProjectModal with detailed info.
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experience';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const CATEGORIES = ['All', 'Full Stack', 'Frontend', 'Backend'];

/* ── Experience timeline entry ── */
function ExperienceEntry({ exp, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mb-6 sm:mb-8 lg:mb-10"
    >
      {/* Card */}
      <div
        className="p-6 sm:p-8 lg:p-10 rounded-2xl border transition-all duration-300 hover:shadow-lg"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Header: Role, Company, and Duration */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-7">
          <div className="flex-1">
            <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {exp.role}
            </h4>
            <p className="text-sm sm:text-base font-semibold" style={{ color: exp.color }}>
              {exp.company}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span
              className="inline-block text-xs font-medium px-3 py-1.5 rounded-full border mb-2"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {exp.duration}
            </span>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {exp.location} · {exp.type}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-6" style={{ background: 'var(--border)' }} />

        {/* Description */}
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
          {exp.description}
        </p>

        {/* Responsibilities */}
        <div className="mb-6">
          <ul className="space-y-3" aria-label="Responsibilities">
            {exp.responsibilities.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="shrink-0 mt-0.5" style={{ color: exp.color }} aria-hidden="true">▸</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Achievements */}
        {exp.achievements.length > 0 && (
          <div className="mb-6 p-5 rounded-lg" style={{ background: `${exp.color}08`, borderLeft: `3px solid ${exp.color}` }}>
            <h5 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
              🏆 Key Achievements
            </h5>
            <ul className="space-y-3">
              {exp.achievements.map((a) => (
                <li key={a} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="shrink-0 mt-0.5 text-yellow-400" aria-hidden="true">★</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {exp.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{
                background: `${exp.color}12`,
                borderColor: exp.color,
                color: exp.color,
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

/* ── Main export ── */
export default function Projects() {
  const [activeFilter, setFilter] = useState('All');
  const [selectedProject, setSelected] = useState(null);

  const headerRef  = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-80px' });

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section
      className="section-padding pt-28"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="container-custom">

        {/* ── Projects header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 mt-7" style={{ color: 'var(--accent)' }}>
            What I've built
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed px-4 sm:px-6" style={{ color: 'var(--text-secondary)' }}>
            A collection of projects that showcase my skills across the full stack.
            Click any card to learn more.
          </p>
        </motion.div>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-10 mt-8 sm:mt-10" role="group" aria-label="Filter projects by category">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              aria-pressed={activeFilter === cat}
              className="px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200"
              style={{
                background: activeFilter === cat ? 'var(--accent)' : 'var(--bg-card)',
                borderColor: activeFilter === cat ? 'var(--accent)' : 'var(--border)',
                color: activeFilter === cat ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Project grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-24 sm:mb-28 lg:mb-32"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
              >
                <ProjectCard project={project} onOpen={setSelected} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Experience section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20 mt-20 sm:mt-24 lg:mt-28"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
            Where I've worked
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Professional <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        {/* Experience timeline */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
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
