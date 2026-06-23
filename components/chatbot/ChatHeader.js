'use client';
/**
 * ChatHeader.js — top bar of the chat window. UI only, no logic changes.
 */
import { motion } from 'framer-motion';

export default function ChatHeader({ onMinimise, onClose }) {
  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         '0.875rem 1rem',
        flexShrink:      0,
        background:      'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)',
        borderBottom:    '1px solid rgba(59,130,246,0.2)',
      }}
    >
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Avatar circle */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width:           '2.5rem',
              height:          '2.5rem',
              borderRadius:    '50%',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              background:      'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              fontSize:        '1rem',
              fontWeight:      700,
              color:           '#fff',
              userSelect:      'none',
              boxShadow:       '0 0 0 2px rgba(6,182,212,0.4)',
            }}
            aria-hidden="true"
          >
            A
          </div>
          {/* Online dot */}
          <span
            style={{
              position:     'absolute',
              bottom:       '1px',
              right:        '1px',
              width:        '0.625rem',
              height:       '0.625rem',
              borderRadius: '50%',
              background:   '#4ade80',
              border:       '2px solid #0f2744',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Name + status */}
        <div>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#e2f0ff', lineHeight: 1.2 }}>
            Annu
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.6)', marginTop: '0.15rem' }}>
            Virtual Assistant · Online
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMinimise}
          aria-label="Minimise chat"
          style={{
            width:           '1.875rem',
            height:          '1.875rem',
            borderRadius:    '50%',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            background:      'transparent',
            border:          'none',
            color:           'rgba(226,240,255,0.7)',
            cursor:          'pointer',
            transition:      'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(226,240,255,0.7)'; }}
        >
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          aria-label="Close chat"
          style={{
            width:           '1.875rem',
            height:          '1.875rem',
            borderRadius:    '50%',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            background:      'transparent',
            border:          'none',
            color:           'rgba(226,240,255,0.7)',
            cursor:          'pointer',
            transition:      'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(226,240,255,0.7)'; }}
        >
          <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
