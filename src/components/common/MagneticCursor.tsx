import React, { useEffect, useState, useRef } from 'react';

export const MagneticCursor: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);

  useEffect(() => {
    // Only enable on fine pointer (desktop mouse)
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let rafId: number;
    let isLooping = false;

    // High performance RAF loop
    const render = () => {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      ringPos.current.x += dx * 0.22;
      ringPos.current.y += dy * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // If still catching up, keep looping. If settled, pause to save battery & GPU.
      if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
        rafId = requestAnimationFrame(render);
      } else {
        isLooping = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setVisible(true);

      if (!isLooping) {
        isLooping = true;
        rafId = requestAnimationFrame(render);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [role="button"], .cursor-magnetic-trigger');
      if (interactive) {
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          setIsHovered(true);
        }
        const customText = interactive.getAttribute('data-cursor-text') || '';
        setHoverText((prev) => (prev !== customText ? customText : prev));
      } else {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
          setHoverText('');
        }
      }
    };

    const onMouseLeave = () => {
      setVisible(false);
      isLooping = false;
      cancelAnimationFrame(rafId);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#161618] dark:bg-[#FFFFFF] pointer-events-none"
        style={{ willChange: 'transform' }}
      />

      {/* Kinetic Trailing Ring (Notice: NO 'transform' in transition class!) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none transition-[width,height,background-color,border-color,opacity] duration-150 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-12 h-12 border-[#4338CA] bg-[#4338CA]/15 shadow-md'
            : 'w-8 h-8 border-[#161618]/30 dark:border-[#FFFFFF]/30'
        }`}
        style={{ willChange: 'transform' }}
      >
        {hoverText && (
          <span className="text-[9px] font-bold text-[#4338CA] dark:text-cyan-300 font-mono tracking-tighter uppercase px-1">
            {hoverText}
          </span>
        )}
      </div>
    </div>
  );
};
