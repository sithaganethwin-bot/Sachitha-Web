import React, { useRef, useEffect } from 'react';

export interface ScrollExpandProps {
  children: React.ReactNode;
  startWidth?: number; // percentage (default: 80)
  startRadius?: number; // px (default: 26)
  endRadius?: number; // px (default: 12)
  className?: string;
}

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  children,
  startWidth = 80,
  startRadius = 26,
  endRadius = 12,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth physics values (avoids React re-renders for buttery 120fps scroll)
  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);

  useEffect(() => {
    let rafId: number;
    let isLooping = false;
    let isVisible = false;

    const render = () => {
      const diff = targetProgress.current - currentProgress.current;
      currentProgress.current += diff * 0.12;
      const p = currentProgress.current;

      if (cardRef.current) {
        const widthPct = startWidth + (100 - startWidth) * p;
        const radius = startRadius - (startRadius - endRadius) * p;

        cardRef.current.style.width = `${widthPct.toFixed(2)}%`;
        cardRef.current.style.borderRadius = `${radius.toFixed(1)}px`;
      }

      // If progress is still transitioning, keep looping; otherwise pause RAF to free GPU
      if (Math.abs(diff) > 0.0008) {
        rafId = requestAnimationFrame(render);
      } else {
        currentProgress.current = targetProgress.current;
        isLooping = false;
      }
    };

    const startLoop = () => {
      if (!isLooping && isVisible) {
        isLooping = true;
        rafId = requestAnimationFrame(render);
      }
    };

    const updateScroll = () => {
      if (!containerRef.current || !isVisible) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      const startTrigger = windowHeight * 0.85;
      const endTrigger = windowHeight * 0.15;
      const totalDistance = startTrigger - endTrigger;

      const currentOffset = startTrigger - rect.top;
      const raw = Math.min(Math.max(currentOffset / totalDistance, 0), 1);
      const smoothed = raw * raw * (3 - 2 * raw);

      if (Math.abs(smoothed - targetProgress.current) > 0.0005) {
        targetProgress.current = smoothed;
        startLoop();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible) {
          updateScroll();
          startLoop();
        } else {
          isLooping = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      cancelAnimationFrame(rafId);
    };
  }, [startWidth, startRadius, endRadius]);

  return (
    <div ref={containerRef} className={`w-full flex justify-center py-4 ${className}`}>
      <div
        ref={cardRef}
        style={{
          width: `${startWidth}%`,
          borderRadius: `${startRadius}px`,
          willChange: 'width, border-radius'
        }}
        className="relative overflow-hidden shadow-xl"
      >
        {children}
      </div>
    </div>
  );
};
