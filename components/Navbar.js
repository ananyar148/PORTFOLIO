'use client';

/**
 * Navbar.js
 * Multi-page navigation using next/link + usePathname for active highlighting.
 * No more anchor-scroll or IntersectionObserver — each link is a real route.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'About',    href: '/about'    },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact',  href: '/contact'  },
];

export default function Navbar() {
  const pathname              = usePathname();
  const [menuOpen, setMenu]   = useState(false);
  const [scrolled, setScroll] = useState(false);

  /* Close mobile menu on route change */
  useEffect(() => { setMenu(false); }, [pathname]);

  /* Shadow on scroll */
  useEffect(() => {
    const fn = () => setScroll(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? 'color-mix(in srgb, var(--bg-primary) 88%, transparent)'
          : 'transparent',
        backdropFilter:  scrolled ? 'blur(14px)' : 'none',
        boxShadow:       scrolled ? 'var(--shadow)' : 'none',
        borderBottom:    scrolled ? '1px solid var(--border)' : 'none',
      }}
    >
      <div className="container-custom flex items-center justify-between h-16">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link href="/" aria-label="Home">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-xl md:text-2xl font-extrabold tracking-tight
                       select-none gradient-text cursor-pointer"
          >
            &lt;Ananya Raj /&gt;
          </motion.span>
        </Link>

        {/* ── Desktop links ────────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="relative text-sm font-medium transition-colors duration-200
                             pb-1 outline-none"
                  style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  {label}
                  {/* Animated underline for active route */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: 'var(--accent)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right controls ───────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center
                       justify-center gap-[5px] rounded-lg"
            style={{ background: 'var(--bg-card)' }}
            onClick={() => setMenu((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              className="w-5 h-0.5 rounded-full block"
              style={{ background: 'var(--text-primary)' }}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              className="w-5 h-0.5 rounded-full block"
              style={{ background: 'var(--text-primary)' }}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              className="w-5 h-0.5 rounded-full block"
              style={{ background: 'var(--text-primary)' }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="md:hidden overflow-hidden"
            style={{
              background:  'var(--bg-secondary)',
              borderTop:   '1px solid var(--border)',
            }}
          >
            <ul className="container-custom py-5 flex flex-col gap-1" role="list">
              {NAV_LINKS.map(({ label, href }, i) => {
                const active = isActive(href);
                return (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                 text-sm font-semibold transition-colors duration-200"
                      style={{
                        background: active ? 'rgba(59,130,246,0.10)' : 'transparent',
                        color:      active ? 'var(--accent)' : 'var(--text-primary)',
                      }}
                    >
                      {/* Active dot */}
                      {active && (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: 'var(--accent)' }}
                          aria-hidden="true"
                        />
                      )}
                      {label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
