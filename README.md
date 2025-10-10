# Pre-Market Storefront

A modern pre-market token trading platform and e-commerce storefront built with Next.js, TypeScript, Tailwind CSS, and multi-chain blockchain integration (Solana, EVM). This project enables users to discover, buy, and sell tokens before public listing, with secure escrow and wallet support.

## Features

- Next.js App Router (app directory) with TypeScript
- Tailwind CSS for modern UI
- Multi-chain blockchain support: Solana, Ethereum, Base, Arbitrum (via escrow-market-sdk)
- Wallet connection (EVM & Solana) using lynx-reown-dapp-kit & @reown/appkit
- Secure escrow for token trading
- Flash Sale and Trending Token sections
- Seller profiles, order history, and user profile management
- Image upload with Zipline integration
- Scroll to Top component for better user experience
- Supabase for backend data
- API services with Axios
- State management with Zustand
- React Query for data fetching
- ESLint, Prettier, Husky, lint-staged for code quality
- pnpm for fast, disk space efficient package management

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pre-market-xyz.git
cd store-front-pre-market
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

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT (if required)
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Zipline Configuration (for image uploads)
ZIPLINE_API_URL=https://zipline.example.com
ZIPLINE_API_KEY=your_zipline_api_key_here

# Project ID (optional)
NEXT_PUBLIC_PROJECT_ID=your_project_id
```

4. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure & Architecture

### 📁 Main Directory Structure

```
store-front-pre-market/
├─ src/
│   ├─ app/                    # Next.js App Router
│   │   ├─ (main)/            # Main layout group with authentication
│   │   │   ├─ layout.tsx     # Main layout with auth logic
│   │   │   ├─ page.tsx       # Homepage
│   │   │   ├─ offers/        # Offers pages
│   │   │   ├─ profile/       # User profile pages
│   │   │   ├─ sellers/       # Seller detail pages
│   │   │   ├─ my-orders/     # Order history pages
│   │   │   └─ token/         # Token detail pages
│   │   ├─ api/               # API routes
│   │   │   ├─ v1/           # Versioned API endpoints
│   │   │   ├─ auth/         # Authentication endpoints
│   │   │   ├─ upload/       # File upload endpoints
│   │   │   └─ ...
│   │   ├─ layout.tsx        # Root layout with providers
│   │   └─ globals.css       # Global styles
│   ├─ components/           # Reusable UI components
│   │   ├─ ui/              # UI primitives (shadcn/ui)
│   │   ├─ layouts/         # Layout components
│   │   └─ ...
│   ├─ providers/           # React context providers
│   ├─ service/             # API service layer
│   ├─ server/              # Server-side logic & database
│   ├─ store/               # Zustand state management
│   ├─ hooks/               # Custom React hooks
│   ├─ screens/             # Page-level components
│   ├─ queries/             # React Query hooks
│   ├─ configs/             # App configurations
│   ├─ contracts/           # Blockchain contracts
│   ├─ types/               # TypeScript type definitions
│   └─ utils/               # Utility functions
├─ public/                  # Static assets
├─ docs/                    # Documentation
└─ ...
```

### 🏗️ Layout Architecture

#### Root Layout (`src/app/layout.tsx`)

- Wraps the entire application with providers
- Configures metadata, fonts, global styles
- Contains no business logic

#### Main Layout (`src/app/(main)/layout.tsx`)

- Layout for pages requiring authentication
- Handles wallet connection and authentication flow
- Auto-login/logout based on wallet state
- Fetches user profile and chain data

```typescript
// Main Layout Logic
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { fetchProfile } = useAuthStore();
  const { address, isConnected, accessToken, handleLogin, handleLogout } = useAuth();
  const { fetchChains } = useChainStore();

  // Auto-login when wallet connected
  useEffect(() => {
    if (address && isConnected && !accessToken) {
      handleLogin();
    }
  }, [address, isConnected, accessToken]);

  // Auto-logout when wallet disconnected
  useEffect(() => {
    if ((!address || !isConnected) && accessToken) {
      handleLogout();
    }
  }, [address, isConnected, accessToken]);

  return children;
};
```

### 🔧 Service Layer Architecture

#### Service Pattern

Services are organized by domain and use singleton pattern:

```typescript
// src/service/index.ts
export const Service = Object.freeze({
  order: new OrderService(),
  chain: new ChainsService(),
  offer: new OfferService(),
  user: new UserService(),
  auth: new AuthService(),
});
```

#### How to Create a New Service

1. **Create service class:**

```typescript
// src/service/example.service.ts
import axiosInstance from './axios';
import type { ExampleType } from '@/types/example';

