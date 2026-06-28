import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          canvas: '#fdf4ea',
          ink: '#1a0d07',
          ember: '#CF142B',
          sol: '#E8A030',
          cielo: '#1E3E8F',
          tierra: '#C4673A',
          'warm-surface': '#f9ece0',
          'warm-muted': '#8c6a54',
        },
        // Legacy aliases kept for backward compat during transition
        crisis: {
          red: '#CF142B',
          yellow: '#FFD700',
          blue: '#00247D',
        },
        emergency: '#DC2626',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ken-burns': 'kenBurns 18s ease-out forwards',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        kenBurns: {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(1.08)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
