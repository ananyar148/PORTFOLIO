'use client';

/**
 * usePageScroll.js
 *
 * Detects intentional scroll / swipe gestures and navigates between
 * the portfolio's top-level routes in order:
 *   /  →  /about  →  /projects  →  /contact  (scroll down)
 *   /contact  →  /projects  →  /about  →  /  (scroll up)
 *
 * Rules:
 *  - Only fires when the user is at the top (scroll down) or
 *    bottom (scroll up) of the current page, so normal in-page
 *    scrolling is never hijacked.
 *  - 800 ms cooldown between navigations to prevent accidental
 *    multi-page jumps from a single gesture.
 *  - Supports mouse-wheel, keyboard (ArrowDown / ArrowUp /
 *    PageDown / PageUp), and touch swipe.
 */

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const ROUTES = ['/', '/about', '/projects', '/contact'];
const COOLDOWN = 800; // ms

export default function usePageScroll() {
  const router   = useRouter();
  const pathname = usePathname();
  const cooling  = useRef(false);
  const touchY   = useRef(null);

  useEffect(() => {
    function canNavigate(direction) {
      if (cooling.current) return false;

      const atTop    = window.scrollY <= 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;

      if (direction === 'down' && !atBottom) return false;
      if (direction === 'up'   && !atTop)    return false;
      return true;
    }

    function navigate(direction) {
      if (!canNavigate(direction)) return;

      const idx  = ROUTES.indexOf(pathname);
      if (idx === -1) return;

      const next = direction === 'down' ? idx + 1 : idx - 1;
      if (next < 0 || next >= ROUTES.length) return;

      cooling.current = true;
      setTimeout(() => { cooling.current = false; }, COOLDOWN);

      router.push(ROUTES[next]);
    }

    /* ── Wheel ── */
    function onWheel(e) {
      if (Math.abs(e.deltaY) < 30) return; // ignore tiny nudges
      navigate(e.deltaY > 0 ? 'down' : 'up');
    }

    /* ── Keyboard ── */
    function onKey(e) {
      if (['ArrowDown', 'PageDown'].includes(e.key)) navigate('down');
      if (['ArrowUp',   'PageUp'  ].includes(e.key)) navigate('up');
    }

    /* ── Touch ── */
    function onTouchStart(e) {
      touchY.current = e.touches[0].clientY;
    }
    function onTouchEnd(e) {
      if (touchY.current === null) return;
      const delta = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return; // ignore short taps
      navigate(delta > 0 ? 'down' : 'up');
      touchY.current = null;
    }

    window.addEventListener('wheel',      onWheel,      { passive: true });
    window.addEventListener('keydown',    onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('keydown',    onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [pathname, router]);
}
