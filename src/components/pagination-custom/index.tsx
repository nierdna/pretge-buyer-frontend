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
                <PaginationItem key={page} className="">
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
      {/* <div className="whitespace-nowrap text-sm text-content">
    Showing {indexOfFirstPosition + 1}-
    {Math.min(indexOfLastPosition, Number(pagination?.total))} of{' '}
    {Number(pagination?.total)}
  </div> */}
    </div>
  );
};

export default PaginationCustom;
