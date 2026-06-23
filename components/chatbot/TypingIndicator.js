'use client';
/**
 * TypingIndicator.js — animated "Annu is typing…" dots.
 */
import { motion } from 'framer-motion';

const DOT = {
  animate: { y: [0, -5, 0] },
  transition: (i) => ({
    duration: 0.6,
    repeat: Infinity,
    delay: i * 0.15,
    ease: 'easeInOut',
  }),
};

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{   opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2"
      aria-label="Annu is typing"
    >
      {/* Bot avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center
                   text-xs font-bold text-white shrink-0"
        style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, #06B6D4 100%)',
        }}
        aria-hidden="true"
      >
        A
      </div>

      {/* Dots */}
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-2xl"
        style={{
          background:   'var(--bg-card)',
          border:       '1px solid var(--border)',
          borderRadius: '4px 18px 18px 18px',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={DOT.animate}
            transition={DOT.transition(i)}
            className="w-1.5 h-1.5 rounded-full block"
            style={{ background: 'var(--accent)' }}
          />
        ))}
      </div>
    </motion.div>
  );
}
