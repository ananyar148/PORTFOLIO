'use client';
/**
 * ChatHeader.js — top bar of the chat window.
 * Shows avatar, name/status, minimise and close buttons.
 */
import { motion } from 'framer-motion';

export default function ChatHeader({ onMinimise, onClose }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-t-2xl shrink-0"
      style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #06B6D4 100%)',
      }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center
                       text-lg font-bold text-white select-none"
            style={{ background: 'rgba(255,255,255,0.2)' }}
            aria-hidden="true"
          >
            A
          </div>
          {/* Online dot */}
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
            style={{ background: '#4ade80' }}
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Annu</p>
          <p className="text-xs text-white/75 mt-0.5">Virtual Assistant · Online</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Minimise */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMinimise}
          aria-label="Minimise chat"
          className="w-7 h-7 rounded-full flex items-center justify-center
                     text-white/80 hover:text-white hover:bg-white/20
                     transition-colors duration-200"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M2 8h12" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" fill="none" />
          </svg>
        </motion.button>
        {/* Close */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          aria-label="Close chat"
          className="w-7 h-7 rounded-full flex items-center justify-center
                     text-white/80 hover:text-white hover:bg-white/20
                     transition-colors duration-200"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
            <path d="M2 2l12 12M14 2L2 14"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  fill="none" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
