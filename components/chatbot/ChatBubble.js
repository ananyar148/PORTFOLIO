'use client';
/**
 * ChatBubble.js
 * Renders a single chat message bubble.
 * Supports simple **bold** markdown via inline parsing.
 */
import { motion } from 'framer-motion';

/* Convert **text** → <strong>text</strong> and \n → <br> */
function parseMarkdown(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const withBold  = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const withBreaks = withBold.replace(/\n/g, '<br>');
  return withBreaks;
}

export default function ChatBubble({ message }) {
  const isBot = message.role === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {/* Bot avatar */}
      {isBot && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center
                     text-xs font-bold text-white shrink-0 mb-0.5"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)',
          }}
          aria-hidden="true"
        >
          A
        </div>
      )}

      {/* Bubble */}
      <div
        className="max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
        style={
          isBot
            ? {
                background:  'var(--bg-card)',
                color:       'var(--text-primary)',
                borderRadius: '4px 18px 18px 18px',
                border:      '1px solid var(--border)',
              }
            : {
                background:  'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)',
                color:       '#ffffff',
                borderRadius: '18px 4px 18px 18px',
              }
        }
        /* Safe: we control the markdown parser — no user HTML ever rendered */
        dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }}
        role={isBot ? 'status' : undefined}
        aria-live={isBot ? 'polite' : undefined}
      />
    </motion.div>
  );
}
