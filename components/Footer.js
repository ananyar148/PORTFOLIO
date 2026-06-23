'use client';

/**
 * Footer.js
 * All spacing via inline styles to guarantee rendering (Tailwind v4 scanner bypass).
 */

import Link   from 'next/link';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home',     href: '/'        },
  { label: 'About',    href: '/about'   },
  { label: 'Projects', href: '/projects'},
  { label: 'Contact',  href: '/contact' },
];

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
          2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771
          C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227
          24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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

export default function Footer() {
  return (
    <footer
      style={{
        background:  'var(--bg-primary)',
        borderTop:   '1.5px solid var(--border)',
        position:    'relative',
      }}
    >
      {/* Thin accent gradient line at top */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     '2px',
          background: 'linear-gradient(90deg, transparent, var(--accent), #06B6D4, transparent)',
          opacity:    0.6,
        }}
        aria-hidden="true"
      />
      <div
        className="container-custom"
        style={{ paddingTop: '1.25rem', paddingBottom: '1.125rem' }}
      >

        {/* ── Top row: logo · nav · socials ───────────────────── */}
        <div
          style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '0.875rem',
          }}
          className="footer-top"
        >

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="gradient-text"
              style={{
                cursor:     'pointer',
                userSelect: 'none',
                fontSize:   '1.625rem',
                fontWeight: 800,
                display:    'block',
              }}
            >
              {'<Ananya Raj />'}
            </motion.span>
          </Link>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul
              style={{
                listStyle:      'none',
                padding:        0,
                margin:         0,
                display:        'flex',
                flexWrap:       'wrap',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '0.375rem 2rem',
              }}
            >
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize:       '0.9375rem',
                      fontWeight:     500,
                      color:          'var(--text-secondary)',
                      textDecoration: 'none',
                      transition:     'color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social icons */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            aria-label="Social media links"
          >
            {SOCIALS.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.93 }}
                style={{
                  width:          '2.25rem',
                  height:         '2.25rem',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  borderRadius:   '0.625rem',
                  border:         '1.5px solid var(--border)',
                  background:     'var(--bg-card)',
                  color:          'var(--text-secondary)',
                  textDecoration: 'none',
                  transition:     'border-color 0.2s, color 0.2s, background 0.2s',
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
                {social.svg}
              </motion.a>
            ))}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────── */}
        <div
          style={{
            width:      '100%',
            height:     '1px',
            background: 'var(--border)',
            margin:     '1rem 0',
          }}
        />

        {/* ── Bottom row: copyright · built with ──────────────── */}
        <div
          style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '0.375rem',
            textAlign:      'center',
            fontSize:       '0.8125rem',
            color:          'var(--text-secondary)',
          }}
          className="footer-bottom"
        >
          <p>
            © {new Date().getFullYear()}{' '}
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Ananya Raj
            </span>
            . All rights reserved.
          </p>

          <p
            style={{
              display:    'flex',
              flexWrap:   'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap:        '0.375rem',
            }}
          >
            <span>Built with</span>
            {[
              { label: 'Next.js',       href: 'https://nextjs.org'                  },
              { label: 'Tailwind CSS',  href: 'https://tailwindcss.com'             },
              { label: 'Framer Motion', href: 'https://www.framer.com/motion/'      },
            ].map(({ label, href }, i, arr) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight:     500,
                    color:          'var(--accent)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                >
                  {label}
                </a>
                {i < arr.length - 1 && (
                  <span style={{ color: 'var(--border)', fontWeight: 400 }}>•</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* ── Responsive: side-by-side on desktop ─────────────────── */}
      <style>{`
        @media (min-width: 1024px) {
          .footer-top {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          .footer-bottom {
            flex-direction: row !important;
            justify-content: space-between !important;
            text-align: left !important;
          }
        }
        @media (max-width: 639px) {
          .footer-top {
            gap: 0.75rem !important;
          }
          .footer-bottom {
            gap: 0.25rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
