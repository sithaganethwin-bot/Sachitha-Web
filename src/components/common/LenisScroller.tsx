import React, { useEffect } from 'react';
import Lenis from 'lenis';

interface LenisScrollerProps {
  children?: React.ReactNode;
}

export const LenisScroller: React.FC<LenisScrollerProps> = ({ children }) => {
  useEffect(() => {
    // Disable on very low power or reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      prevent: (node) => {
        if (!node || !(node instanceof HTMLElement)) return false;
        return Boolean(
          node.hasAttribute('data-lenis-prevent') ||
          node.closest('[data-lenis-prevent]') ||
          node.closest('.fixed.inset-0') ||
          node.closest('[role="dialog"]')
        );
      },
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
