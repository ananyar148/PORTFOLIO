'use client';

/**
 * PageScrollNavigator.js
 *
 * Zero-render client component that activates the scroll-based
 * page navigation hook. Drop it anywhere inside the root layout.
 */

import usePageScroll from '@/hooks/usePageScroll';

export default function PageScrollNavigator() {
  usePageScroll();
  return null; // renders nothing
}
