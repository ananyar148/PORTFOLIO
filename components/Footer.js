'use client';

/**
 * Footer.js
 * Site footer with logo, nav links, social icons, and copyright.
 */

import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home',     href: '#home'     },
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
];

const SOCIALS = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
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
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
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
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401
          6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161
          17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
];

const scrollTo = (href) => {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  return (
    <footer
      style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}
      role="contentinfo"
    >
      <div className="container-custom py-12">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">

          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-extrabold gradient-text select-none"
            aria-label="Back to top"
          >
            &lt;Ananya /&gt;
          </motion.a>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                    className="text-sm font-medium transition-colors duration-200 hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3" role="list" aria-label="Social media links">
            {SOCIALS.map(({ name, href, svg }) => (
              <motion.a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                role="listitem"
                className="w-9 h-9 rounded-lg flex items-center justify-center border
                           transition-colors duration-200"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                }}
              >
                {svg}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: 'var(--border)' }} aria-hidden="true" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
             style={{ color: 'var(--text-secondary)' }}>
          <p>
            &copy; {new Date().getFullYear()} <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Ananya Raj</span>. All rights reserved.
          </p>
          <p>
            Built with{' '}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer"
               className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Next.js
            </a>
            ,{' '}
            <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer"
               className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Tailwind CSS
            </a>
            {' '}&amp;{' '}
            <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer"
               className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Framer Motion
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
