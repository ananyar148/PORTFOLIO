'use client';

/**
 * PageTransition.js
 * Wraps every page with a subtle fade+slide-up entrance.
 * Used in each page's layout or directly inside page components.
 */

import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
