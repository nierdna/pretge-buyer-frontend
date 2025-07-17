# Pre-Market Storefront

A modern e-commerce storefront built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Next.js App Router with TypeScript
- Tailwind CSS for styling
- ESLint and Prettier for code quality
- Husky and lint-staged for pre-commit hooks
- API services with Axios
- Type-safe environment variables
- pnpm for fast, disk space efficient package management
- **Image upload with Zipline integration**

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pre-market-xyz.git
cd pre-market-xyz/storefront
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

# Zipline Configuration (for image uploads)
ZIPLINE_API_URL=https://zipline.example.com
ZIPLINE_API_KEY=your_zipline_api_key_here

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Image Upload with Zipline

The application includes integrated image upload functionality using Zipline:

### Setup Zipline

1. **Install Zipline** (if not already installed):

   ```bash
   # Follow Zipline installation guide at https://zipline.diced.sh/
   ```

2. **Configure Zipline**:
   - Set up your Zipline instance
   - Generate an API key
   - Update the environment variables with your Zipline URL and API key

3. **Usage**:
   - The upload functionality is available in the Profile edit modal
   - Click the upload button on the avatar to select and upload an image
   - Supported formats: JPEG, PNG, GIF, WebP
   - Maximum file size: 5MB

### Upload Components

- `UploadButton`: Reusable component for image uploads
- `UploadService`: Service class for handling upload logic
- API Route: `/api/upload` handles file uploads to Zipline

## Project Structure

```
storefront/
├─ src/
│   ├─ app/             # App Router pages and layouts
│   │   └─ api/         # API routes including upload
│   ├─ components/      # Reusable UI components
│   │   └─ ui/          # UI components including upload-button
│   ├─ hooks/           # Custom React hooks
│   ├─ styles/          # Global styles and Tailwind utilities
│   ├─ service/         # API services including upload.service.ts
│   │   ├─ axios.ts     # Axios instance and interceptors
│   │   ├─ product.service.ts
│   │   ├─ order.service.ts
│   │   ├─ seller.service.ts
│   │   └─ upload.service.ts
│   ├─ configs/         # Configuration files
│   │   ├─ env.ts       # Environment variables
│   │   ├─ api.ts       # API endpoints
│   │   └─ chains.ts    # Web3 chain configurations
│   ├─ utils/           # Utility functions
│   └─ types/           # TypeScript type definitions
│       ├─ product.ts
│       ├─ order.ts
│       └─ seller.ts
├─ public/              # Static assets
├─ .husky/              # Git hooks
├─ .vscode/             # VS Code settings
├─ .eslintrc.js         # ESLint config
├─ .prettierrc          # Prettier config
├─ .prettierignore      # Prettier ignore patterns
├─ .lintstagedrc.js     # lint-staged config
├─ postcss.config.ts    # PostCSS config
├─ tailwind.config.ts   # Tailwind config
├─ next.config.mjs      # Next.js config
└─ package.json         # Project dependencies
```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [pnpm Documentation](https://pnpm.io/motivation)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
