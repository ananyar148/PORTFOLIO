'use client';
/**
 * ChatBubble.js — single chat message bubble. UI only, logic unchanged.
 * Supports **bold** markdown and \n → <br>.
 */
import { motion } from 'framer-motion';

/* Convert **text** → <strong> and \n → <br> */
function parseMarkdown(text) {
  const escaped    = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const withBold   = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
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
      style={{
        display:        'flex',
        alignItems:     'flex-end',
        gap:            '0.5rem',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
      }}
    >
      {/* Bot avatar */}
      {isBot && (
        <div
          style={{
            width:           '1.875rem',
            height:          '1.875rem',
            borderRadius:    '50%',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            fontSize:        '0.75rem',
            fontWeight:      700,
            color:           '#fff',
            flexShrink:      0,
            marginBottom:    '2px',
            background:      'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
            boxShadow:       '0 2px 8px rgba(59,130,246,0.4)',
          }}
          aria-hidden="true"
        >
          A
        </div>
      )}

      {/* Bubble */}
      <div
        style={
          isBot
            ? {
                maxWidth:     '78%',
                padding:      '0.75rem 1rem',
                borderRadius: '4px 1.125rem 1.125rem 1.125rem',
                fontSize:     '0.875rem',
                lineHeight:   1.6,
                background:   'rgba(15,31,61,0.95)',
                color:        '#d1e8ff',
                border:       '1px solid rgba(59,130,246,0.25)',
                boxShadow:    '0 2px 12px rgba(0,0,0,0.25)',
              }
            : {
                maxWidth:     '78%',
                padding:      '0.75rem 1rem',
                borderRadius: '1.125rem 4px 1.125rem 1.125rem',
                fontSize:     '0.875rem',
                lineHeight:   1.6,
                background:   'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                color:        '#fff',
                boxShadow:    '0 2px 12px rgba(59,130,246,0.35)',
              }
        }
        dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }}
        role={isBot ? 'status' : undefined}
        aria-live={isBot ? 'polite' : undefined}
      />
    </motion.div>
  );
}
