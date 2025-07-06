import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from '@/components/ui/pagination';
import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: PaginationProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Generate page numbers to display
  const paginationItems = useMemo(() => {
    const items = [];

    // Always show first page
    if (totalPages > 0) {
      items.push(1);
    }

    // Calculate range of pages to show around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push('ellipsis-start');
    }

    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1 && totalPages > 1) {
      items.push('ellipsis-end');
    }

    // Always show last page if different from first
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="mt-8">
      <ShadcnPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasPrevious) onPageChange(currentPage - 1);
              }}
              className={!hasPrevious ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {paginationItems.map((item, index) => {
            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const page = item as number;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasNext) onPageChange(currentPage + 1);
              }}
              className={!hasNext ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}
