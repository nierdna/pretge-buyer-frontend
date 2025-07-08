// import aspectRatio from '@tailwindcss/aspect-ratio';
// import forms from '@tailwindcss/forms';
// import typography from '@tailwindcss/typography';
// import type { Config } from 'tailwindcss';

// const config: Config = {
//   darkMode: 'class',
//   content: [
//     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/screens/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     container: {
//       center: true,
//       padding: '2rem',
//       screens: {
//         '2xl': '1400px',
//       },
//     },
//     extend: {
//       fontSize: {
//         '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
//       },
//       colors: {
//         btn: {
//           primary: {
//             default: 'rgb(var(--button-primary))',
//             hover: 'rgb(var(--button-primary-hover))',
//           },
//           secondary: {
//             default: 'rgb(var(--button-secondary))',
//             hover: 'rgb(var(--button-secondary-hover))',
//           },
//         },
//       },
//       backgroundColor: {
//         body: 'rgb(var(--background-body))',
//         card: 'rgb(var(--background-card))',
//         deep: {
//           green: 'rgb(var(--background-deep-green))',
//           pine: 'rgb(var(--background-deep-pine))',
//           card: 'rgb(var(--background-deep-card))',
//           navy: 'rgb(var(--background-deep-navy))',
//         },
//         inverse: 'rgb(var(--background-inverse))',
//         muted: 'var(--background-muted)',
//       },
//       textColor: {
//         primary: 'rgb(var(--text-primary))',
//         secondary: 'rgb(var(--text-secondary))',
//         gray: {
//           a: 'rgb(var(--text-gray-a))',
//           b: 'rgb(var(--text-gray-b))',
//           c: 'rgb(var(--text-gray-c))',
//           d: 'rgb(var(--text-gray-d))',
//         },
//         cyan: 'rgb(var(--text-cyan))',
//         avocado: 'rgb(var(--text-avocado))',
//         inverse: 'rgb(var(--text-inverse))',
//       },
//       borderColor: {
//         hairline: 'rgb(var(--border-hairline-green))',
//         deep: {
//           card: 'rgb(var(--border-deep-card))',
//         },
//         avocado: 'rgb(var(--border-avocado))',
//         muted: 'var(--border-muted)',
//       },

//       borderRadius: {
//         lg: 'var(--radius-lg)',
//         md: 'var(--radius-md)',
//         sm: 'var(--radius-sm)',
//         xl: 'var(--radius-xl)',
//       },
//       keyframes: {
//         'accordion-down': {
//           from: { height: '0' },
//           to: { height: 'var(--radix-accordion-content-height)' },
//         },
//         'accordion-up': {
//           from: { height: 'var(--radix-accordion-content-height)' },
//           to: { height: '0' },
//         },
//       },
//       animation: {
//         'accordion-down': 'accordion-down 0.2s ease-out',
//         'accordion-up': 'accordion-up 0.2s ease-out',
//       },
//     },
//   },
//   plugins: [forms, typography, aspectRatio],
// };

// export default config;

import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
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
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(0 0% 20%)', // A dark gray for primary actions/buttons
          foreground: 'hsl(0 0% 100%)', // White text on dark gray
        },
        secondary: {
          DEFAULT: 'hsl(0 0% 96.1%)', // Light gray for secondary elements
          foreground: 'hsl(0 0% 9%)', // Dark text on light gray
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'hsl(0 0% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(0 0% 96.1%)',
          foreground: 'hsl(0 0% 45.1%)',
        },
        accent: {
          DEFAULT: 'hsl(0 0% 96.1%)',
          foreground: 'hsl(0 0% 9%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(0 0% 9%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(0 0% 9%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
  plugins: [animate, forms, typography, aspectRatio],
} satisfies Config;

export default config;
