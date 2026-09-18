import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blite: {
          black: '#07030e',
          obsidian: '#0b0516',
          charcoal: '#110820',
          surface: '#170c2c',
          card: '#1e0f38',
          border: 'rgba(236, 19, 128, 0.14)',
          'border-light': 'rgba(255, 255, 255, 0.12)',
          purple: '#8b2fc9',
          violet: '#9d4edd',
          neon: '#c77dff',
          pink: '#ec1380',
          magenta: '#ff2a8d',
          steel: '#9c8fa8',
          muted: '#b8adc4',
          silver: '#e3dcf0',
          platinum: '#f9f8fc',
          glow: 'rgba(157, 78, 221, 0.25)',
          'glow-pink': 'rgba(236, 19, 128, 0.25)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        widest: '0.2em',
        mega: '0.3em',
      },
    },
  },
  plugins: [],
};

export default config;
