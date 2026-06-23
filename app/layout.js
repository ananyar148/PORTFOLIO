/**
 * app/layout.js — Root layout
 *
 * Shared shell: global CSS, Navbar, Footer, and the lazily-loaded Annu ChatBot.
 * ChatBot is loaded with next/dynamic (no SSR) so it doesn't bloat the initial
 * bundle and doesn't cause hydration mismatches.
 */

import '@/styles/globals.css';
import Navbar                from '@/components/Navbar';
import ChatBotLoader         from '@/components/chatbot/ChatBotLoader';
import PageScrollNavigator   from '@/components/PageScrollNavigator';

export const metadata = {
  title:       'Ananya Raj | Full Stack Developer',
  description: 'Personal portfolio of Ananya Raj — Full Stack Developer specialising in React, Next.js, Node.js and modern web technologies.',
  keywords:    ['portfolio', 'developer', 'react', 'nextjs', 'full stack', 'Ananya Raj'],
  authors:     [{ name: 'Ananya Raj' }],
  openGraph: {
    title:       'Ananya Raj | Full Stack Developer',
    description: 'Explore Ananya\'s projects, skills, and experience.',
    type:        'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body>
        {/* Skip-to-content for keyboard / screen-reader users */}
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

        {/* Scroll-gesture page navigation (wheel / swipe / keyboard) */}
        <PageScrollNavigator />

        <main id="main-content">
          {children}
        </main>

        {/* Annu — AI chatbot assistant (lazy, client-only) */}
        <ChatBotLoader />
      </body>
    </html>
  );
}
