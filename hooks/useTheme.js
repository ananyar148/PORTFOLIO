'use client';

/**
 * useTheme.js
 * Custom hook — reads and toggles the dark/light theme.
 * Theme is stored in localStorage and applied via a class on <html>.
 */

import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  // Start with 'dark' as a sensible default; we'll sync with localStorage on mount.
  const [theme, setTheme] = useState('dark');

  /* On first render, read saved preference (or system preference). */
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      // Fall back to the user's OS preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      applyTheme(initial);
    }
  }, []);

  /** Add/remove the 'dark' class on <html> */
  function applyTheme(value) {
    const root = document.documentElement;
    if (value === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  /** Toggle between dark and light */
  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('portfolio-theme', next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
