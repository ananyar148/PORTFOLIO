'use client';

/**
 * Hero.js
 * Full-viewport landing section.
 *
 * Changes applied:
 *  - Profile image loaded from /images/ananya.png
 *  - "Available for opportunities" badge is fully pill-shaped (rounded-full)
 *  - Both CTA buttons are fully rounded (rounded-full) with cleaner styling
 *  - Social icons row has explicit top margin (mt-8) separating it from the buttons
 *  - Layout properly centred vertically and horizontally
 *  - Scroll indicator pinned to bottom of section
 */

import { motion } from 'framer-motion';
import Image from 'next/image';

/* ── Social links ─────────────────────────────────────────────────── */
const SOCIALS = [
  {
    name: 'GitHub',
    href: 'https://github.com/ananyar148',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
          0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
          -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
          .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
          -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004
          1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7
          1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0
          1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484
          17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136
          1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85
          3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065
          2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225
          0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2
          24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: 'https://twitter.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401
          6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161
          17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
];

/* ── Framer Motion variants ─────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

/* ════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ── Background orbs ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--accent)' }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: '#ec4899', opacity: 0.12 }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: '#06b6d4' }}
        />
      </div>

      {/* ── Main centred content ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="container-custom w-full py-28 lg:py-16">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-14 lg:gap-20">

            {/* ── LEFT — text column ─────────────────────────────────── */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left"
            >

              {/* ① "Available for opportunities" — fully pill-shaped */}
              <motion.div variants={itemVariants} className="mb-6">
                <span
                  className="inline-flex items-center gap-2.5 px-5 py-2 text-sm font-semibold
                             border-2 rounded-full select-none"
                  style={{
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)',
                    background: 'rgba(99,102,241,0.08)',
                  }}
                >
                  {/* Pulsing green dot */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: '#4ade80' }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2.5 w-2.5"
                      style={{ background: '#4ade80' }}
                    />
                  </span>
                  Available for opportunities
                </span>
              </motion.div>

              {/* ② Name heading */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-4 tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Hi, I&rsquo;m{' '}
                <span className="gradient-text">Ananya Raj</span>
              </motion.h1>

              {/* ③ Role */}
              <motion.p
                variants={itemVariants}
                className="text-xl sm:text-2xl font-semibold mb-5"
                style={{ color: 'var(--accent)' }}
              >
                Full Stack Developer
              </motion.p>

              {/* ④ Bio */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg leading-relaxed mb-8 max-w-[480px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                I build elegant, performant web applications — from pixel-perfect
                UIs to robust back-end APIs. Passionate about clean code,
                great UX, and continuous learning.
              </motion.p>

              {/* ⑤ CTA buttons — both fully rounded (rounded-full) */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                {/* Primary — Download Resume */}
                <motion.a
                  href="/images/resume.pdf"
                  download
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5
                             rounded-full text-sm font-bold text-white
                             transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)',
                    boxShadow: '0 4px 24px rgba(99,102,241,0.40)',
                  }}
                >
                  {/* Download arrow icon */}
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                    <path fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1
                         0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414
                         1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download Resume
                </motion.a>

                {/* Secondary — Get In Touch */}
                <motion.button
                  onClick={() => scrollTo('contact')}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5
                             rounded-full text-sm font-bold border-2
                             transition-all duration-300"
                  style={{
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.10)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Message icon */}
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 002.003 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Get In Touch
                </motion.button>
              </motion.div>

              {/* ⑥ Social icons — mt-8 creates clear gap from buttons above */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start gap-3 mt-8"
                aria-label="Social media links"
              >
                {SOCIALS.map(({ name, href, svg }) => (
                  <motion.a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    whileHover={{ scale: 1.18, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center
                               border transition-all duration-300"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {svg}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT — profile image ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="flex-shrink-0 flex items-center justify-center"
            >
              {/* Floating wrapper */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* Glow halo */}
                <div
                  className="absolute inset-0 rounded-full blur-2xl scale-110 opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Slow-spinning dashed ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-3 rounded-full border-2 border-dashed opacity-25"
                  style={{ borderColor: 'var(--accent)' }}
                  aria-hidden="true"
                />

                {/* Photo frame */}
                <div
                  className="relative w-64 h-64 sm:w-72 sm:h-72 xl:w-80 xl:h-80
                             rounded-full overflow-hidden border-[3px]"
                  style={{ borderColor: 'var(--accent)' }}
                >
                  {/*
                    Profile photo — loaded from public/images/ananya.png
                    "fill" fills the container; object-cover crops to circle.
                  */}
                  <Image
                    src="/images/ananya.png"
                    alt="Ananya Raj — Full Stack Developer"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 640px) 256px, (max-width: 1280px) 288px, 320px"
                  />
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator — pinned to bottom of section ─────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="relative z-10 flex flex-col items-center gap-2 pb-8"
        aria-hidden="true"
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 rounded-full"
          style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
        />
      </motion.div>
    </section>
  );
}
