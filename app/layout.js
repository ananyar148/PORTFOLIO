/**
 * app/layout.js — Root layout
 *
 * Imports global styles, sets metadata, and wraps every page
 * with the Navbar and Footer. The <html> element starts with
 * class="dark" so the page renders correctly before the client
 * hydrates and syncs with localStorage.
 */

import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title:       'Your Name | Full Stack Developer',
  description: 'Personal portfolio of a full stack developer specialising in React, Next.js, Node.js and modern web technologies.',
  keywords:    ['portfolio', 'developer', 'react', 'nextjs', 'full stack'],
  authors:     [{ name: 'Your Name' }],
  // Open Graph
  openGraph: {
    title:       'Your Name | Full Stack Developer',
    description: 'Explore my projects, skills, and experience.',
    type:        'website',
  },
};

export default function RootLayout({ children }) {
  return (
    /*
     * class="dark" gives an immediate dark background before JS runs,
     * matching the default in useTheme.js.  The hook will correct it
     * on the client if the user previously chose light mode.
     */
    <html lang="en" className="dark">
      <body>
        {/* Skip-to-content link for keyboard / screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                     focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg
                     focus:text-sm focus:font-semibold focus:text-white"
          style={{ background: 'var(--accent)' }}
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
