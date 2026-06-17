'use client';

/**
 * ThemeToggle.js
 * Sun / Moon button that toggles dark and light mode.
 */

import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-10 h-10 rounded-full flex items-center justify-center
                 transition-colors duration-300"
      style={{
        background: isDark ? 'rgba(129,140,248,0.15)' : 'rgba(99,102,241,0.1)',
      }}
    >
      {/* Moon icon */}
      <motion.span
        initial={false}
        animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 90 }}
        transition={{ duration: 0.3 }}
        className="absolute text-xl select-none"
        aria-hidden
      >
        🌙
      </motion.span>

      {/* Sun icon */}
      <motion.span
        initial={false}
        animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? -90 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute text-xl select-none"
        aria-hidden
      >
        ☀️
      </motion.span>
    </motion.button>
  );
}
