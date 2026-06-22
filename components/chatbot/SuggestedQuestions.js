'use client';
/**
 * SuggestedQuestions.js
 * Horizontally scrollable chip row shown at the bottom of the chat.
 * Disappears after the user sends their first message.
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
      className="px-3 pb-1"
    >
      <p className="text-xs mb-2 px-1" style={{ color: 'var(--text-secondary)' }}>
        Suggested questions
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <motion.button
            key={s.label}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(s.query)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border
                       transition-colors duration-200 cursor-pointer"
            style={{
              background:   'rgba(99,102,241,0.07)',
              borderColor:  'var(--accent)',
              color:        'var(--accent)',
            }}
          >
            {s.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
