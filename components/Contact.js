'use client';

/**
 * Contact.js
 * Contact section with an info sidebar and a validated contact form.
 * Uses local state for a simulated submission (no external service required).
 */

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Contact info items ── */
const INFO_ITEMS = [
  { icon: '📧', label: 'Email',    value: 'ananya@email.com',              href: 'mailto:ananya@email.com'              },
  { icon: '📱', label: 'Phone',    value: '+1 (555) 000-0000',              href: 'tel:+15550000000'                      },
  { icon: '📍', label: 'Location', value: 'Your City, Country',             href: null                                    },
  { icon: '💻', label: 'GitHub',   value: 'github.com/ananyar148',          href: 'https://github.com/ananyar148'         },
  { icon: '🔗', label: 'LinkedIn', value: 'linkedin.com/in/ananyaraj',      href: 'https://linkedin.com'                  },
];

/* ── Form validation helper ── */
function validate(fields) {
  const errors = {};
  if (!fields.name.trim())    errors.name    = 'Name is required.';
  if (!fields.email.trim())   errors.email   = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Please enter a valid email address.';
  if (!fields.subject.trim()) errors.subject = 'Subject is required.';
  if (!fields.message.trim()) errors.message = 'Message is required.';
  else if (fields.message.trim().length < 20)
    errors.message = 'Message must be at least 20 characters.';
  return errors;
}

const INITIAL = { name: '', email: '', subject: '', message: '' };

/* ── Main export ── */
export default function Contact() {
  const [fields,  setFields]  = useState(INITIAL);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const headerRef  = useRef(null);
  const headerView = useInView(headerRef, { once: true, margin: '-80px' });

  /* Live field update */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* Submit handler — simulates an async send */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));   // simulate network delay
    setLoading(false);
    setSent(true);
    setFields(INITIAL);
  };

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="container-custom">

        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            Let's talk
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Have a project in mind or just want to say hi? My inbox is always open.
            I'll do my best to get back to you promptly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">

          {/* ── Left — contact info ── */}
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-4"
            aria-label="Contact information"
          >
            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Contact Info
            </h3>
            {INFO_ITEMS.map(({ icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-4 rounded-xl border transition-colors duration-200"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <span className="text-2xl w-10 text-center" aria-hidden="true">{icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                     style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm font-medium truncate block transition-colors duration-200
                                 hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.aside>

          {/* ── Right — form ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            {sent ? (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-10
                           rounded-3xl border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Message Sent!
                </h3>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              /* Contact form */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-8 rounded-3xl border space-y-5"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                aria-label="Contact form"
              >
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    label="Name"
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={fields.name}
                    error={errors.name}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Email"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={fields.email}
                    error={errors.email}
                    onChange={handleChange}
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
                  required
                />

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Message <span aria-hidden="true" style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project or idea..."
                    value={fields.message}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none
                               outline-none transition-all duration-200"
                    style={{
                      background: 'var(--bg-primary)',
                      border: `1.5px solid ${errors.message ? '#f87171' : 'var(--border)'}`,
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                    onBlur={(e)  => { e.target.style.borderColor = errors.message ? '#f87171' : 'var(--border)'; }}
                  />
                  {errors.message && (
                    <p id="message-error" role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.03, y: -2 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white
                             transition-opacity duration-200 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                  }}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      {/* Spinner */}
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="inline-block w-4 h-4 border-2 border-white border-t-transparent
                                   rounded-full"
                        aria-hidden="true"
                      />
                      Sending…
                    </>
                  ) : (
                    '✉️ Send Message'
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ── Reusable text field ── */
function FormField({ label, id, error, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold mb-1.5"
        style={{ color: 'var(--text-primary)' }}
      >
        {label} <span aria-hidden="true" style={{ color: 'var(--accent)' }}>*</span>
      </label>
      <input
        id={id}
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
        style={{
          background: 'var(--bg-primary)',
          border: `1.5px solid ${error ? '#f87171' : 'var(--border)'}`,
          color: 'var(--text-primary)',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={(e)  => { e.target.style.borderColor = error ? '#f87171' : 'var(--border)'; }}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs mt-1.5" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
    </div>
  );
}
