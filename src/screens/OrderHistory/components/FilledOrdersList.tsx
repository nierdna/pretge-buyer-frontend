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
import { useMyFilledOrders } from '@/queries/useProfile';
import { EOrderStatus } from '@/types/order';
import { handleLinkTxHash } from '@/utils/helpers/getBlockUrlLink';
import { formatNumberShort } from '@/utils/helpers/number';
import { normalizeNetworkName } from '@/utils/helpers/string';
import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function FilledOrdersList() {
  const { data, isLoading, filters, setFilters, totalPages } = useMyFilledOrders();
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
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) {
      setFilters({ ...filters, page: 1 });
    } else if (pageNumber > totalPages) {
      setFilters({ ...filters, page: totalPages });
    } else {
      setFilters({ ...filters, page: pageNumber });
    }
  };
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Orders History</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {isLoading && <FilledOrdersListSkeleton />}
        {!isLoading && orders.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Txn</TableHead>
                <TableHead className="text-right">Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order?.id} className="font-medium">
                  <TableCell className="text-green-600">#{order?.id.split('-')[0]}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div>{dayjs(order?.createdAt).format('DD/MM/YYYY')}</div>
                      <div className="text-xs text-gray-500">
                        {dayjs(order?.createdAt).format('HH:mm')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-40">
                      <p className="break-words whitespace-normal text-green-600">
                        {`${order?.offer?.title || ''} - ${order?.offer?.tokens?.symbol || ''} - ${
                          normalizeNetworkName(order?.offer?.exToken?.network?.name) || ''
                        }`}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 relative min-w-4 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                        <Image
                          src={order.offer?.tokens?.logo || '/placeholder.svg'}
                          alt={`${order.offer?.tokens?.symbol} symbol`}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      {order.offer?.tokens?.symbol}
                    </div>
                  </TableCell>
                  <TableCell className="text-green-600">
                    {order.offer?.sellerWallet?.user?.name}
                  </TableCell>
                  <TableCell className="text-center">{formatNumberShort(order.amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {formatNumberShort(order.offer?.price)}
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
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {formatNumberShort(order.offer?.promotion?.discountPercent)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {formatNumberShort(
                        order.amount *
                          order.offer?.price *
                          (1 - (order.offer?.promotion?.discountPercent || 0) / 100)
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
                  </TableCell>
                  <TableCell className="text-right">{getBadge(order?.status)}</TableCell>
                  {order?.status !== EOrderStatus.PENDING ? (
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          let txHash = '';
                          if (order?.status === EOrderStatus.CANCELLED) {
                            txHash = order?.cancelTxHash || '';
                          } else if (order?.status === EOrderStatus.SETTLED) {
                            txHash = order?.settleTxHash || '';
                          }

                          handleLinkTxHash({
                            txHashUrl: order?.offer?.exToken?.network?.txHashUrl,
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
          <p className="text-center text-gray-500 py-4">You have no filled orders yet.</p>
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
}

function FilledOrdersListSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Token</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Discount</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Txn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
