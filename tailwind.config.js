/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        navy: {
          800: '#0f172a',
          900: '#0b0f19',
          950: '#07090e',
        },
        accent: {
          cyan: '#06b6d4',
          sky: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
        },
        editorial: {
          ivory: '#FFFFFF',
          'ivory-card': '#FFFFFF',
          obsidian: '#101012',
          'obsidian-card': '#18181b',
          ink: '#161618',
          'ink-muted': '#64748b',
          sand: '#E2E8F0',
          'sand-border': '#CBD5E1',
          royal: '#4338CA',
          emerald: '#065F46',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        'serif-editorial': ['Instrument Serif', 'Georgia', 'serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        'mono-code': ['JetBrains Mono', 'monospace'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(59, 130, 246, 0.35)',
        'glow': '0 0 25px -5px rgba(59, 130, 246, 0.45)',
        'glow-lg': '0 0 40px -8px rgba(59, 130, 246, 0.55)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
