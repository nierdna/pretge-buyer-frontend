# Configuration Guide

Hướng dẫn cấu hình các thư viện và công cụ chính trong dự án Store Front Pre-Market.

## Table of Contents

- [Tailwind CSS Configuration](#tailwind-css-configuration)
- [Reown AppKit Configuration](#reown-appkit-configuration)
- [shadcn/ui Components](#shadcnui-components)
- [Color Palette](#color-palette)
- [Font Configuration](#font-configuration)
- [Development Tools](#development-tools)

## Tailwind CSS Configuration

### Cài đặt và Setup

```bash
# Cài đặt Tailwind CSS và các plugin
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D @tailwindcss/aspect-ratio @tailwindcss/forms @tailwindcss/typography
pnpm add -D tailwindcss-animate tailwind-scrollbar
pnpm add tailwind-merge clsx

# Khởi tạo Tailwind config
npx tailwindcss init -p
```

### Cấu hình chính

File cấu hình: `tailwind.config.ts`

```typescript
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
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        mb: '480px', // Mobile breakpoint
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      colors: {
        // Custom color palette
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#F8F9FA',
          hover: '#F1F3F5',
        },
        secondary: {
          DEFAULT: '#000000',
          foreground: '#1F2937',
          hover: '#111827',
        },
        success: {
          DEFAULT: '#A3E635',
          foreground: '#D9F99D',
        },
        danger: {
          DEFAULT: '#F97373',
        },
        warning: {
          DEFAULT: '#FBBF24',
        },
        info: {
          DEFAULT: '#60A5FA',
        },
        // Gradient colors
        'pink-gd': {
          DEFAULT: '#EBCEEA',
        },
        'blue-gd': {
          DEFAULT: '#CCDFF2',
        },
        'green-gd': {
          DEFAULT: '#DCFCE7',
        },
        'yellow-gd': {
          DEFAULT: '#FEF3C7',
        },
        // Utility colors
        line: '#E5E7EB',
        head: '#111827',
        content: '#6B7280',
        input: '#F0F0F0',
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
  plugins: [animate, forms, typography, aspectRatio, scrollbar],
} satisfies Config;

export default config;
```

### CSS Variables và Global Styles

File: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Background colors */
  --background-body: 0 0 0; /* #000000 */
  --background-card: 30 33 44; /* #1E212C */
  --background-deep-green: 6 26 28; /* #061A1C */
  --background-deep-pine: 4 30 24; /* #041E18 */
  --background-deep-card: 7 39 32; /* #072720 */
  --background-deep-navy: 0 10 30; /* #000A1E */
  --background-inverse: 255 255 255; /* #FFFFFF */
  --background-muted: rgba(255, 255, 255, 0.2);

  /* Text colors */
  --text-primary: 255 255 255; /* #FFFFFF */
  --text-secondary: 224 224 224; /* #E0E0E0 */
  --text-gray-a: 157 171 173; /* #9DA3AD */
  --text-gray-b: 153 179 173; /* #99B3AD */
  --text-gray-c: 151 151 162; /* #9797A2 */
  --text-gray-d: 189 189 202; /* #BDBDCA */
  --text-cyan: 48 222 238; /* #30DEEE */
  --text-avocado: 54 244 164; /* #36F4A4 */
  --text-inverse: 0 0 0; /* #000000 */

  /* Border colors */
  --border-hairline-green: 30 44 49; /* #1E2C31 */
  --border-deep-card: 19 59 50; /* #133B32 */
  --border-avocado: 54 244 164; /* #36F4A4 */
  --border-muted: rgba(255, 255, 255, 0.2);

  /* OpenSea color palette */
  --opensea-blue: 32 129 226; /* #2081E2 */
  --opensea-dark-blue: 24 104 183; /* #1868B7 */
  --opensea-marina: 21 178 229; /* #15B2E5 */
  --opensea-aqua: 43 205 228; /* #2BCDE4 */
  --opensea-fog: 229 232 235; /* #E5E8EB */
  --opensea-black: 4 17 29; /* #04111D */
  --opensea-dark-gray: 112 122 131; /* #707A83 */
  --opensea-light-gray: 138 147 155; /* #8A939B */
  --opensea-dark-border: 21 28 34; /* #151C22 */
  --opensea-success: 52 211 153; /* #34D399 */
  --opensea-warning: 245 158 11; /* #F59E0B */
  --opensea-error: 239 68 68; /* #EF4444 */

  /* Button colors */
  --button-primary: 255 255 255;
  --button-primary-hover: 212 212 216;
  --button-secondary: transparent;
  --button-secondary-hover: 255 255 255;

  /* Border radius */
  --radius: 0.5rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --tw-shadow:
    0px 8px 8px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px;
  --tw-shadow-container:
    0px 1px 0px 0px rgba(64, 71, 77, 0.4) inset, 0px 1px 0px 0px hsla(0, 0%, 100%, 0.08);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgb(var(--opensea-dark-border));
}

::-webkit-scrollbar-thumb {
  background: rgb(var(--opensea-light-gray));
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--opensea-dark-gray));
}

/* Line clamp utilities */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```

### Utility Functions

File: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Reown AppKit Configuration

### Cài đặt

```bash
pnpm add @reown/appkit @reown/appkit-adapter-ethers @reown/appkit-adapter-solana @reown/appkit-adapter-wagmi
pnpm add lynx-reown-dapp-kit
```

### Cấu hình Provider

File: `src/providers/appkit-provider.tsx`

```typescript
'use client';

import { chainConfigs } from '@/configs/chains';
import { projectId } from '@/configs/env';
import { isPrd } from '@/constants/global';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  solana,
  solanaDevnet,
} from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { LynxReownProvider } from 'lynx-reown-dapp-kit';

// Metadata cho dApp
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/'],
};

const listMainnet = [mainnet, base, solana, arbitrum];
const listTestnet = [baseSepolia, solanaDevnet, arbitrumSepolia];

// Tạo AppKit instance
createAppKit({
  adapters: [new SolanaAdapter(), new EthersAdapter()],
  metadata,
  networks: isPrd ? (listMainnet as any) : (listTestnet as any),
  projectId,
  features: {
    analytics: true,
    email: false,
    socials: [],
  },
  allWallets: 'SHOW',
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <LynxReownProvider
      chains={chainConfigs.map((item) => ({
        chainId: item.chainId,
        chainName: item.name,
        chainType: item.chainType as any,
        rpc: item.privateRpcUrl,
        explorerUrl: item.explorerUrl,
      }))}
    >
      {children}
    </LynxReownProvider>
  );
}
```

### Chain Configuration

File: `src/configs/chains.ts`

```typescript
import { ChainType } from '@/server/enums/chain';
import { IChainConfig } from '@/types/chain';
import { arbitrum, arbitrumSepolia, solana, solanaDevnet } from '@reown/appkit/networks';

export const chainConfigs: IChainConfig[] = [
  {
    id: '1',
    name: 'Ethereum',
    publicRpcUrl: 'https://eth.llamarpc.com',
    privateRpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    chainId: '1',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
  },
  {
    id: '8453',
    name: 'Base',
    publicRpcUrl: 'https://base.llamarpc.com',
    privateRpcUrl: 'https://base.llamarpc.com',
    explorerUrl: 'https://basescan.org',
    chainId: '8453',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
  },
  {
    id: '84532',
    name: 'Base Sepolia',
    publicRpcUrl: 'https://sepolia.base.org',
    privateRpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://basescan.org',
    chainId: '84532',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
    contractAddress: '0x9D90aeb5c841925fc8D7c5481c02523bDAc95585',
    escrowVaultAddress: '0x6B4792a57caBEbE6363ce3C0354D1494e63d0320',
  },
  {
    id: arbitrum.id.toString(),
    name: 'Arbitrum',
    publicRpcUrl: arbitrum.rpcUrls.default.http[0],
    privateRpcUrl: arbitrum.rpcUrls.default.http[0],
    explorerUrl: arbitrum.blockExplorers.default.url,
    chainId: arbitrum.id.toString(),
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
  },
  {
    id: arbitrumSepolia.id.toString(),
    name: 'Arbitrum Sepolia',
    publicRpcUrl: arbitrumSepolia.rpcUrls.default.http[0],
    privateRpcUrl: arbitrumSepolia.rpcUrls.default.http[0],
    explorerUrl: 'https://sepolia.arbiscan.io',
    chainId: arbitrumSepolia.id.toString(),
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    chainType: ChainType.EVM,
  },
  {
    id: solanaDevnet.id.toString(),
    name: 'Solana Devnet',
    publicRpcUrl: 'https://api.devnet.solana.com',
    privateRpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://solscan.io',
    chainId: solanaDevnet.id.toString(),
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    chainType: ChainType.SOLANA,
  },
  {
    id: solana.id.toString(),
    name: 'Solana',
    publicRpcUrl: 'https://api.mainnet.solana.com',
    privateRpcUrl:
      'https://powerful-prettiest-aura.solana-mainnet.quiknode.pro/c2cb8c625bd63a33189e46ae79aec60b64e845ee',
    explorerUrl: 'https://solscan.io',
    chainId: solana.id.toString(),
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    chainType: ChainType.SOLANA,
  },
];
```

## shadcn/ui Components

### Cài đặt

```bash
# Cài đặt shadcn/ui CLI
pnpm add -D shadcn

# Khởi tạo shadcn/ui
npx shadcn@latest init
```

### Cấu hình

File: `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Cài đặt Components

```bash
# Cài đặt các component cần thiết
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add breadcrumb
npx shadcn@latest add carousel
npx shadcn@latest add checkbox
npx shadcn@latest add collapsible
npx shadcn@latest add command
npx shadcn@latest add drawer
npx shadcn@latest add dropdown-menu
npx shadcn@latest add pagination
npx shadcn@latest add popover
npx shadcn@latest add progress
npx shadcn@latest add resizable
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add skeleton
npx shadcn@latest add slider
npx shadcn@latest add sonner
npx shadcn@latest add switch
npx shadcn@latest add table
npx shadcn@latest add textarea
npx shadcn@latest add toggle-group
npx shadcn@latest add toggle
npx shadcn@latest add tooltip
npx shadcn@latest add upload-button
```

### Sử dụng Components

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## Color Palette

Tất cả màu sắc được định nghĩa trong `tailwind.config.ts` và có thể sử dụng trực tiếp thông qua Tailwind classes.

### Primary Colors

```typescript
// Primary colors
primary: {
  DEFAULT: '#ffffff',
  foreground: '#F8F9FA',
  hover: '#F1F3F5',
},
secondary: {
  DEFAULT: '#000000',
  foreground: '#1F2937',
  hover: '#111827',
},
```

### Status Colors

```typescript
// Status colors
success: {
  DEFAULT: '#A3E635',
  foreground: '#D9F99D',
},
danger: {
  DEFAULT: '#F97373',
},
warning: {
  DEFAULT: '#FBBF24',
},
info: {
  DEFAULT: '#60A5FA',
},
```

### Gradient Colors

```typescript
// Gradient colors
'pink-gd': {
  DEFAULT: '#EBCEEA',
},
'blue-gd': {
  DEFAULT: '#CCDFF2',
},
'green-gd': {
  DEFAULT: '#DCFCE7',
},
'yellow-gd': {
  DEFAULT: '#FEF3C7',
},
```

### Utility Colors

```typescript
// Utility colors
line: '#E5E7EB',
head: '#111827',
content: '#6B7280',
input: '#F0F0F0',
```

### Usage Examples

```typescript
// Primary colors
className = 'bg-primary text-secondary hover:bg-primary-hover';

// Status colors
className = 'bg-success text-success-foreground';
className = 'bg-danger text-primary';
className = 'bg-warning text-black';
className = 'bg-info text-primary';

// Gradient colors
className = 'bg-pink-gd';
className = 'bg-blue-gd';
className = 'bg-green-gd';
className = 'bg-yellow-gd';

// Utility colors
className = 'border-border';
className = 'text-head';
className = 'text-content';
className = 'bg-input';
```

## Font Configuration

### Font Family

```css
/* Helvetica Neue Font */
font-family: 'Helvetica Neue', sans-serif;
```

### Font Sizes

```css
/* Custom Font Sizes */
text-2xs: 0.625rem (10px) - line-height: 0.75rem (12px)
```

### Font Files

Các file font được lưu trong `src/assets/fonts/`:

- `HelveticaNeueBlack.otf`
- `HelveticaNeueBold.otf`
- `HelveticaNeueHeavy.otf`
- `HelveticaNeueLight.otf`
- `HelveticaNeueMedium.otf`
- `HelveticaNeueRoman.otf`

## Development Tools

### Prettier Configuration

```json
{
  "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"]
}
```

### ESLint Configuration

File: `eslint.config.mjs`

```javascript
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      '@next/next': nextPlugin,
    },
  },
];
```

### PostCSS Configuration

File: `postcss.config.mjs`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### TypeScript Configuration

File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Best Practices

### 1. Sử dụng Utility Function `cn()`

```typescript
import { cn } from "@/lib/utils";

// Thay vì
className="bg-red-500 text-primary p-4"

// Sử dụng
className={cn("bg-red-500", "text-primary", "p-4")}
```

### 2. Responsive Design

```typescript
// Mobile-first approach
className = 'w-full md:w-1/2 lg:w-1/3';
```

### 3. Dark Mode Support

```typescript
// Sử dụng CSS variables cho dark mode
className = 'bg-primary-foreground text-secondary';
```

### 4. Component Composition

```typescript
// Sử dụng composition pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### 5. Type Safety

```typescript
// Luôn định nghĩa types cho props
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}
```

## Troubleshooting

### Common Issues

1. **Tailwind classes not working**: Kiểm tra `content` paths trong `tailwind.config.ts`
2. **shadcn/ui components not found**: Chạy lại `npx shadcn@latest add [component-name]`
3. **Font not loading**: Kiểm tra font files trong `src/assets/fonts/`
4. **AppKit connection issues**: Kiểm tra `projectId` và network configuration

### Performance Tips

1. Sử dụng `tailwind-merge` để tránh duplicate classes
2. Lazy load components khi cần thiết
3. Optimize images và assets
4. Sử dụng React.memo cho components không thay đổi thường xuyên
