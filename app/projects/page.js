/**
 * app/projects/page.js  →  route: /projects
 */

import Projects       from '@/components/Projects';
import PageTransition from '@/components/PageTransition';

export const metadata = {
  title:       'Projects | Ananya Raj',
  description: 'Explore Ananya Raj\'s featured projects and professional experience in web development.',
};

export default function ProjectsPage() {
  return (
    <PageTransition>
      <Projects />
    </PageTransition>
  );
}