interface ExampleResponse {
  data: ExampleType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  success: boolean;
}

export class ExampleService {
  async getExamples(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ExampleResponse> {
    const response = await axiosInstance.get('/examples', { params });
    return response.data;
  }

  async getExampleById(id: string): Promise<{ data: ExampleType; success: boolean }> {
    const response = await axiosInstance.get(`/examples/${id}`);
    return response.data;
  }

  async createExample(
    data: Partial<ExampleType>
  ): Promise<{ data: ExampleType; success: boolean }> {
    const response = await axiosInstance.post('/examples', data);
    return response.data;
  }

  async updateExample(
    id: string,
    data: Partial<ExampleType>
  ): Promise<{ data: ExampleType; success: boolean }> {
    const response = await axiosInstance.patch(`/examples/${id}`, data);
    return response.data;
  }

  async deleteExample(id: string): Promise<{ success: boolean }> {
    const response = await axiosInstance.delete(`/examples/${id}`);
    return response.data;
  }
}
```

2. **Export in service index:**

```typescript
// src/service/index.ts
import { ExampleService } from './example.service';

export const Service = Object.freeze({
  // ... existing services
  example: new ExampleService(),
});
```

3. **Use in components:**

```typescript
// In component or hook
import { Service } from '@/service';

const MyComponent = () => {
  const [examples, setExamples] = useState([]);

  useEffect(() => {
    const fetchExamples = async () => {
      const result = await Service.example.getExamples();
      if (result.success) {
        setExamples(result.data);
      }
    };
    fetchExamples();
  }, []);

  return <div>{/* render examples */}</div>;
};
```

### 🎯 Provider Architecture

#### Provider Pattern

Providers are organized by dependency order:

```typescript
// src/providers/index.tsx
const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppKitProvider>        {/* Wallet connection provider */}
      <QueryProvider>       {/* React Query provider */}
        {children}
        <Toaster />         {/* Toast notifications */}
      </QueryProvider>
    </AppKitProvider>
  );
};
```

#### How to Create a New Provider

1. **Create provider component:**

```typescript
// src/providers/example-provider.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ExampleContextType {
  exampleData: any;
  setExampleData: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ExampleContext = createContext<ExampleContextType | undefined>(undefined);

export const ExampleProvider = ({ children }: { children: ReactNode }) => {
  const [exampleData, setExampleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ExampleContext.Provider value={{
      exampleData,
      setExampleData,
      isLoading,
      setIsLoading,
    }}>
      {children}
    </ExampleContext.Provider>
  );
};

export const useExample = () => {
  const context = useContext(ExampleContext);
  if (context === undefined) {
    throw new Error('useExample must be used within an ExampleProvider');
  }
  return context;
};
```

2. **Add to provider chain:**

```typescript
// src/providers/index.tsx
import { ExampleProvider } from './example-provider';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppKitProvider>
      <QueryProvider>
        <ExampleProvider>
          {children}
          <Toaster />
        </ExampleProvider>
      </QueryProvider>
    </AppKitProvider>
  );
};
```

### 🗄️ Server Architecture

#### Server-side Structure

```
src/server/
├── db/
│   ├── schema.sql          # Database schema
│   ├── supabase.ts         # Supabase client
│   └── migrations/         # Database migrations
├── service/                # Server-side services
├── types/                  # Server-side types
├── utils/                  # Server utilities
├── middleware/             # API middleware
└── enums/                  # Enums
```

#### How to Create Server Service

1. **Create service class:**

```typescript
// src/server/service/example.service.ts
import { supabase } from '../db/supabase';
import type { Example } from '../types/example';

