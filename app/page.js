/**
 * app/page.js — Home page
 *
 * Assembles all portfolio sections in order.
 * All heavy interactivity lives inside each section's own
 * Client Component; this file remains a Server Component.
 */

import Hero     from '@/components/Hero';
import About    from '@/components/About';
import Projects from '@/components/Projects';
import Contact  from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero     />
      <About    />
      <Projects />
      <Contact  />
    </>
  );
}
