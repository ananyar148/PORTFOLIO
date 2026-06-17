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
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className={`relative flex gap-6 items-start ${isEven ? 'flex-row' : 'flex-row-reverse'} 
                  sm:flex-row sm:gap-8`}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 300 }}
          className="w-4 h-4 rounded-full border-4 mt-1 shrink-0"
          style={{ background: exp.color, borderColor: 'var(--bg-primary)' }}
          aria-hidden="true"
        />
        {/* vertical line below dot (except last) */}
        <div
          className="w-0.5 flex-1 mt-1 min-h-[3rem]"
          style={{ background: 'var(--border)' }}
          aria-hidden="true"
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 p-6 rounded-2xl border mb-6"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {exp.role}
            </h4>
            <p className="text-sm font-semibold" style={{ color: exp.color }}>
              {exp.company}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {exp.duration}
            </span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {exp.location} · {exp.type}
            </p>
          </div>
        </div>

        <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {exp.description}
        </p>

        {/* Responsibilities */}
        <ul className="space-y-1 mb-4" aria-label="Responsibilities">
          {exp.responsibilities.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: exp.color }} aria-hidden="true">▸</span>
              {r}
            </li>
          ))}
        </ul>

        {/* Achievements */}
        {exp.achievements.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>
              🏆 Key Achievements
            </h5>
            <ul className="space-y-1">
              {exp.achievements.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-yellow-400" aria-hidden="true">★</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {exp.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-xs font-medium border"
              style={{
                background: `${exp.color}15`,
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
      id="projects"
      className="section-padding"
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
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            What I've built
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A collection of projects that showcase my skills across the full stack.
            Click any card to learn more.
          </p>
        </motion.div>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10" role="group" aria-label="Filter projects by category">
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
          className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-24"
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
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            Where I've worked
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Professional <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        {/* Experience timeline */}
        <div className="max-w-3xl mx-auto">
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