export class ExampleService {
  async getExamples(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params;
    const offset = (page - 1) * limit;

    let query = supabase.from('examples').select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async getExampleById(id: string) {
    const { data, error } = await supabase.from('examples').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  }

  async createExample(example: Partial<Example>) {
    const { data, error } = await supabase.from('examples').insert(example).select().single();

    if (error) throw error;
    return data;
  }

  async updateExample(id: string, updates: Partial<Example>) {
    const { data, error } = await supabase
      .from('examples')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteExample(id: string) {
    const { error } = await supabase.from('examples').delete().eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}
```

2. **Create API route:**

```typescript
// src/app/api/v1/examples/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ExampleService } from '@/server/service/example.service';
import { validateRequest } from '@/server/utils/validation';

const exampleService = new ExampleService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    const result = await exampleService.getExamples({ page, limit, search });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = validateRequest(body, exampleSchema);

    const result = await exampleService.createExample(validatedData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
```

### 🎨 Component Architecture

#### Component Organization

```
src/components/
├── ui/                    # UI primitives (shadcn/ui)
├── layouts/               # Layout components
├── filter/               # Filter components
├── pagination-custom/    # Custom pagination
├── ScrollToTop.tsx       # Scroll to top button component
└── ...                   # Feature-specific components
```

#### ScrollToTop Component

A reusable scroll-to-top button component that provides smooth navigation back to the top of the page:

**Features:**

- **Smart Visibility**: Only appears when user scrolls down more than 300px
- **Smooth Animation**: Uses CSS transitions and smooth scroll behavior
- **Responsive Design**: Fixed position with proper z-index for all screen sizes
- **Accessibility**: Includes proper ARIA labels for screen readers
- **Hover Effects**: Interactive hover states with scale and color changes

**Usage:**

```typescript
// In any page component
import ScrollToTop from '@/components/ScrollToTop';

export default function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <ScrollToTop />
    </div>
  );
}
```

**Implementation Details:**

- Uses `useEffect` to listen for scroll events
- Debounced scroll detection to optimize performance
- Smooth scroll behavior with `window.scrollTo({ top: 0, behavior: 'smooth' })`
- Cleanup of event listeners on component unmount

#### How to Create New Components

1. **Screen Component (using queries):**

```typescript
// src/screens/Example/index.tsx
'use client';

import { useGetExamples } from '@/queries/useExampleQueries';
import { useCallback } from 'react';
import FilterSidebar from '@/components/filter/FilterSidebar';
import ExampleList from '@/components/ExampleList';

export default function ExamplePage() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    filters,
    setFilters,
    handleSearch,
    inputSearch,
    fetchNextPage,
    hasNextPage,
  } = useGetExamples();

  const examples = data?.pages.flatMap((page) => page.data) || [];

  // Callback để load more
  const handleLoadMore = useCallback(() => {
    if (isLoading || isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  }, [isLoading, isFetching, hasNextPage, fetchNextPage]);

  return (
    <div className="flex-1">
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <ExampleList
          inputSearch={inputSearch}
          handleSearch={handleSearch}
          examples={examples}
          isLoading={isLoading}
          isFetching={isFetching}
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  );
}
```

2. **List Component (receives props from parent):**

```typescript
// src/components/ExampleList.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import SearchInput from '@/components/SearchInput';

interface ExampleListProps {
  examples: any[];
  isLoading: boolean;
  isFetching: boolean;
  inputSearch: string;
  handleSearch: (search: string) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
}

export const ExampleList = ({
  examples,
  isLoading,
  isFetching,
  inputSearch,
  handleSearch,
  onLoadMore,
  hasNextPage,
}: ExampleListProps) => {
  const lastItemRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isLoading && !isFetching) {
        onLoadMore();
      }
    },
    [hasNextPage, isLoading, isFetching, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    // Observe the last item for infinite scroll
    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [observerCallback]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SearchInput value={inputSearch} onChange={handleSearch} />
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ExampleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchInput value={inputSearch} onChange={handleSearch} />

      <div className="grid gap-4">
        {examples.map((example) => (
          <ExampleCard key={example.id} example={example} />
        ))}

        {/* Separate trigger element for infinite scroll */}
        {hasNextPage && (
          <div ref={lastItemRef} className="flex h-10 items-center justify-center">
            {isFetching && <Loader2 className="h-6 w-6 animate-spin" />}
          </div>
        )}
      </div>
    </div>
  );
};
```

3. **Card Component (pure component):**

```typescript
// src/components/ExampleCard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExampleCardProps {
  example: any;
  onClick?: (example: any) => void;
}

