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

const INTERESTS = [
  'Web Development',
  'UI/UX Design',
  'Open Source',
  'Machine Learning',
  'System Design',
  'Tech Blogging',
  'Photography',
];

const PERSONAL_DETAILS = [
  { icon: '🎓', label: 'Education', value: 'B.Sc. Computer Science, 2023' },
  { icon: '📍', label: 'Location', value: 'Your City, Country' },
  { icon: '💻', label: 'GitHub', value: 'github.com/ananyar148' },
  { icon: '🌍', label: 'Languages', value: 'English (fluent)' },
  { icon: '🎯', label: 'Goal', value: 'Build impactful, accessible products' },
];

const CURRENT_GOALS = [
  'Master advanced TypeScript patterns',
  'Contribute to major open-source projects',
  'Build a SaaS product from scratch',
  'Deepen knowledge of cloud architecture (AWS/GCP)',
];

const CARD_CLASS =
  'w-full min-w-0 rounded-2xl border card-glow';

const CARD_PAD_CLASS =
  'p-6 sm:p-8';

const CARD_STYLE = {
  background: 'var(--bg-card)',
  borderColor: 'var(--border)',
  boxShadow: 'var(--shadow)',
};

/* ── Animation helpers ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = (delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
});

/* ── Single animated skill bar ── */
function SkillBar({ name, level, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="mb-4 last:mb-0">
      <div
        className="flex justify-between mb-1 text-sm font-medium"
        style={{ color: 'var(--text-primary)' }}
      >
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`${CARD_CLASS} ${CARD_PAD_CLASS} h-full`}
      style={CARD_STYLE}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl shrink-0" aria-hidden="true">
          {category.icon}
        </span>
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={`${CARD_CLASS} ${CARD_PAD_CLASS} flex h-full min-h-[168px] flex-col items-center justify-center text-center`}
      style={CARD_STYLE}
    >
      <div className="mb-3 text-3xl" aria-hidden="true">
        {stat.icon}
      </div>
      <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
      <div className="mt-2 text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
        {stat.label}
      </div>
    </motion.div>
  );
}

/* ── Main export ── */
export default function About() {
  const headerRef = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-40px' });

  return (
    <section
      className="section-padding overflow-x-hidden pt-28"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col items-center gap-14 md:gap-16 lg:gap-20">

          {/* Section header */}
          <motion.div
            ref={headerRef}
            variants={stagger()}
            initial="hidden"
            animate={headerView ? 'visible' : 'hidden'}
            className="w-full text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-4 text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              Get to know me
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-extrabold sm:text-5xl"
              style={{ color: 'var(--text-primary)' }}
            >
              About <span className="gradient-text">Me</span>
            </motion.h2>
          </motion.div>

          {/* Tagline + description */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mx-auto w-full max-w-[48rem] text-center"
          >
            <h3
              className="mx-auto mb-8 max-w-2xl text-2xl font-bold leading-snug sm:text-3xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Crafting digital experiences one line at a time ✨
            </h3>
            <div className="mx-auto space-y-5 text-pretty">
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                I&rsquo;m a passionate full stack developer with 3+ years of hands-on experience
                building modern web applications. I love turning complex problems into clean,
                user-friendly solutions using the latest technologies.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                When I&rsquo;m not coding, you&rsquo;ll find me exploring new frameworks,
                contributing to open-source projects, or enjoying a good cup of coffee
                while reading about software architecture.
              </p>
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mx-auto w-full max-w-5xl"
          >
            <div
              className={`${CARD_CLASS} flex flex-col items-center px-6 pt-8 pb-6 text-center sm:px-8 sm:pt-10 sm:pb-7 lg:px-10 lg:pt-12 lg:pb-8`}
              style={CARD_STYLE}
            >
              <h4
                className="mb-8 text-lg font-bold sm:mb-10 sm:text-xl"
                style={{ color: 'var(--text-primary)' }}
              >
                🎮 Interests
              </h4>
              <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-4">
                {INTERESTS.map((item) => (
                  <span
                    key={item}
                    className="interest-pill inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold leading-relaxed sm:px-7 sm:py-3 sm:text-base lg:px-8"
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
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger()}
            className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 0.1} />
            ))}
          </motion.div>

          {/* Personal details + goals */}
          <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className={`${CARD_CLASS} ${CARD_PAD_CLASS}`}
              style={CARD_STYLE}
            >
              <h4
                className="mb-5 text-center text-lg font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                About Me
              </h4>
              <ul className="space-y-4" aria-label="Personal details">
                {PERSONAL_DETAILS.map(({ icon, label, value }) => (
                  <li
                    key={label}
                    className="flex flex-col gap-1 text-sm sm:flex-row sm:items-start sm:gap-3"
                  >
                    <span className="flex shrink-0 items-center gap-2 sm:w-32">
                      <span className="text-xl" aria-hidden="true">
                        {icon}
                      </span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {label}:
                      </span>
                    </span>
                    <span className="min-w-0 break-words sm:flex-1" style={{ color: 'var(--text-secondary)' }}>
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className={`${CARD_CLASS} ${CARD_PAD_CLASS}`}
              style={CARD_STYLE}
            >
              <h4
                className="mb-5 text-center text-lg font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                🚀 Current Goals
              </h4>
              <ul className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {CURRENT_GOALS.map((goal) => (
                  <li key={goal} className="flex items-start gap-3 leading-relaxed">
                    <span className="mt-0.5 shrink-0 text-green-400">✓</span>
                    <span className="min-w-0 break-words">{goal}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Skills header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="w-full text-center"
          >
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              What I work with
            </p>
            <h2
              className="text-3xl font-extrabold sm:text-4xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Technical <span className="gradient-text">Skills</span>
            </h2>
          </motion.div>

          {/* Skill category cards */}
          <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {skillCategories.map((cat) => (
              <SkillCard key={cat.id} category={cat} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
