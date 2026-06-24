'use client';

/**
 * About.js
 * Combined About + Skills section.
 * All spacing via inline styles to guarantee rendering (Tailwind v4 scanner bypass).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skillCategories, stats } from '@/data/skills';
import { PROFILE } from '@/lib/chatData';

/* ── Animation variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = (delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
});

/* ── Skill category card ────────────────────────────────────────────── */
function SkillCard({ category }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      style={{
        padding:      '1.75rem 1.875rem',
        borderRadius: '1.25rem',
        border:       '1.5px solid var(--border)',
        background:   'var(--bg-card)',
        transition:   'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 28px rgba(59,130,246,0.2)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.375rem' }}>
        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">{category.icon}</span>
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {category.label}
        </h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {category.skills.map((skill) => (
          <span
            key={skill.name}
            className="text-sm font-medium"
            style={{
              padding:      '0.4rem 0.875rem',
              borderRadius: '9999px',
              border:       `1.5px solid ${category.color}`,
              background:   `${category.color}12`,
              color:        category.color,
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Stat card ──────────────────────────────────────────────────────── */
function StatCard({ stat, delay }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{
        padding:      '1.75rem 1rem',
        borderRadius: '1.25rem',
        border:       '1.5px solid var(--border)',
        background:   'var(--bg-card)',
        textAlign:    'center',
        transition:   'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(59,130,246,0.18)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.625rem' }} aria-hidden="true">
        {stat.icon}
      </div>
      <div className="text-3xl font-extrabold gradient-text" style={{ marginBottom: '0.375rem' }}>
        {stat.value}
      </div>
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {stat.label}
      </div>
    </motion.div>
  );
}

/* ── Main export ────────────────────────────────────────────────────── */
export default function About() {
  const headerRef  = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-80px' });

  const quickFacts = [
    { icon: '🎓', label: 'Education', value: PROFILE.education },
    { icon: '📍', label: 'Location',  value: PROFILE.location  },
    {
      icon: '💻', label: 'GitHub',
      value: 'AnanyaRaj14',
      href: PROFILE.github,
    },
    { icon: '🌍', label: 'Languages', value: 'English, Hindi, Maithili' },
    { icon: '🎯', label: 'Goal',      value: 'Build impactful, accessible products' },
    {
      icon: '📧', label: 'Email',
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
    },
  ];

  const interests = [
    'Web Development', 'UI/UX Design', 'Open Source',
    'System Design', 'Tech Blogging',
  ];

  const goals = [
    'Master advanced JavaScript patterns',
    'Contribute to major open-source projects',
    'Deepen knowledge of cloud architecture (AWS/GCP)',
    'Build and ship full-stack products end-to-end',
  ];

  return (
    <section
      className="section-padding"
      style={{ background: 'var(--bg-secondary)', paddingTop: '7rem' }}
    >
      <div className="container-custom">

        {/* ── Section header ───────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          variants={stagger()}
          initial="hidden"
          animate={headerView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}
          >
            Get to know me
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-extrabold"
            style={{ color: 'var(--text-primary)' }}
          >
            About <span className="gradient-text">Me</span>
          </motion.h2>
        </motion.div>

        {/* ── Personal info + interests/goals ──────────────────────── */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr',
            gap:                 '2.5rem',
            marginBottom:        '3.5rem',
            alignItems:          'start',
          }}
          className="about-two-col"
        >
          {/* Left — bio + quick facts */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)', marginBottom: '1.125rem' }}
            >
              Crafting digital experiences one line at a time ✨
            </h3>
            <p
              className="leading-relaxed"
              style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}
            >
              {PROFILE.bio}
            </p>
            <p
              className="leading-relaxed"
              style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}
            >
              When I&rsquo;m not coding, you&rsquo;ll find me exploring new frameworks, contributing
              to open-source projects, or diving deep into software architecture and system design.
            </p>

            {/* Quick facts */}
            <ul
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
              aria-label="Personal details"
            >
              {quickFacts.map(({ icon, label, value, href }) => (
                <li
                  key={label}
                  className="text-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}
                >
                  <span
                    style={{ fontSize: '1.25rem', width: '1.75rem', textAlign: 'center', flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)', width: '6rem', flexShrink: 0 }}
                  >
                    {label}:
                  </span>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      style={{
                        color:          'var(--accent)',
                        textDecoration: 'none',
                        borderBottom:   '1px solid transparent',
                        transition:     'border-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = 'var(--accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                    >
                      {value}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — interests + goals */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Interests card */}
            <div
              style={{
                padding:      '1.75rem 1.875rem',
                borderRadius: '1.25rem',
                border:       '1.5px solid var(--border)',
                background:   'var(--bg-card)',
              }}
            >
              <h4
                className="font-bold text-lg"
                style={{ color: 'var(--text-primary)', marginBottom: '1.125rem' }}
              >
                🎮 Interests
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {interests.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-medium interest-pill"
                    style={{
                      padding:      '0.35rem 0.875rem',
                      borderRadius: '9999px',
                      border:       '1.5px solid var(--accent)',
                      background:   'rgba(59,130,246,0.08)',
                      color:        'var(--accent)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Goals card */}
            <div
              style={{
                padding:      '1.75rem 1.875rem',
                borderRadius: '1.25rem',
                border:       '1.5px solid var(--border)',
                background:   'var(--bg-card)',
              }}
            >
              <h4
                className="font-bold text-lg"
                style={{ color: 'var(--text-primary)', marginBottom: '1.125rem' }}
              >
                🚀 Current Goals
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {goals.map((goal) => (
                  <li
                    key={goal}
                    className="text-sm"
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: 'var(--text-secondary)' }}
                  >
                    <span style={{ color: '#4ade80', flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── Stats row ────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger()}
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap:                 '1.25rem',
            marginBottom:        '4rem',
          }}
          className="stats-four-col"
        >
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={i * 0.1} />
          ))}
        </motion.div>

        {/* ── Skills header ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}
          >
            What I work with
          </p>
          <h2
            className="text-3xl sm:text-4xl font-extrabold"
            style={{ color: 'var(--text-primary)' }}
          >
            Technical <span className="gradient-text">Skills</span>
          </h2>
        </motion.div>

        {/* ── Skill category cards ─────────────────────────────────── */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
            gap:                 '1.5rem',
          }}
        >
          {skillCategories.map((cat) => (
            <SkillCard key={cat.id} category={cat} />
          ))}
        </div>

      </div>

      {/* ── Responsive helpers ───────────────────────────────────────── */}
      <style>{`
        @media (min-width: 1024px) {
          .about-two-col {
            grid-template-columns: 1fr 1fr !important;
            gap: 3rem !important;
          }
        }
        @media (min-width: 640px) {
          .stats-four-col {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