export const ExampleCard = ({ example, onClick }: ExampleCardProps) => {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => onClick?.(example)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{example.name}</CardTitle>
          {example.isHot && (
            <Badge variant="destructive">HOT</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{example.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">${example.price}</span>
          <span className="text-sm text-muted-foreground">
            {example.inventory} available
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
```

4. **Export in index:**

```typescript
// src/components/index.ts
export { ExampleList } from './ExampleList';
export { ExampleCard } from './ExampleCard';
```

### 🎣 Custom Hooks

#### Hook Organization

```
src/hooks/
├── useAuth.ts             # Authentication hook
├── useWallet.ts           # Wallet connection hook
├── useEscrow.ts           # Escrow operations hook
├── useFilterCache.ts      # Filter caching hook
├── useSearchSuggestions.ts # Search suggestions hook
├── useToken.ts            # Token operations hook
├── useCopy.ts             # Copy to clipboard hook
└── useMobile.tsx          # Mobile detection hook
```

#### How to Create Custom Hooks

```typescript
// src/hooks/useExample.ts
import { useState, useCallback } from 'react';
import { useFilterCache } from '@/hooks/useFilterCache';
import { CACHE_KEYS } from '@/utils/filterCache';
import { useDebouncedCallback } from 'use-debounce';

interface UseExampleOptions {
  key?: string;
  defaultFilter?: any;
}

export const useExample = (options: UseExampleOptions = {}) => {
  const { key = CACHE_KEYS.EXAMPLE_FILTER, defaultFilter = {} } = options;

  // Use filter cache hook
  const { filters, setFilters, resetToDefault, clearCache } = useFilterCache({
    key,
    defaultFilter: {
      limit: 10,
      page: 1,
      sortField: 'created_at',
      sortOrder: 'desc',
      ...defaultFilter,
    },
  });

  const [inputSearch, setInputSearch] = useState('');

  // Debounced search
  const debouncedSearch = useDebouncedCallback((search: string) => {
    setFilters({ ...filters, search });
  }, 500);

  const handleSearch = useCallback(
    (search: string) => {
      setInputSearch(search);
      debouncedSearch(search);
    },
    [debouncedSearch]
  );

  const updateFilters = useCallback(
    (newFilters: any) => {
      setFilters({ ...filters, ...newFilters });
    },
    [filters, setFilters]
  );

  return {
    filters,
    inputSearch,
    handleSearch,
    setFilters: updateFilters,
    resetToDefault,
    clearCache,
  };
};
```

#### Hooks for Utility Functions

```typescript
// src/hooks/useCopy.ts
import { useState, useCallback } from 'react';

export const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, []);

  return { copied, copy };
};
```

#### Hook for Mobile Detection

```typescript
// src/hooks/useMobile.tsx
'use client';

import { useEffect, useState } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
```

### 📊 State Management (Zustand)

#### Store Organization

```
src/store/
├── authStore.ts           # Authentication state
├── chainStore.ts          # Chain/network state
└── README.md              # Store documentation
```

#### How to Create New Store

```typescript
// src/store/exampleStore.ts
import { create } from 'zustand';
import { Service } from '@/service';

interface ExampleState {
  examples: any[];
  loading: boolean;
  error: string | null;
  filters: any;

  // Actions
  fetchExamples: (filters?: any) => Promise<void>;
  setFilters: (filters: any) => void;
  clearError: () => void;
  reset: () => void;
}

export const useExampleStore = create<ExampleState>((set, get) => ({
  examples: [],
  loading: false,
  error: null,
  filters: {},

  fetchExamples: async (filters?: any) => {
    try {
      set({ loading: true, error: null });

      const result = await Service.example.getExamples(filters || get().filters);

      if (result.success) {
        set({ examples: result.data, loading: false });
      } else {
        set({ error: 'Failed to fetch examples', loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setFilters: (filters: any) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ examples: [], loading: false, error: null, filters: {} });
  },
}));
```

### 🔄 React Query Integration

#### Query Organization

```
src/queries/
├── index.ts               # Query exports
├── useOfferQueries.ts     # Offer-related queries với infinite queries
├── useProfile.ts          # Profile queries (balance, orders)
├── useSellerQueries.ts    # Seller queries
└── useTokenQueries.ts     # Token queries
```

#### Pattern Used in the Project

The project uses **Infinite Queries** for pagination and **useQuery** for single data fetching:

#### 1. **Infinite Queries with Filter Cache**

```typescript
// src/queries/useExampleQueries.ts
'use client';

import { useFilterCache } from '@/hooks/useFilterCache';
import { Service } from '@/service';
import { CACHE_KEYS } from '@/utils/filterCache';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useGetExamples = (queryKey: any[] = []) => {
  // Use filter cache to save filter state
  const { filters, setFilters, resetToDefault, clearCache, loadFromCache } = useFilterCache({
    key: CACHE_KEYS.EXAMPLES_FILTER,
    defaultFilter: {
      limit: 12,
      page: 1,
      sortField: 'created_at',
      sortOrder: 'desc',
    },
  });

  const [inputSearch, setInputSearch] = useState('');

  // Debounced search to avoid calling API too frequently
  const debouncedSearch = useDebouncedCallback((search: string) => {
    setFilters({ ...filters, search });
  }, 500);

  const handleSearch = (search: string) => {
    setInputSearch(search);
    debouncedSearch(search);
  };

  const { data, isLoading, isError, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['examples', filters, ...queryKey],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await Service.example.getExamples({
        page: pageParam,
        limit: filters.limit,
        sortField: filters.sortField,
        sortOrder: filters.sortOrder,
        search: filters.search,
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination.totalPages > pages.length) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  return {
    data,
    isLoading,
    isFetching,
    isError,
    filters,
    inputSearch,
    handleSearch,
    setFilters,
    fetchNextPage,
    hasNextPage,
    resetToDefault,
    clearCache,
    loadFromCache,
  };
};
```

#### 2. **Single Data Queries**

```typescript
export const useGetExampleById = (id: string) => {
  return useQuery({
    queryKey: ['example', id],
    queryFn: async () => {
      const response = await Service.example.getExampleById(id);
      return response.data;
    },
    enabled: !!id, // Chỉ query khi có id
  });
};

export const useGetMyBalance = () => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ['my-balance'],
    queryFn: async () => {
      try {
        const response = await Service.auth.getBalance();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch balance', error);
        toast.error('Failed to fetch balance');
        return null;
      }
    },
    enabled: !!accessToken, // Only query when logged in
  });
};
```

#### 3. **Using in Components**

```typescript
// src/screens/Example/index.tsx
'use client';

import { useGetExamples, useGetExampleById } from '@/queries/useExampleQueries';
import { useCallback } from 'react';

export default function ExamplePage() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    filters,
    setFilters,
    handleSearch,
    inputSearch,
    fetchNextPage,
    hasNextPage,
  } = useGetExamples();

  const examples = data?.pages.flatMap((page) => page.data) || [];

  // Callback to load more
  const handleLoadMore = useCallback(() => {
    if (isLoading || isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  }, [isLoading, isFetching, hasNextPage, fetchNextPage]);

  return (
    <div className="flex-1">
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <ExampleList
          inputSearch={inputSearch}
          handleSearch={handleSearch}
          examples={examples}
          isLoading={isLoading}
          isFetching={isFetching}
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  );
}
```

#### 4. **Component receiving props from parent**

```typescript
// src/components/ExampleList.tsx
'use client';

interface ExampleListProps {
  examples: any[];
  isLoading: boolean;
  isFetching: boolean;
  inputSearch: string;
  handleSearch: (search: string) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
}

export const ExampleList = ({
  examples,
  isLoading,
  isFetching,
  inputSearch,
  handleSearch,
  onLoadMore,
  hasNextPage,
}: ExampleListProps) => {
  return (
    <div>
      <SearchInput value={inputSearch} onChange={handleSearch} />

      <div className="grid gap-4">
        {examples.map((example) => (
          <ExampleCard key={example.id} example={example} />
        ))}
      </div>

      {hasNextPage && (
        <Button
          onClick={onLoadMore}
          disabled={isLoading || isFetching}
        >
          {isFetching ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
};
```

#### 5. **Mutations (if needed)**

```typescript
export const useCreateExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => Service.example.createExample(data),
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['examples'] });
    },
  });
};

