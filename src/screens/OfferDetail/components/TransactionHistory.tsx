'use client';

import PaginationCustom from '@/components/pagination-custom';
import { Badge } from '@/components/ui/badge';
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
import { useGetOrdersByOffer } from '@/queries/useOfferQueries';
import { EOrderStatus } from '@/types/order';
import { truncateAddress } from '@/utils/helpers/string';
import dayjs from 'dayjs';
import Image from 'next/image';

interface TransactionHistoryProps {
  offerId: string;
}

export default function TransactionHistory({ offerId }: TransactionHistoryProps) {
  const {
    data,
    isLoading,
    isError,
    setPage,
    page: pageNumber,
    totalPages,
    fetchNextPage,
    hasNextPage,
  } = useGetOrdersByOffer(offerId);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) {
      setPage(1);
    } else if (pageNumber > totalPages) {
      setPage(totalPages);
    } else {
      setPage(pageNumber);
    }
  };
  const orders = data?.pages.flatMap((page) => page.data) || [];

  const getBadge = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.PENDING:
        return <Badge variant="info">Pending</Badge>;
      case EOrderStatus.SETTLED:
        return <Badge variant="success">Settled</Badge>;
      case EOrderStatus.CANCELLED:
        return <Badge>Cancelled</Badge>;
      default:
        return <Badge variant="warning">Unknown</Badge>;
    }
  };
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {isLoading && <TransactionHistorySkeleton />}
        {!isLoading && orders.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={1}>Time</TableHead>
                <TableHead colSpan={1}>Buyer</TableHead>
                <TableHead colSpan={2} className="text-right">
                  Amount
                </TableHead>
                <TableHead colSpan={2} className="text-right">
                  Value
                </TableHead>
                <TableHead colSpan={1} className="text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order?.id}>
                  <TableCell colSpan={1} className="font-medium">
                    {dayjs(order.createdAt).fromNow()}
                  </TableCell>
                  <TableCell colSpan={1}>{truncateAddress(order.buyer?.address, 4)}</TableCell>
                  <TableCell colSpan={2}>
                    <div className="flex items-center gap-2 justify-end">
                      {order.amount}
                      <div className="w-4 h-4 relative min-w-4 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                        <Image
                          src={order.offer?.tokens?.logo || '/placeholder.svg'}
                          alt={`${order.offer?.tokens?.symbol} symbol`}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <div className="flex items-center gap-2 justify-end">
                      {order.amount * order.offer.price}
                      <div className="w-4 h-4 relative min-w-4 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                        <Image
                          src={order.offer?.exToken?.logo || '/placeholder.svg'}
                          alt={`${order.offer?.exToken?.symbol} symbol`}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell colSpan={1} className="text-right">
                    {getBadge(order.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && orders.length === 0 && (
          <p className="text-center text-gray-500 py-4">No transactions yet for this offer.</p>
        )}
        {totalPages > 1 && (
          <PaginationCustom pageNumber={pageNumber} totalPages={totalPages} paginate={paginate} />
        )}
      </CardContent>
    </Card>
  );
}

function TransactionHistorySkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={1}>Time</TableHead>
          <TableHead colSpan={1}>Buyer</TableHead>
          <TableHead colSpan={2} className="text-right">
            Amount
          </TableHead>
          <TableHead colSpan={2} className="text-right">
            Value
          </TableHead>
          <TableHead colSpan={1} className="text-right">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={1} className="font-medium">
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell colSpan={1}>
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell colSpan={2} className="text-right">
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
            <TableCell colSpan={2} className="text-right">
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
            <TableCell colSpan={1} className="text-right">
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
