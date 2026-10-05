import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const BackgroundTexture: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{ transform: 'translateZ(0)', contain: 'strict' }}
      aria-hidden="true"
    >
      {/* 1. AMBIENT GLOW MESH ORBS (Optimized 64px Gaussian blur for instant GPU rendering) */}
      <div
        className="absolute -top-[10%] left-[5%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[64px] opacity-40 dark:opacity-35 transition-opacity duration-700 pointer-events-none"
        style={{
          transform: 'translateZ(0)',
          background: isDark
            ? 'radial-gradient(circle, rgba(67, 56, 202, 0.45) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(199, 210, 254, 0.45) 45%, transparent 75%)'
        }}
      />

      <div
        className="absolute top-[20%] -right-[8%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[64px] opacity-35 dark:opacity-30 transition-opacity duration-700 pointer-events-none"
        style={{
          transform: 'translateZ(0)',
          background: isDark
            ? 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(56, 189, 248, 0.1) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(186, 230, 253, 0.4) 45%, transparent 75%)'
        }}
      />

      <div
        className="absolute top-[55%] -left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-[64px] opacity-30 dark:opacity-25 transition-opacity duration-700 pointer-events-none"
        style={{
          transform: 'translateZ(0)',
          background: isDark
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(5, 150, 105, 0.08) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, rgba(167, 243, 208, 0.3) 45%, transparent 75%)'
        }}
      />

      <div
        className="absolute bottom-[5%] right-[10%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] rounded-full blur-[64px] opacity-25 dark:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{
          transform: 'translateZ(0)',
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, rgba(216, 180, 254, 0.25) 45%, transparent 75%)'
        }}
      />

      {/* 2. ARCHITECTURAL PRECISION MICRO-GRID + DOTS (FULL BLEED ACROSS ENTIRE VIEWPORT) */}
      <div
        className="absolute inset-0 opacity-80 dark:opacity-65 transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px), radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.45) 1.2px, transparent 0)`
            : `linear-gradient(to right, rgba(22, 22, 24, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(22, 22, 24, 0.045) 1px, transparent 1px), radial-gradient(circle at 1px 1px, rgba(67, 56, 202, 0.25) 1.2px, transparent 0)`,
          backgroundSize: '48px 48px, 48px 48px, 48px 48px',
        }}
      />

      {/* Crosshair (+) accents (FULL BLEED ACROSS ENTIRE VIEWPORT) */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='144' height='144' viewBox='0 0 144 144' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M72 66v12M66 72h12' stroke='${
            isDark ? '%23818cf8' : '%234338ca'
          }' stroke-width='1.2' stroke-linecap='square' fill='none' opacity='${
            isDark ? '0.45' : '0.35'
          }'/%3E%3C/svg%3E")`,
          backgroundSize: '144px 144px',
        }}
      />

      {/* 3. TACTILE FILM GRAIN / ORGANIC PAPER TEXTURE */}
      <div
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};
