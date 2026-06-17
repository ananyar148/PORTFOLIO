/**
 * app/page.js  →  route: /
 * Landing (Hero) page only.
 */

import Hero           from '@/components/Hero';
import PageTransition from '@/components/PageTransition';

export const metadata = {
  title:       'Ananya Raj | Full Stack Developer',
  description: 'Welcome to Ananya Raj\'s portfolio — Full Stack Developer specialising in React, Next.js and Node.js.',
};

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
    </PageTransition>
  );
}
