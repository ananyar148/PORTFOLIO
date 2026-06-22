'use client';

/**
 * components/Contact.js
 *
 * Contact page — info sidebar + validated form that POSTs to
 * /api/contact.  Shows animated loading, success, and error states.
 * Values are preserved on failure and cleared only after success.
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/* ── Contact info sidebar items ───────────────────────────────────── */
const INFO_ITEMS = [
  {
    icon: '📧', label: 'Email',
    value: 'ananya@email.com',
    href:  'mailto:ananya@email.com',
  },
  {
    icon: '📍', label: 'Location',
    value: 'Kolkata, India',
    href:  null,
  },
  {
    icon: '💻', label: 'GitHub',
    value: 'github.com/ananyar148',
    href:  'https://github.com/ananyar148',
  },
  {
    icon: '🔗', label: 'LinkedIn',
    value: 'linkedin.com/in/ananyaraj',
    href:  'https://linkedin.com',
  },
];

/* ── Client-side validation (mirrors server rules) ────────────────── */
function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim())    errors.name    = 'Name is required.';
  if (!email.trim())   errors.email   = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Enter a valid email address.';
  if (!message.trim())          errors.message = 'Message is required.';
  else if (message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters.';
  return errors;
}

const INITIAL = { name: '', email: '', subject: '', message: '' };

