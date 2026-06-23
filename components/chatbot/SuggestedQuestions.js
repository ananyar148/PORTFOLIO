'use client';
/**
 * SuggestedQuestions.js — suggestion chips. UI only, logic unchanged.
 */
import { motion } from 'framer-motion';
import { SUGGESTIONS } from '@/lib/chatData';

export default function SuggestedQuestions({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{   opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      style={{
        padding:      '0.5rem 0.875rem 0.625rem',
        borderTop:    '1px solid rgba(59,130,246,0.15)',
      }}
    >
      <p style={{ fontSize: '0.6875rem', color: 'rgba(113,162,210,0.7)', marginBottom: '0.5rem', letterSpacing: '0.03em' }}>
        Suggested questions
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {SUGGESTIONS.map((s) => (
          <motion.button
            key={s.label}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(s.query)}
            style={{
              padding:      '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontSize:     '0.75rem',
              fontWeight:   500,
              border:       '1px solid rgba(59,130,246,0.35)',
              background:   'rgba(59,130,246,0.1)',
              color:        '#60A5FA',
              cursor:       'pointer',
              transition:   'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'; }}
          >
            {s.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
