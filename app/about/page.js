/**
 * app/about/page.js  →  route: /about
 */

import About          from '@/components/About';
import PageTransition from '@/components/PageTransition';

export const metadata = {
  title:       'About | Ananya Raj',
  description: 'Learn about Ananya Raj — her background, skills, education, and goals as a Full Stack Developer.',
};

export default function AboutPage() {
  return (
    <PageTransition>
      <About />
    </PageTransition>
  );
}
