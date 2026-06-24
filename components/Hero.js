'use client';

/**
 * Hero.js — Landing / home page
 * All spacing via inline styles to guarantee rendering (Tailwind v4 scanner bypass).
 */

import { motion } from 'framer-motion';
import Image      from 'next/image';
import Link       from 'next/link';

/* ── Social links ───────────────────────────────────────────────── */
const SOCIALS = [
  {
    name: 'GitHub',
    href: 'https://github.com/ananyar148',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839
          9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605
          -3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069
          -.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088
          2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951
          0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27
          2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337
          1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7
          1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92
          .678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019
          10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ananya-raj-796409297/',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037
          -1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046
          c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z
          M5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065z
          m1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0
          1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24
          22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  // {
  //   name: 'Twitter / X',
  //   href: 'https://twitter.com',
  //   svg: (
  //     <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
  //       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231
  //         -5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244
  //         2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  //     </svg>
  //   ),
  // },
];

/* ── Motion variants ────────────────────────────────────────────── */
const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ════════════════════════════════════════════════════════════════ */
export default function Hero() {
  return (
    <section
      style={{
        position:       'relative',
        display:        'flex',
        flexDirection:  'column',
        minHeight:      '100vh',
        background:     'var(--bg-primary)',
        overflow:       'hidden',
      }}
    >
      {/* ── Background orbs ─────────────────────────────────────── */}
      <div
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position:     'absolute',
            top:          '-10rem',
            left:         '-10rem',
            width:        '480px',
            height:       '480px',
            borderRadius: '50%',
            filter:       'blur(80px)',
            background:   'var(--accent)',
            opacity:      0.13,
          }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position:     'absolute',
            top:          '50%',
            right:        '-12rem',
            width:        '380px',
            height:       '380px',
            borderRadius: '50%',
            filter:       'blur(80px)',
            background:   '#06B6D4',
            opacity:      0.10,
          }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{
            position:     'absolute',
            bottom:       '2.5rem',
            left:         '33%',
            width:        '320px',
            height:       '320px',
            borderRadius: '50%',
            filter:       'blur(80px)',
            background:   '#06b6d4',
            opacity:      0.08,
          }}
        />
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div
        style={{
          flex:           1,
          display:        'flex',
          alignItems:     'center',
          position:       'relative',
          zIndex:         10,
        }}
      >
        <div
          className="container-custom"
          style={{ width: '100%', paddingTop: '5rem', paddingBottom: '5rem' }}
        >
          {/* Two-column: text left, photo right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="hero-row">

            {/* ── LEFT — text column ───────────────────────────── */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                flex:          1,
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                textAlign:     'center',
              }}
              className="hero-left"
            >

              {/* ② Name */}
              <motion.h1
                variants={itemVariants}
                style={{
                  fontSize:    'clamp(2.75rem, 6vw, 4.5rem)',
                  fontWeight:  800,
                  lineHeight:  1.1,
                  letterSpacing: '-0.02em',
                  color:       'var(--text-primary)',
                  marginBottom: '1.125rem',
                }}
              >
                Hi, I&rsquo;m{' '}
                <span className="gradient-text">Ananya Raj</span>
              </motion.h1>

              {/* ③ Role */}
              <motion.p
                variants={itemVariants}
                style={{
                  fontSize:     '1.5rem',
                  fontWeight:   600,
                  color:        'var(--accent)',
                  marginBottom: '1.25rem',
                }}
              >
                Full Stack Developer
              </motion.p>

              {/* ④ Bio */}
              <motion.p
                variants={itemVariants}
                style={{
                  fontSize:     '1.0625rem',
                  lineHeight:   1.75,
                  color:        'var(--text-secondary)',
                  maxWidth:     '32rem',
                  marginBottom: '2.5rem',
                }}
              >
                I build elegant, performant web applications — from pixel-perfect
                UIs to robust back-end APIs. Passionate about clean code,
                great UX, and continuous learning.
              </motion.p>

              {/* ⑤ CTA buttons */}
              <motion.div
                variants={itemVariants}
                style={{
                  display:        'flex',
                  flexWrap:       'wrap',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '1rem',
                  marginBottom:   '2rem',
                }}
                className="hero-ctas"
              >
                {/* Preview Resume */}
                <motion.a
                  href="/images/ananya_raj_.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display:        'inline-flex',
                    alignItems:     'center',
                    gap:            '0.625rem',
                    padding:        '0.875rem 2rem',
                    borderRadius:   '9999px',
                    fontSize:       '0.9375rem',
                    fontWeight:     700,
                    color:          '#fff',
                    textDecoration: 'none',
                    background:     'linear-gradient(135deg, var(--accent) 0%, #06B6D4 100%)',
                    boxShadow:      '0 6px 28px rgba(59,130,246,0.42)',
                    transition:     'opacity 0.2s',
                  }}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" width="17" height="17" aria-hidden="true">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274
                         4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0
                         4 4 0 018 0z"
                      clipRule="evenodd" />
                  </svg>
                  Preview Resume
                </motion.a>

                {/* Get In Touch */}
                <Link href="/contact" style={{ textDecoration: 'none' }}>
                  <motion.span
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display:        'inline-flex',
                      alignItems:     'center',
                      gap:            '0.625rem',
                      padding:        '0.875rem 2rem',
                      borderRadius:   '9999px',
                      fontSize:       '0.9375rem',
                      fontWeight:     700,
                      border:         '2px solid var(--accent)',
                      color:          'var(--accent)',
                      background:     'transparent',
                      cursor:         'pointer',
                      transition:     'background 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.10)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" width="17" height="17" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 002.003 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Get In Touch
                  </motion.span>
                </Link>
              </motion.div>

              {/* ⑥ Social icons */}
              <motion.div
                variants={itemVariants}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '0.875rem',
                }}
                aria-label="Social media links"
                className="hero-socials"
              >
                {SOCIALS.map(({ name, href, svg }) => (
                  <motion.a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    whileHover={{ scale: 1.15, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width:          '3rem',
                      height:         '3rem',
                      borderRadius:   '0.75rem',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      border:         '1.5px solid var(--border)',
                      background:     'var(--bg-card)',
                      color:          'var(--text-secondary)',
                      transition:     'border-color 0.2s, color 0.2s, background 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color       = 'var(--accent)';
                      e.currentTarget.style.background  = 'rgba(59,130,246,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color       = 'var(--text-secondary)';
                      e.currentTarget.style.background  = 'var(--bg-card)';
                    }}
                  >
                    {svg}
                  </motion.a>
                ))}
              </motion.div>

            </motion.div>

            {/* ── RIGHT — profile photo ────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative' }}
              >
                {/* Glow halo */}
                <div
                  style={{
                    position:     'absolute',
                    inset:        0,
                    borderRadius: '50%',
                    filter:       'blur(32px)',
                    transform:    'scale(1.12)',
                    opacity:      0.32,
                    background:   'linear-gradient(135deg, var(--accent) 0%, #06B6D4 100%)',
                  }}
                  aria-hidden="true"
                />
                {/* Spinning dashed ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position:     'absolute',
                    inset:        '-0.875rem',
                    borderRadius: '50%',
                    border:       '2px dashed var(--accent)',
                    opacity:      0.28,
                  }}
                  aria-hidden="true"
                />
                {/* Photo circle */}
                <div
                  style={{
                    position:     'relative',
                    width:        'clamp(220px, 28vw, 320px)',
                    height:       'clamp(220px, 28vw, 320px)',
                    borderRadius: '50%',
                    overflow:     'hidden',
                    border:       '3px solid var(--accent)',
                  }}
                >
                  <Image
                    src="/images/ananya.png"
                    alt="Ananya Raj — Full Stack Developer"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    priority
                    sizes="(max-width:640px) 220px, (max-width:1280px) 280px, 320px"
                  />
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Scroll nudge ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position:       'relative',
          zIndex:         10,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '0.5rem',
          paddingBottom:  '2.5rem',
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontSize:      '0.6875rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color:         'var(--text-secondary)',
          }}
        >
          explore
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width:      '1px',
            height:     '2.5rem',
            borderRadius: '9999px',
            background: 'linear-gradient(to bottom, var(--accent), transparent)',
          }}
        />
      </motion.div>

      {/* ── Responsive layout helpers ───────────────────────────── */}
      <style>{`
        /* Desktop: side-by-side, left-aligned text */
        @media (min-width: 1024px) {
          .hero-row {
            flex-direction: row !important;
            align-items: center !important;
            gap: 4rem !important;
          }
          .hero-left {
            align-items: flex-start !important;
            text-align: left !important;
          }
          .hero-ctas {
            justify-content: flex-start !important;
          }
          .hero-socials {
            justify-content: flex-start !important;
          }
        }
        /* Mobile: stack photo on top */
        @media (max-width: 1023px) {
          .hero-row {
            flex-direction: column-reverse !important;
          }
        }
      `}</style>
    </section>
  );
}
