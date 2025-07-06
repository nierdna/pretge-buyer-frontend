import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/screens/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        opensea: {
          blue: 'rgb(var(--opensea-blue) / <alpha-value>)',
          darkBlue: 'rgb(var(--opensea-dark-blue) / <alpha-value>)',
          marina: 'rgb(var(--opensea-marina) / <alpha-value>)',
          aqua: 'rgb(var(--opensea-aqua) / <alpha-value>)',
          fog: 'rgb(var(--opensea-fog) / <alpha-value>)',
          black: 'rgb(var(--opensea-black) / <alpha-value>)',
          darkGray: 'rgb(var(--opensea-dark-gray) / <alpha-value>)',
          lightGray: 'rgb(var(--opensea-light-gray) / <alpha-value>)',
          darkBorder: 'rgb(var(--opensea-dark-border) / <alpha-value>)',
          success: 'rgb(var(--opensea-success) / <alpha-value>)',
          warning: 'rgb(var(--opensea-warning) / <alpha-value>)',
          error: 'rgb(var(--opensea-error) / <alpha-value>)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'rgb(var(--opensea-blue) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--opensea-dark-blue) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--opensea-error) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'rgb(var(--opensea-fog) / <alpha-value>)',
          foreground: 'rgb(var(--opensea-dark-gray) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--opensea-marina) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
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
  plugins: [forms, typography, aspectRatio],
};

export default config;
