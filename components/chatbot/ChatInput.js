'use client';
/**
 * ChatInput.js — text field + send button at the bottom of the chat window.
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-3 border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder="Type a message…"
        aria-label="Chat message input"
        className="flex-1 px-3 py-2 rounded-xl text-sm outline-none
                   transition-all duration-200"
        style={{
          background:  'var(--bg-primary)',
          border:      '1.5px solid var(--border)',
          color:       'var(--text-primary)',
          opacity:     disabled ? 0.6 : 1,
        }}
        onFocus={(e)  => { e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={(e)   => { e.target.style.borderColor = 'var(--border)'; }}
      />

      <motion.button
        onClick={submit}
        disabled={disabled || !value.trim()}
        whileHover={!disabled && value.trim() ? { scale: 1.08 } : {}}
        whileTap={!disabled && value.trim()  ? { scale: 0.93 } : {}}
        aria-label="Send message"
        className="w-9 h-9 rounded-xl flex items-center justify-center
                   transition-all duration-200 shrink-0"
        style={{
          background: !disabled && value.trim()
            ? 'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)'
            : 'var(--bg-card)',
          color:   !disabled && value.trim() ? '#fff' : 'var(--text-secondary)',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {/* Send arrow */}
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409
                   l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0
                   00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </motion.button>
    </div>
  );
}
