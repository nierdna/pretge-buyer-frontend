'use client';

import { useFeaturedProducts } from '@/hooks/queries/useProductQueries';
import { useEffect, useState } from 'react';
import {
  ActiveFiltersList,
  FlashSaleBanner,
  MobileFilterDrawer,
  Pagination,
  ProductControls,
  ProductFilters,
  ProductGrid,
} from './components';

export default function HomeScreen() {
  // Use React Query to fetch featured products
  const { data, isLoading, isError } = useFeaturedProducts();
  const products = data?.data || [];

  // Filter states
  const [viewMode, setViewMode] = useState<'grid' | 'large-grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<string>('price_low');
  const [activeFilters, setActiveFilters] = useState<string[]>(['buy-now']);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Mobile filter drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Force grid view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode('grid');
    }
  }, [isMobile]);

  // Featured products
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 5);

  // Sort products based on selected order
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'price_low') return a.price - b.price;
    if (sortOrder === 'price_high') return b.price - a.price;
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleSortChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder);
  };

  const handleViewModeChange = (newViewMode: 'grid' | 'large-grid' | 'list') => {
    // Don't allow view mode changes on mobile - force grid view
    if (isMobile) {
      setViewMode('grid');
    } else {
      setViewMode(newViewMode);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you would fetch the data for the new page here
  };

  const handleFilterClick = () => {
    setIsFilterDrawerOpen(true);
  };

  return (
    <>
      {/* Flash Sale Slider */}
      <div className="mb-6">
        <FlashSaleBanner isLoading={isLoading} products={products} />
      </div>

      {/* Main content with responsive layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar for filters - hidden on screens below 1024px */}
        <div className="hidden lg:block">
          <ProductFilters activeFilters={activeFilters} onFilterToggle={toggleFilter} />
        </div>

        {/* Right side content */}
        <div className="flex-1">
          {/* Search, Sort and View Controls */}
          <ProductControls
            sortOrder={sortOrder}
            viewMode={viewMode}
            onSortChange={handleSortChange}
            onViewModeChange={handleViewModeChange}
            onFilterClick={handleFilterClick}
          />

          {/* Active Filters */}
          <ActiveFiltersList activeFilters={activeFilters} onFilterToggle={toggleFilter} />

          {/* Products Grid */}
          <ProductGrid
            products={sortedProducts}
            isLoading={isLoading}
            isError={isError}
            viewMode={viewMode}
          />

          {/* Pagination */}
          {!isLoading && products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={5} // This would come from API in a real app
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        activeFilters={activeFilters}
        onFilterToggle={toggleFilter}
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
}