/* ════════════════════════════════════════════════════════════════════ */
export default function Contact() {
  const [fields,  setFields]  = useState(INITIAL);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState(null); // null | 'success' | 'error'
  const [apiMsg,  setApiMsg]  = useState('');

  const headerRef  = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-80px' });

  /* Live field update — clears field error on keystroke */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (status === 'error') setStatus(null); // hide stale error banner
  };

  /* Submit ─────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Client-side guard */
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setStatus(null);
    setApiMsg('');

    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setApiMsg(data.message || 'Message sent!');
        setFields(INITIAL);   // clear form only on success
        setErrors({});
      } else {
        /* Server-side validation errors → map back to fields */
        if (data.errors?.length) {
          const mapped = {};
          data.errors.forEach(({ field, message }) => {
            if (field) mapped[field] = message;
          });
          setErrors(mapped);
        }
        setStatus('error');
        setApiMsg(
          data.message ||
          'Something went wrong. Please try again or email me directly.'
        );
      }
    } catch {
      /* Network-level failure */
      setStatus('error');
      setApiMsg('Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="section-padding pt-28"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="container-custom">

        {/* ── Section header ──────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Let&apos;s talk
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold mb-6 mt-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Get In <span className="gradient-text">Touch</span>
          </h2>
         <div className="w-full flex justify-center">
  <p
    className="max-w-2xl text-center text-base leading-relaxed px-4 sm:px-6 mb-30"
    style={{ color: "var(--text-secondary)" }}
  >
    Have a project in mind or just want to say hi? My inbox is always open.
    I&apos;ll do my best to get back to you promptly.
  </p>
</div>
        </motion.div>

        <div className="mt-20 sm:mt-24 grid lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto">

          {/* ── Left — contact info ──────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
           className="lg:col-span-2 mt-8 sm:mt-12 p-6 sm:p-8 rounded-2xl space-y-6 sm:space-y-8"
            aria-label="Contact information"
          >
            <h3
              className="text-xl font-bold mb-6 sm:mb-8"
              style={{ color: 'var(--text-primary)' }}
            >
              Contact Info
            </h3>

            {INFO_ITEMS.map(({ icon, label, value, href }) => (
              <motion.div
                key={label}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-5 p-6 rounded-xl border transition-all duration-200"
                style={{
                  background:   'var(--bg-card)',
                  borderColor:  'var(--border)',
                }}
              >
                <span className="text-2xl w-11 text-center shrink-0" aria-hidden="true">
                  {icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm font-medium truncate block hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Availability note */}
            <div
              className="p-6 rounded-xl border mt-4 sm:mt-6"
              style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'var(--accent)' }}
            >
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                  Response time:
                </span>{' '}
                I typically reply within 1–2 business days.
              </p>
            </div>
          </motion.aside> 

          {/* ── Right — form ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">

              {/* ── Success state ──────────────────────────────── */}
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.88, y: 20 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit={{   opacity: 0, scale: 0.95,  y: -10 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="flex flex-col items-center justify-center text-center
                             p-10 sm:p-12 rounded-3xl border min-h-[420px]"
                  style={{
                    background:  'var(--bg-card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {/* Animated checkmark circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 18 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center
                               text-4xl mb-8"
                    style={{
                      background: 'linear-gradient(135deg,var(--accent) 0%,#ec4899 100%)',
                      boxShadow:  '0 8px 32px rgba(99,102,241,0.35)',
                    }}
                  >
                    ✓
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-extrabold mb-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Message Sent! 🎉
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-3 max-w-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {apiMsg}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm mb-10"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Check your inbox — a confirmation email is on its way.
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setStatus(null); setApiMsg(''); }}
                    className="px-8 py-3 rounded-full text-sm font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg,var(--accent) 0%,#ec4899 100%)',
                      boxShadow:  '0 4px 16px rgba(99,102,241,0.35)',
                    }}
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>

              ) : (

                /* ── Contact form ────────────────────────────── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{   opacity: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="p-8 sm:p-10 rounded-3xl border space-y-6"
                  style={{
                    background:  'var(--bg-card)',
                    borderColor: 'var(--border)',
                  }}
                  aria-label="Contact form"
                >
                  {/* ── API error banner ─────────────────────── */}
                  <AnimatePresence>
                    {status === 'error' && apiMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y:  0, height: 'auto' }}
                        exit={{   opacity: 0, y: -8, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-start gap-3 p-5 rounded-xl border text-sm"
                        style={{
                          background:  'rgba(248,113,113,0.08)',
                          borderColor: '#f87171',
                          color:       '#f87171',
                        }}
                        role="alert"
                      >
                        <span className="text-lg shrink-0" aria-hidden="true">⚠️</span>
                        <span>{apiMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      label="Full Name"
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Ananya Raj"
                      value={fields.name}
                      error={errors.name}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <FormField
                      label="Email Address"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="ananya@email.com"
                      value={fields.email}
                      error={errors.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Subject */}
                  <FormField
                    label="Subject"
                    id="subject"
                    type="text"
                    name="subject"
                    placeholder="Project enquiry"
                    value={fields.subject}
                    error={errors.subject}
                    onChange={handleChange}
                    disabled={loading}
                    optional
                  />

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Message{' '}
                      <span aria-hidden="true" style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell me about your project or idea…"
                      value={fields.message}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className="w-full px-5 py-4 rounded-xl text-sm resize-none leading-relaxed
                                 outline-none transition-all duration-200"
                      style={{
                        background:   'var(--bg-primary)',
                        border:       `1.5px solid ${errors.message ? '#f87171' : 'var(--border)'}`,
                        color:        'var(--text-primary)',
                        opacity:      loading ? 0.6 : 1,
                      }}
                      onFocus={(e) => {
                        if (!errors.message) e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.message
                          ? '#f87171'
                          : 'var(--border)';
                      }}
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{   opacity: 0, y: -4 }}
                          id="message-error"
                          role="alert"
                          className="text-xs mt-1.5"
                          style={{ color: '#f87171' }}
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.03, y: -2 } : {}}
                    whileTap={!loading  ? { scale: 0.97 }         : {}}
                    className="w-full py-3.5 rounded-full text-sm font-bold text-white
                               flex items-center justify-center gap-2.5
                               transition-opacity duration-200"
                    style={{
                      background:  'linear-gradient(135deg,var(--accent) 0%,#ec4899 100%)',
                      opacity:     loading ? 0.75 : 1,
                      cursor:      loading ? 'not-allowed' : 'pointer',
                      boxShadow:   loading ? 'none' : '0 4px 20px rgba(99,102,241,0.38)',
                    }}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                          className="w-4 h-4 rounded-full border-2 border-white
                                     border-t-transparent shrink-0"
                          aria-hidden="true"
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 20 20" fill="currentColor"
                          width="16" height="16" aria-hidden="true"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2
                                   2 0 002.003 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0
                                   002-2V8.118z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                    You&apos;ll receive an auto-confirmation to your email address.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ── Reusable input field ──────────────────────────────────────────── */
function FormField({ label, id, error, optional = false, disabled, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {label}{' '}
        {optional ? (
          <span className="font-normal text-xs" style={{ color: 'var(--text-secondary)' }}>
            (optional)
          </span>
        ) : (
          <span aria-hidden="true" style={{ color: 'var(--accent)' }}>*</span>
        )}
      </label>
      <input
        id={id}
        disabled={disabled}
        aria-required={!optional}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full px-5 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
        style={{
          background:  'var(--bg-primary)',
          border:      `1.5px solid ${error ? '#f87171' : 'var(--border)'}`,
          color:       'var(--text-primary)',
          opacity:     disabled ? 0.6 : 1,
        }}
        onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={(e)  => { e.target.style.borderColor = error ? '#f87171' : 'var(--border)'; }}
        {...inputProps}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y:  0 }}
            exit={{   opacity: 0, y: -4 }}
            id={`${id}-error`}
            role="alert"
            className="text-xs mt-1.5"
            style={{ color: '#f87171' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