export const useUpdateExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      Service.example.updateExample(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['examples'] });
      queryClient.invalidateQueries({ queryKey: ['example', id] });
    },
  });
};
```

#### 6. **Filter Cache Hook**

```typescript
// src/hooks/useFilterCache.ts
export const useFilterCache = ({ key, defaultFilter }: { key: string; defaultFilter: any }) => {
  const [filters, setFilters] = useState(() => {
    // Load from cache if exists
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : defaultFilter;
  });

  const updateFilters = useCallback(
    (newFilters: any) => {
      const updated = { ...filters, ...newFilters };
      setFilters(updated);
      localStorage.setItem(key, JSON.stringify(updated));
    },
    [filters, key]
  );

  const resetToDefault = useCallback(() => {
    setFilters(defaultFilter);
    localStorage.setItem(key, JSON.stringify(defaultFilter));
  }, [defaultFilter, key]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return {
    filters,
    setFilters: updateFilters,
    resetToDefault,
    clearCache,
  };
};
```

#### 7. **Intersection Observer Pattern**

The project uses Intersection Observer for automatic infinite scroll instead of manual "Load More" buttons:

```typescript
// Intersection Observer implementation
const observerCallback = useCallback(
  (entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isLoading && !isFetching) {
      onLoadMore();
    }
  },
  [hasNextPage, isLoading, isFetching, onLoadMore]
);

