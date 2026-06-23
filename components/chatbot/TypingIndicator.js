'use client';
/**
 * TypingIndicator.js — animated dots. UI only, logic unchanged.
 */
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{   opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}
      aria-label="Annu is typing"
    >
      {/* Bot avatar */}
      <div
        style={{
          width:          '1.875rem',
          height:         '1.875rem',
          borderRadius:   '50%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '0.75rem',
          fontWeight:     700,
          color:          '#fff',
          flexShrink:     0,
          background:     'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
          boxShadow:      '0 2px 8px rgba(59,130,246,0.4)',
        }}
        aria-hidden="true"
      >
        A
      </div>

      {/* Dots bubble */}
      <div
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '0.3rem',
          padding:      '0.75rem 1rem',
          borderRadius: '4px 1.125rem 1.125rem 1.125rem',
          background:   'rgba(15,31,61,0.95)',
          border:       '1px solid rgba(59,130,246,0.25)',
          boxShadow:    '0 2px 12px rgba(0,0,0,0.25)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            style={{
              width:        '0.4rem',
              height:       '0.4rem',
              borderRadius: '50%',
              display:      'block',
              background:   '#3B82F6',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
