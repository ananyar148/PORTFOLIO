'use client';
/**
 * ChatBot.js — Annu powered by Google Gemini
 *
 * Flow per message:
 *   1. User types → bubble added immediately
 *   2. Typing indicator shown
 *   3. POST /api/chat  { message, history }
 *   4. Server calls Gemini, also detects nav intent
 *   5. Bot bubble added, navigate if needed
 *
 * History is kept in component state and sent with every request so
 * Gemini has full context of the conversation.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence }                   from 'framer-motion';
import { useRouter }                                 from 'next/navigation';

import { WELCOME }         from '@/lib/chatData';
import ChatHeader          from './ChatHeader';
import ChatBubble          from './ChatBubble';
import TypingIndicator     from './TypingIndicator';
import SuggestedQuestions  from './SuggestedQuestions';
import ChatInput           from './ChatInput';

/* ── Unique id helper ───────────────────────────────────────────── */
let _id = 0;
const uid = () => `msg-${++_id}`;

/* ── Initial welcome message ────────────────────────────────────── */
const INITIAL_MESSAGES = [
  { id: uid(), role: 'bot', text: WELCOME },
];

/* ════════════════════════════════════════════════════════════════ */
export default function ChatBot() {
  const router = useRouter();

  const [open,          setOpen]         = useState(false);
  const [minimised,     setMinimised]    = useState(false);
  const [messages,      setMessages]     = useState(INITIAL_MESSAGES);
  const [typing,        setTyping]       = useState(false);
  const [userHasTyped,  setUserHasTyped] = useState(false);

  /*
   * Gemini history — parallel array to messages, but only contains
   * user/model turns (no bot welcome, no system messages).
   * Sent to the server with every request for multi-turn context.
   */
  const geminiHistory = useRef([]);

  const bottomRef = useRef(null);

  /* ── Auto-scroll ─────────────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /* ── Close on Escape ─────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open]);

  /* ── Send message ────────────────────────────────────────────── */
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setUserHasTyped(true);

    /* 1 — Show user bubble immediately */
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'user', text: trimmed },
    ]);

    /* 2 — Show typing indicator */
    setTyping(true);

    try {
      /* 3 — Call server-side Gemini proxy */
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          message: trimmed,
          /* Send the current Gemini history for multi-turn context */
          history: geminiHistory.current,
        }),
      });

      const data = await res.json();

      /* 4 — Update Gemini history with this turn */
      geminiHistory.current = [
        ...geminiHistory.current,
        { role: 'user',  text: trimmed    },
        { role: 'model', text: data.reply },
      ];

      /* 5 — Add bot bubble */
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'bot', text: data.reply },
      ]);

      /* 6 — Navigate if the server detected a nav intent */
      if (data.navigate) {
        setTimeout(() => {
          router.push(data.navigate);
          setMinimised(true);
        }, 1000);
      }

    } catch (err) {
      console.error('[ChatBot] fetch error:', err);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id:   uid(),
          role: 'bot',
          text: `⚠️ I couldn't connect right now. Please try again in a moment!`,
        },
      ]);
    }
  }, [router, typing]);

  /* ── Suggestion chip handler ─────────────────────────────────── */
  const handleSuggestion = useCallback((query) => {
    sendMessage(query);
  }, [sendMessage]);

  /* ── Pulse animation for launcher ───────────────────────────── */
  const pulseVariants = {
    idle:  { scale: 1 },
    pulse: {
      scale:      [1, 1.1, 1],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  /* ════════════════════════════════════════════════════════════════
     Render
  ════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Floating launcher button ─────────────────────────── */}
      <motion.button
        onClick={() => { setOpen(true); setMinimised(false); }}
        variants={pulseVariants}
        initial="idle"
        animate={open ? 'idle' : 'pulse'}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Open chat with Annu"
        style={{
          position:   'fixed',
          bottom:     '1.5rem',
          right:      '1.5rem',
          zIndex:     90,
          width:      '3.5rem',
          height:     '3.5rem',
          borderRadius: '50%',
          display:    open && !minimised ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--accent) 0%, #06B6D4 100%)',
          boxShadow:  '0 8px 32px  "rgba(59,130,246,$($args[0].Groups[1].Value))" ',
          border:     'none',
          cursor:     'pointer',
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" width="24" height="24" aria-hidden="true">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9
                   2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>

        {/* Green unread dot */}
        {!open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position:     'absolute',
              top:          '2px',
              right:        '2px',
              width:        '14px',
              height:       '14px',
              borderRadius: '50%',
              background:   '#4ade80',
              border:       '2px solid white',
            }}
            aria-hidden="true"
          />
        )}
      </motion.button>

      {/* ── Chat window ──────────────────────────────────────── */}
      <AnimatePresence>
        {open && !minimised && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.85,  y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            role="dialog"
            aria-label="Chat with Annu"
            aria-modal="false"
            style={{
              position:     'fixed',
              bottom:       '6rem',
              right:        '1.5rem',
              zIndex:       90,
              display:      'flex',
              flexDirection:'column',
              borderRadius: '1rem',
              overflow:     'hidden',
              boxShadow:    '0 25px 60px rgba(0,0,0,0.25)',
              width:        'min(380px, calc(100vw - 3rem))',
              height:       'min(580px, calc(100vh - 140px))',
              background:   'var(--bg-secondary)',
              border:       '1px solid var(--border)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Header */}
            <ChatHeader
              onMinimise={() => setMinimised(true)}
              onClose={() => setOpen(false)}
            />

            {/* Message list */}
            <div
              style={{
                flex:       1,
                overflowY:  'auto',
                padding:    '0.75rem',
                display:    'flex',
                flexDirection: 'column',
                gap:        '0.75rem',
                scrollbarWidth: 'thin',
              }}
            >
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              <AnimatePresence>
                {typing && <TypingIndicator key="typing" />}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Suggestion chips — hide once user has typed */}
            <AnimatePresence>
              {!userHasTyped && (
                <SuggestedQuestions
                  key="suggestions"
                  onSelect={handleSuggestion}
                />
              )}
            </AnimatePresence>

            {/* Input */}
            <ChatInput onSend={sendMessage} disabled={typing} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimised pill ───────────────────────────────────── */}
      <AnimatePresence>
        {open && minimised && (
          <motion.button
            key="minimised-pill"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{   opacity: 0, y: 20  }}
            onClick={() => setMinimised(false)}
            aria-label="Restore Annu chat"
            style={{
              position:     'fixed',
              bottom:       '1.5rem',
              right:        '1.5rem',
              zIndex:       90,
              display:      'flex',
              alignItems:   'center',
              gap:          '0.5rem',
              padding:      '0.625rem 1rem',
              borderRadius: '999px',
              background:   'linear-gradient(135deg, var(--accent) 0%, #06B6D4 100%)',
              boxShadow:    '0 4px 20px  "rgba(59,130,246,$($args[0].Groups[1].Value))" ',
              border:       'none',
              cursor:       'pointer',
              color:        'white',
              fontSize:     '0.875rem',
              fontWeight:   600,
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2
                       2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3
                       3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            Annu
            <span
              style={{
                width: '8px', height: '8px',
                borderRadius: '50%', background: '#4ade80',
              }}
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
