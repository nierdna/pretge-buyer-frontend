import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import scrollbar from 'tailwind-scrollbar';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        mb: '480px',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'sans-serif'],
      },
      container: {
        center: true,
        screens: {
          '2xl': '1400px',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      colors: {
        //new colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        card: 'hsl(var(--card))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          text: 'hsl(var(--primary-text))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          text: 'hsl(var(--secondary-text))',
        },
        success: 'hsl(var(--success))',
        icon: {
          primary: 'hsl(var(--icon-primary))',
          tertiary: 'hsl(var(--icon-tertiary))',
        },
        inverse: 'hsl(var(--inverse))',
        yellow: 'hsl(var(--yellow))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
        info: 'hsl(var(--info))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': 'calc(var(--radius) + 1.5rem)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate, forms, typography, aspectRatio, scrollbar],
} satisfies Config;

export default config;
