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

/* ── Client-side validation ───────────────────────────────────────── */
function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim())    errors.name    = 'Name is required.';
  if (!email.trim())   errors.email   = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Enter a valid email address.';
  if (!message.trim())             errors.message = 'Message is required.';
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
  const [status,  setStatus]  = useState(null);
  const [apiMsg,  setApiMsg]  = useState('');

  const headerRef  = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-80px' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (status === 'error') setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

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
        setFields(INITIAL);
        setErrors({});
      } else {
        if (data.errors?.length) {
          const mapped = {};
          data.errors.forEach(({ field, message }) => { if (field) mapped[field] = message; });
          setErrors(mapped);
        }
        setStatus('error');
        setApiMsg(data.message || 'Something went wrong. Please try again or email me directly.');
      }
    } catch {
      setStatus('error');
      setApiMsg('Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="section-padding"
      style={{ background: 'var(--bg-secondary)', paddingTop: '7rem' }}
    >
      <div className="container-custom">

        {/* ── Section header ──────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}
          >
            Let&apos;s talk
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold"
            style={{ color: 'var(--text-primary)', margin: '0.75rem 0 1.5rem' }}
          >
            Get In <span className="gradient-text">Touch</span>
          </h2>
          {/* Paragraph — explicit bottom margin creates gap above grid */}
          <p
            className="text-base leading-relaxed"
            style={{
              color:     'var(--text-secondary)',
              maxWidth:  '38rem',
              margin:    '0 auto',
              padding:   '0 1rem',
            }}
          >
            Have a project in mind or just want to say hi? My inbox is always open.
            I&apos;ll do my best to get back to you promptly.
          </p>
        </motion.div>

        {/* ── Two-column grid ─────────────────────────────────────── */}
        {/* marginTop ≈ 56px on mobile → 64px on desktop              */}
        <div
          style={{
            marginTop:           '3.5rem',
            display:             'grid',
            gridTemplateColumns: '1fr',
            gap:                 '2rem',
            maxWidth:            '64rem',
            marginLeft:          'auto',
            marginRight:         'auto',
          }}
          className="lg:grid-cols-contact"
        >

          {/* ── Left — contact info ──────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            aria-label="Contact information"
            style={{
              background:   'var(--bg-card)',
              border:       '1.5px solid var(--border)',
              borderRadius: '1.25rem',
              padding:      '2.25rem 2rem',
              display:      'flex',
              flexDirection:'column',
              gap:          '1.25rem',
            }}
          >
            <h3
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}
            >
              Contact Info
            </h3>

            {INFO_ITEMS.map(({ icon, label, value, href }) => (
              <motion.div
                key={label}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '1.25rem',
                  padding:      '1.1rem 1.4rem',
                  borderRadius: '0.875rem',
                  border:       '1.5px solid var(--border)',
                  background:   'var(--bg-primary)',
                  transition:   'all 0.2s',
                }}
              >
                <span
                  style={{
                    fontSize:   '1.5rem',
                    width:      '2.5rem',
                    textAlign:  'center',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}
                  >
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{
                        color:    'var(--accent)',
                        display:  'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace:   'nowrap',
                      }}
                    >
                      {value}
                    </a>
                  ) : (
                    <p
                      className="text-sm font-medium"
                      style={{
                        color:        'var(--text-primary)',
                        overflow:     'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace:   'nowrap',
                      }}
                    >
                      {value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Availability note */}
            <div
              style={{
                padding:      '1.1rem 1.4rem',
                borderRadius: '0.875rem',
                border:       '1.5px solid var(--accent)',
                background:   'rgba(59,130,246,0.06)',
              }}
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
                  style={{
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     'center',
                    justifyContent: 'center',
                    textAlign:      'center',
                    padding:        '3rem 2.5rem',
                    borderRadius:   '1.5rem',
                    border:         '1.5px solid var(--border)',
                    background:     'var(--bg-card)',
                    minHeight:      '420px',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 18 }}
                    style={{
                      width:      '5rem',
                      height:     '5rem',
                      borderRadius: '50%',
                      display:    'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize:   '2rem',
                      marginBottom: '2rem',
                      background: 'linear-gradient(135deg,var(--accent) 0%,#06B6D4 100%)',
                      boxShadow:  '0 8px 32px rgba(59,130,246,0.35)',
                    }}
                  >
                    ✓
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-extrabold"
                    style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}
                  >
                    Message Sent! 🎉
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: 'var(--text-secondary)', maxWidth: '20rem', lineHeight: 1.6, marginBottom: '0.75rem' }}
                  >
                    {apiMsg}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}
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
                    className="text-sm font-bold text-white"
                    style={{
                      padding:    '0.875rem 2rem',
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg,var(--accent) 0%,#06B6D4 100%)',
                      boxShadow:  '0 4px 16px rgba(59,130,246,0.35)',
                      border:     'none',
                      cursor:     'pointer',
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
                  aria-label="Contact form"
                  style={{
                    background:   'var(--bg-card)',
                    border:       '1.5px solid var(--border)',
                    borderRadius: '1.5rem',
                    padding:      '2.5rem 2.25rem',
                    display:      'flex',
                    flexDirection:'column',
                    gap:          '1.75rem',
                  }}
                >
                  {/* ── API error banner ─────────────────────── */}
                  <AnimatePresence>
                    {status === 'error' && apiMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y:  0, height: 'auto' }}
                        exit={{   opacity: 0, y: -8, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          display:      'flex',
                          alignItems:   'flex-start',
                          gap:          '0.75rem',
                          padding:      '1rem 1.25rem',
                          borderRadius: '0.75rem',
                          border:       '1.5px solid #f87171',
                          background:   'rgba(248,113,113,0.08)',
                          color:        '#f87171',
                          fontSize:     '0.875rem',
                        }}
                        role="alert"
                      >
                        <span style={{ fontSize: '1.125rem', flexShrink: 0 }} aria-hidden="true">⚠️</span>
                        <span>{apiMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Name + Email — responsive two-column */}
                  <div
                    style={{
                      display:             'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap:                 '1.5rem',
                    }}
                  >
                    <FormField
                      label="Full Name"
                      id="name" type="text" name="name"
                      placeholder="Ananya Raj"
                      value={fields.name} error={errors.name}
                      onChange={handleChange} disabled={loading} required
                    />
                    <FormField
                      label="Email Address"
                      id="email" type="email" name="email"
                      placeholder="ananya@email.com"
                      value={fields.email} error={errors.email}
                      onChange={handleChange} disabled={loading} required
                    />
                  </div>

                  {/* Subject */}
                  <FormField
                    label="Subject"
                    id="subject" type="text" name="subject"
                    placeholder="Project enquiry"
                    value={fields.subject} error={errors.subject}
                    onChange={handleChange} disabled={loading} optional
                  />

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}
                    >
                      Message{' '}
                      <span aria-hidden="true" style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <textarea
                      id="message" name="message" rows={5}
                      placeholder="Tell me about your project or idea…"
                      value={fields.message}
                      onChange={handleChange}
                      disabled={loading}
                      required aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      style={{
                        width:        '100%',
                        padding:      '1rem 1.25rem',
                        borderRadius: '0.75rem',
                        fontSize:     '0.875rem',
                        resize:       'none',
                        lineHeight:   1.6,
                        outline:      'none',
                        transition:   'border-color 0.2s',
                        background:   'var(--bg-primary)',
                        border:       `1.5px solid ${errors.message ? '#f87171' : 'var(--border)'}`,
                        color:        'var(--text-primary)',
                        opacity:      loading ? 0.6 : 1,
                        boxSizing:    'border-box',
                      }}
                      onFocus={(e) => { if (!errors.message) e.target.style.borderColor = 'var(--accent)'; }}
                      onBlur={(e)  => { e.target.style.borderColor = errors.message ? '#f87171' : 'var(--border)'; }}
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{   opacity: 0, y: -4 }}
                          id="message-error" role="alert"
                          className="text-xs"
                          style={{ color: '#f87171', marginTop: '0.375rem' }}
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
                    className="text-sm font-bold text-white"
                    style={{
                      width:          '100%',
                      padding:        '1rem 2rem',
                      borderRadius:   '9999px',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            '0.625rem',
                      background:     'linear-gradient(135deg,var(--accent) 0%,#06B6D4 100%)',
                      opacity:        loading ? 0.75 : 1,
                      cursor:         loading ? 'not-allowed' : 'pointer',
                      boxShadow:      loading ? 'none' : '0 4px 20px rgba(59,130,246,0.38)',
                      border:         'none',
                      transition:     'opacity 0.2s',
                    }}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                          style={{
                            width:  '1rem',
                            height: '1rem',
                            borderRadius: '50%',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            flexShrink: 0,
                            display: 'block',
                          }}
                          aria-hidden="true"
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 002.003 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <p
                    className="text-xs text-center"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    You&apos;ll receive an auto-confirmation to your email address.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── Responsive grid: 2-col on large screens ────────────────── */}
      <style>{`
        @media (min-width: 1024px) {
          .lg\\:grid-cols-contact {
            grid-template-columns: 2fr 3fr !important;
            gap: 3rem !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .lg\\:grid-cols-contact {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ── Reusable input field ──────────────────────────────────────────── */
function FormField({ label, id, error, optional = false, disabled, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold"
        style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}
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
        style={{
          width:        '100%',
          padding:      '0.875rem 1.25rem',
          borderRadius: '0.75rem',
          fontSize:     '0.875rem',
          outline:      'none',
          transition:   'border-color 0.2s',
          background:   'var(--bg-primary)',
          border:       `1.5px solid ${error ? '#f87171' : 'var(--border)'}`,
          color:        'var(--text-primary)',
          opacity:      disabled ? 0.6 : 1,
          boxSizing:    'border-box',
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
            className="text-xs"
            style={{ color: '#f87171', marginTop: '0.375rem' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
