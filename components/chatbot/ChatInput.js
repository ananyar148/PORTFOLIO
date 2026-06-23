'use client';
/**
 * ChatInput.js — text field + send button. UI only, logic unchanged.
 */
import { useState } from 'react';
import { motion }   from 'framer-motion';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  const active = !disabled && value.trim();

  return (
    <div
      style={{
        display:     'flex',
        alignItems:  'center',
        gap:         '0.5rem',
        padding:     '0.75rem 0.875rem',
        borderTop:   '1px solid rgba(59,130,246,0.15)',
        background:  'rgba(6,11,20,0.6)',
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder="Type a message…"
        aria-label="Chat message input"
        style={{
          flex:         1,
          padding:      '0.625rem 0.875rem',
          borderRadius: '0.75rem',
          fontSize:     '0.875rem',
          outline:      'none',
          transition:   'border-color 0.2s',
          background:   'rgba(15,31,61,0.8)',
          border:       '1.5px solid rgba(59,130,246,0.25)',
          color:        '#d1e8ff',
          opacity:      disabled ? 0.6 : 1,
        }}
        onFocus={(e)  => { e.target.style.borderColor = 'rgba(59,130,246,0.7)'; }}
        onBlur={(e)   => { e.target.style.borderColor = 'rgba(59,130,246,0.25)'; }}
      />

      <motion.button
        onClick={submit}
        disabled={disabled || !value.trim()}
        whileHover={active ? { scale: 1.08 } : {}}
        whileTap={active   ? { scale: 0.93 } : {}}
        aria-label="Send message"
        style={{
          width:          '2.375rem',
          height:         '2.375rem',
          borderRadius:   '0.75rem',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          border:         'none',
          cursor:         active ? 'pointer' : 'default',
          transition:     'background 0.2s, opacity 0.2s',
          background:     active
            ? 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
            : 'rgba(30,58,95,0.6)',
          color:          active ? '#fff' : 'rgba(96,165,250,0.4)',
          opacity:        disabled ? 0.5 : 1,
          boxShadow:      active ? '0 2px 12px rgba(59,130,246,0.4)' : 'none',
        }}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409
                   l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0
                   00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </motion.button>
    </div>
  );
}
