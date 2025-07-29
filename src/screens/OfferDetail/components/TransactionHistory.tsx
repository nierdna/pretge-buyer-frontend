'use client';

import PaginationCustom from '@/components/pagination-custom';
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
import { cn } from '@/lib/utils';
import { useGetOrdersByOffer } from '@/queries/useOfferQueries';
import { EOrderStatus } from '@/types/order';
import { handleLinkTxHash } from '@/utils/helpers/getBlockUrlLink';
import { formatNumberShort } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { forwardRef, useImperativeHandle } from 'react';

interface TransactionHistoryProps {
  offerId: string;
}

export interface TransactionHistoryRef {
  resetToFirstPage: () => void;
}

const TransactionHistory = forwardRef<TransactionHistoryRef, TransactionHistoryProps>(
  ({ offerId }, ref) => {
    const {
      data,
      isLoading,
      setPage,
      page: pageNumber,
      totalPages,
      resetToFirstPage,
    } = useGetOrdersByOffer(offerId);

    // Expose reset function to parent
    useImperativeHandle(ref, () => ({
      resetToFirstPage,
    }));

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
          return <Badge variant="warning">Pending</Badge>;
        case EOrderStatus.SETTLED:
          return <Badge variant="success">Settled</Badge>;
        case EOrderStatus.CANCELLED:
          return <Badge>Cancelled</Badge>;
        default:
          return <Badge variant="warning">Unknown</Badge>;
      }
    };
    return (
      <Card className="overflow-x-auto">
        <CardHeader className="p-6 pb-4 flex justify-between">
          <CardTitle className="text-xl flex justify-between">
            <span className="inline-block">My Orders</span>
            <Link href="/my-orders" className="underline text-end text-base">
              View All
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 w-full overflow-x-auto">
          {isLoading && <TransactionHistorySkeleton />}
          {!isLoading && orders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={1}>Time</TableHead>
                  <TableHead colSpan={1}>Your Wallet</TableHead>
                  <TableHead colSpan={2} className="text-right">
                    Amount
                  </TableHead>
                  <TableHead colSpan={2} className="text-right">
                    Value
                  </TableHead>
                  <TableHead colSpan={1} className="text-right">
                    Status
                  </TableHead>
                  <TableHead colSpan={1} className="text-right">
                    Txn
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
                        {formatNumberShort(order.amount)}
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
                      <div className="flex flex-col gap-1">
                        {order.discountPercent > 0 && (
                          <div className="flex items-center gap-2 justify-end text-red-500">
                            {formatNumberShort(
                              order.amount * order.offer.price * (1 - order.discountPercent / 100)
                            )}
                            <div className="w-4 h-4 relative min-w-4 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                              <Image
                                src={order.offer?.exToken?.logo || '/placeholder.svg'}
                                alt={`${order.offer?.exToken?.symbol} symbol`}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div
                          className={cn('flex items-center justify-end', {
                            // 'line-through': order.discountPercent > 0,
                          })}
                        >
                          <div className="relative flex items-center justify-end gap-2 w-fit min-w-9">
                            {order.discountPercent > 0 && (
                              <div className="absolute h-px -right-0.5 top-1/2 -translate-y-1/2 w-full bg-content z-10"></div>
                            )}
                            {formatNumberShort(order.amount * order.offer.price, {
                              maxDecimalCount: 4,
                            })}
                            <div className="w-4 h-4 relative min-w-4 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                              <Image
                                src={order.offer?.exToken?.logo || '/placeholder.svg'}
                                alt={`${order.offer?.exToken?.symbol} symbol`}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell colSpan={1} className="text-right">
                      {getBadge(order.status)}
                    </TableCell>
                    {order?.status !== EOrderStatus.PENDING ? (
                      <TableCell colSpan={1} className="text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            let txHash = '';
                            if (order?.status === EOrderStatus.CANCELLED) {
                              txHash = order?.cancelTxHash || '';
                            } else if (order?.status === EOrderStatus.SETTLED) {
                              txHash = order?.settleTxHash || '';
                            }
                            handleLinkTxHash({
                              txHashUrl: order.offer?.exToken?.network?.txHashUrl,
                              txHash,
                            });
                          }}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell className="text-right text-gray-500">N/A</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && orders.length === 0 && (
            <p className="text-center text-gray-500 py-4">No transactions for this offer.</p>
          )}
          {totalPages > 1 && (
            <PaginationCustom pageNumber={pageNumber} totalPages={totalPages} paginate={paginate} />
          )}
        </CardContent>
      </Card>
    );
  }
);

export function TransactionHistorySkeleton() {
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
          <TableHead colSpan={1} className="text-right">
            Txn
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
            <TableCell colSpan={1} className="text-right">
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TransactionHistory;
