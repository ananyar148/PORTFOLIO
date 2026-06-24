/**
 * app/experience/page.js  →  route: /experience
 */

import Experience     from '@/components/Experience';
import PageTransition from '@/components/PageTransition';

export const metadata = {
  title:       'Experience | Ananya Raj',
  description: 'Ananya Raj\'s professional work experience as a Full Stack Developer.',
};

export default function ExperiencePage() {
  return (
    <PageTransition>
      <Experience />
    </PageTransition>
  );
}
