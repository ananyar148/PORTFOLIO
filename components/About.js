'use client';

/**
 * About.js
 * Combined About + Skills section.
 * Includes personal info, career summary, education, stats,
 * and skill categories with animated progress bars.
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skillCategories, stats } from '@/data/skills';

/* ── Animation helpers ── */
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = (delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
});

/* ── Single animated skill bar ── */
function SkillBar({ name, level, color }) {
  const ref  = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        <span>{name}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{level}%</span>
      </div>
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} proficiency ${level}%`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${level}%` : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
}

/* ── Skill category card ── */
function SkillCard({ category }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="p-6 rounded-2xl border card-glow"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl" aria-hidden="true">{category.icon}</span>
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {category.label}
        </h3>
      </div>
      {category.skills.map((skill) => (
        <SkillBar
          key={skill.name}
          name={skill.name}
          level={skill.level}
          color={category.color}
        />
      ))}
    </motion.div>
  );
}

/* ── Stat highlight card ── */
function StatCard({ stat, delay }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl border text-center"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="text-3xl mb-2" aria-hidden="true">{stat.icon}</div>
      <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
      <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
    </motion.div>
  );
}

/* ── Main export ── */
export default function About() {
  const headerRef  = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section
      className="section-padding pt-28"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="container-custom">

        {/* Section header */}
        <motion.div
          ref={headerRef}
          variants={stagger()}
          initial="hidden"
          animate={headerView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            Get to know me
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            About <span className="gradient-text">Me</span>
          </motion.h2>
        </motion.div>

        {/* Personal info + summary */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Left – text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Crafting digital experiences one line at a time ✨
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I&rsquo;m a passionate full stack developer building modern web applications. I love turning complex problems into clean,
              user friendly solutions using the latest technologies.
            </p>
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              When I&rsquo;m not coding, you&rsquo;ll find me exploring new frameworks,
              contributing to open source projects, or enjoying a good cup of coffee
              while reading about software architecture.
            </p>

            {/* Quick facts */}
            <ul className="space-y-3" aria-label="Personal details">
              {[
                { icon: '🎓', label: 'Education',  value: 'B.Tech. Computer Science, 2026' },
                { icon: '📍', label: 'Location',   value: 'Kolkata, West Bengal'           },
                { icon: '💻', label: 'GitHub',     value: 'github.com/ananyar148'        },
                { icon: '🌍', label: 'Languages',  value: 'English, Hindi, Maithli'             },
                { icon: '🎯', label: 'Goal',       value: 'Build impactful, accessible products' },
              ].map(({ icon, label, value }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span className="text-xl w-7 text-center" aria-hidden="true">{icon}</span>
                  <span className="font-semibold w-24 shrink-0" style={{ color: 'var(--text-primary)' }}>{label}:</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right – interests + goals */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* Interests */}
            <div
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <h4 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                🎮 Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Web Development', 'UI/UX Design', 'Open Source', 'Machine Learning',
                  'System Design', 'Tech Blogging', 'Photography'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      background: 'rgba(99,102,241,0.08)',
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <h4 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                🚀 Current Goals
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {[
                  // 'Master advanced TypeScript patterns',
                  'Contribute to major open source projects',
                  'Build a SaaS product from scratch',
                  'Deepen knowledge of cloud architecture (AWS/GCP)',
                ].map((goal) => (
                  <li key={goal} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger()}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={i * 0.1} />
          ))}
        </motion.div>

        {/* Skills header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mt-3 mb-3" style={{ color: 'var(--accent)' }}>
            What I work with
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Technical <span className="gradient-text">Skills</span>
          </h2>
        </motion.div>

        {/* Skill category cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {skillCategories.map((cat) => (
            <SkillCard key={cat.id} category={cat} />
          ))}
        </div>

      </div>
    </section>
  );
}
