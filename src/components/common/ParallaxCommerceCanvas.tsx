import React, { useEffect, useRef } from 'react';

// Floating commerce tokens configuration (confined comfortably to upper hero area)
const tokens = [
  {
    id: 1,
    label: "%",
    sub: "ROI & Margins",
    depth: 22,
    className: "top-[14%] left-[6%]",
    rot: -6
  },
  {
    id: 2,
    label: "↗",
    sub: "Capital Growth",
    depth: -26,
    className: "top-[18%] right-[8%]",
    rot: 8
  },
  {
    id: 3,
    label: "Rs.",
    sub: "Valuation",
    depth: 16,
    className: "top-[48%] left-[4%]",
    rot: -4
  },
  {
    id: 4,
    label: "A*",
    sub: "Island Rank",
    depth: -18,
    className: "top-[46%] right-[5%]",
    rot: 5
  }
];

export const ParallaxCommerceCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const tokenRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isRunning = false;
    let rafId: number;

    const updateDamping = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.08;
      currentY += dy * 0.08;

      // Update tokens directly without triggering React re-renders
      tokenRefs.current.forEach((el, idx) => {
        if (!el) return;
        const t = tokens[idx];
        const tx = currentX * t.depth;
        const ty = currentY * t.depth;
        const rot = t.rot + currentX * 3;
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
      });

      // Stop loop when settled
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        rafId = requestAnimationFrame(updateDamping);
      } else {
        isRunning = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (e.clientY < rect.top - 50 || e.clientY > rect.bottom + 50) return;

      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      targetX = (relX / rect.width) * 2 - 1;
      targetY = (relY / rect.height) * 2 - 1;

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${relX}px ${relY}px, rgba(67, 56, 202, 0.07), transparent 70%)`;
      }

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(updateDamping);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
    >
      {/* Radial Spotlight Glow following mouse */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-500 opacity-60 dark:opacity-40"
        style={{
          background: `radial-gradient(600px circle at 50% 30%, rgba(67, 56, 202, 0.07), transparent 70%)`
        }}
      />

      {/* Floating Geometric Tokens */}
      {tokens.map((token, idx) => (
        <div
          key={token.id}
          ref={(el) => { tokenRefs.current[idx] = el; }}
          className={`absolute hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2E8F0]/80 dark:border-white/10 bg-[#FFFFFF]/60 dark:bg-[#18181b]/60 backdrop-blur-md shadow-sm ${token.className}`}
          style={{
            transform: `translate3d(0, 0, 0) rotate(${token.rot}deg)`,
            willChange: 'transform'
          }}
        >
          <span className="font-syne font-extrabold text-sm text-[#4338CA] dark:text-cyan-400">
            {token.label}
          </span>
          <span className="text-[10px] font-mono tracking-tight text-[#737373] dark:text-slate-400 uppercase">
            {token.sub}
          </span>
        </div>
      ))}
    </div>
  );
};