useEffect(() => {
  const observer = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: '100px', // Start loading 100px before reaching the trigger
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  if (lastItemRef.current) {
    observer.observe(lastItemRef.current);
  }

  return () => {
    observer.disconnect();
  };
}, [observerCallback]);
```

**Key Features:**

- **Automatic Loading**: No manual button clicks required
- **Performance Optimized**: Uses Intersection Observer API for better performance
- **Smart Triggering**: Only loads when user scrolls near the bottom
- **Loading States**: Shows spinner while fetching next page
- **Prevents Duplicate Calls**: Checks loading states before triggering

#### 8. **Table with Pagination Pattern**

The project uses shadcn/ui Table components with custom pagination for data tables:

```typescript
// src/components/ExampleTable.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationCustom from '@/components/pagination-custom';
import { useGetExamples } from '@/queries/useExampleQueries';
import { formatNumberShort } from '@/utils/helpers/number';
import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ExampleTableProps {
  title?: string;
}

export const ExampleTable = ({ title = 'Examples' }: ExampleTableProps) => {
  const { data, isLoading, filters, setFilters, totalPages } = useGetExamples();
  const examples = data?.pages.flatMap((page) => page.data) || [];

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) {
      setFilters({ ...filters, page: 1 });
    } else if (pageNumber > totalPages) {
      setFilters({ ...filters, page: totalPages });
    } else {
      setFilters({ ...filters, page: pageNumber });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="info">Pending</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="warning">Unknown</Badge>;
    }
  };

  return (
    <Card className="border-border bg-foreground/50 shadow-2xl backdrop-blur-md">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {isLoading && <ExampleTableSkeleton />}
        {!isLoading && examples.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examples.map((example) => (
                <TableRow key={example.id} className="font-medium">
                  <TableCell className="text-green-600">
                    #{example.id.split('-')[0]}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div>{dayjs(example.createdAt).format('DD/MM/YYYY')}</div>
                      <div className="text-xs text-content">
                        {dayjs(example.createdAt).format('HH:mm')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-40">
                      <Link
                        href={`/examples/${example.id}`}
                        className="whitespace-normal break-words text-green-600 hover:underline"
                      >
                        {example.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="relative h-4 w-4 min-w-4 flex-shrink-0 overflow-hidden rounded-full bg-gray-800">
                        <Image
                          src={example.category?.logo || '/placeholder.svg'}
                          alt={`${example.category?.name} icon`}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      {example.category?.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {formatNumberShort(example.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(example.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Handle action
                      }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && examples.length === 0 && (
          <p className="py-4 text-center text-content">No examples found.</p>
        )}
        {totalPages > 1 && (
          <PaginationCustom
            pageNumber={filters.page || 1}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </CardContent>
    </Card>
  );
};

function ExampleTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
      ))}
    </div>
  );
}
```

**Key Features:**

- **Responsive Design**: Table with horizontal scroll on mobile
- **Loading States**: Skeleton loading for better UX
- **Pagination**: Custom pagination component with page numbers
- **Status Badges**: Visual status indicators
- **Action Buttons**: Interactive elements in table cells
- **Date Formatting**: Consistent date display
- **Image Handling**: Fallback images for missing assets
- **Link Navigation**: Clickable rows and cells

#### 9. **Custom Pagination Component**

The project uses a custom pagination component for better UX:

```typescript
// src/components/pagination-custom/index.tsx
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

interface PaginationCustomProps {
  pageNumber: number;
  totalPages: number;
  paginate: (page: number) => void;
}

const PaginationCustom = ({ pageNumber, totalPages, paginate }: PaginationCustomProps) => {
  return (
    <div className="my-4 flex flex-col items-center gap-4">
      <Pagination className="justify-center">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              size={'sm'}
              className={cn(
                'text-muted-foreground min-w-9 cursor-pointer p-0 px-1 text-xs font-bold',
                {
                  'text-content': pageNumber === 1,
                  'hover:text-primary': pageNumber !== 1,
                }
              )}
              onClick={() => paginate(Math.max(1, pageNumber - 1))}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= pageNumber - 1 && page <= pageNumber + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    className="w-fit min-w-9 cursor-pointer rounded-md p-0 px-1 text-xs font-bold"
                    onClick={() => paginate(page)}
                    isActive={page === pageNumber}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (page === pageNumber - 2 || page === pageNumber + 2) {
              return <PaginationEllipsis key={page} />;
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              size={'icon'}
              className={cn(
                'text-muted-foreground min-w-9 cursor-pointer p-0 px-1 text-xs font-bold',
                {
                  'text-content': pageNumber === totalPages,
                  'hover:text-primary': pageNumber !== totalPages,
                }
              )}
              onClick={() => paginate(Math.min(totalPages, pageNumber + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationCustom;
```

**Key Features:**

- **Smart Page Display**: Shows current page ± 1, first and last pages
- **Ellipsis**: Shows "..." for skipped pages
- **Disabled States**: Previous/Next buttons disabled at boundaries
- **Active State**: Current page highlighted
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Blockchain & Escrow Integration

- Supports Solana and EVM chains (Ethereum, Base, Arbitrum, etc.)
- Uses `escrow-market-sdk` for secure escrow transactions
- Wallet connection via `lynx-reown-dapp-kit` and `@reown/appkit`
- Chain configuration in `src/configs/chains.ts`
- Escrow contract types in `src/contracts/escrow/types.ts`

## Image Upload with Zipline

- Integrated image upload for user avatars and more
- See `src/service/upload.service.ts` and `/api/upload` route
- Configure Zipline endpoint and API key in environment variables

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests (Jest)

## Key Technologies

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [ethers.js](https://docs.ethers.org/)
- [escrow-market-sdk](https://www.npmjs.com/package/escrow-market-sdk)
- [lynx-reown-dapp-kit](https://www.npmjs.com/package/lynx-reown-dapp-kit)
- [@reown/appkit](https://www.npmjs.com/package/@reown/appkit)
- [Supabase](https://supabase.com/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Axios](https://axios-http.com/)

## Development Guidelines

### Code Organization

- **Screens**: Page-level components using queries and managing state
- **Components**: Reusable UI components receiving props from parent
- **Queries**: React Query hooks with infinite queries for pagination
- **Services**: Domain-driven design with singleton pattern
- **Hooks**: Utility hooks and filter cache hooks
- **Types**: Shared TypeScript interfaces and types
- **Utils**: Pure utility functions

### Data Flow Pattern

1. **Screen Component** → Uses query hooks to fetch data
2. **Query Hooks** → Call services and manage cache
3. **Services** → Call API endpoints
4. **Components** → Receive props and render UI

### Best Practices

- **Queries**: Use infinite queries for pagination, useQuery for single data
- **Filter Cache**: Save filter state in localStorage
- **Debounced Search**: Avoid calling API too frequently when searching
- **Error Handling**: Proper error handling in queries and components
- **Loading States**: Display loading states for better UX
- **TypeScript**: Full type safety for all components and functions
- **Component Props**: Pass data through props instead of calling API in components

### Component Architecture

- **Screen Components**: Manage queries and state, pass data down to components
- **List Components**: Receive data via props, handle rendering and pagination
- **Card Components**: Pure components that only render UI
- **Filter Components**: Manage filter state and callbacks

### Query Patterns

- **Infinite Queries**: For lists with pagination
- **Single Queries**: For detail pages
- **Filter Cache**: Save and restore filter state
- **Debounced Search**: Optimize search performance
- **Intersection Observer**: Automatic infinite scroll without manual buttons
- **Table Pagination**: Traditional pagination for data tables
- **Error Boundaries**: Handle query errors gracefully

### Testing

- Unit tests for utilities and hooks
- Integration tests for API endpoints
- E2E tests for critical user flows
- Component testing with React Testing Library

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Solana Docs](https://docs.solana.com/)
- [escrow-market-sdk Guide](docs/zipline-integration.md)
- [lynx-reown-dapp-kit Guide](docs/SEO_GUIDE.md)
- [Supabase Docs](https://supabase.com/docs)
- [pnpm Documentation](https://pnpm.io/motivation)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
