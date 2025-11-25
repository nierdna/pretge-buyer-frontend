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
import { useAuth } from '@/hooks/useAuth';
import { getSettleStatusDisplay, useSettleStatus } from '@/hooks/useSettleStatus';
import { cn } from '@/lib/utils';
import { useGetOrdersByOffer } from '@/queries/useOfferQueries';
import DialogOrderPurchase from '@/screens/OrderHistory/components/DialogOrderPurchase';
import { useAuthStore } from '@/store/authStore';
import { IOffer } from '@/types/offer';
import { EOrderStatus, IOrder } from '@/types/order';
import { IToken } from '@/types/token';
import { handleLinkTxHash } from '@/utils/helpers/getBlockUrlLink';
import { formatNumberShort } from '@/utils/helpers/number';
import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface TransactionHistoryProps {
  offerId: string;
  token?: IToken;
  offer?: IOffer;
}

export interface TransactionHistoryRef {
  resetToFirstPage: () => void;
}

const TransactionHistory = forwardRef<TransactionHistoryRef, TransactionHistoryProps>(
  ({ offerId, token, offer }, ref) => {
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

    // Use the new settle status hook
    const settleStatus = useSettleStatus({
      startTime: token?.startTime,
      settleDuration: offer?.settleDuration,
      tokenStatus: token?.status,
    });

    const { walletAddress: address } = useAuthStore();
    const { chainId: chainIdConnect } = useAuth();
    const [orderIdTarget, setOrderIdTarget] = useState<string | null>(null);
    const [showOrderPurchaseModal, setShowOrderPurchaseModal] = useState(false);

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
    const orderFind = orders.find((order) => order.id === orderIdTarget);

    const getBadge = (status: EOrderStatus) => {
      switch (status) {
        case EOrderStatus.PENDING:
          return <Badge variant="info">Pending</Badge>;
        case EOrderStatus.SETTLED:
          return <Badge variant="success">Settled</Badge>;
        case EOrderStatus.CANCELLED:
          return <Badge>Cancelled</Badge>;
        case EOrderStatus.SETTLING:
          return <Badge variant={'danger'}>Settling</Badge>;
        default:
          return <Badge>Unknown</Badge>;
      }
    };

    const handlePurchase = (order: IOrder) => {
      setOrderIdTarget(order?.id);
      const chainId = order?.offer?.exToken?.network?.chainId?.toString() || '';
      if (!address || chainId.toLowerCase() !== chainIdConnect?.toString().toLowerCase()) {
        open();
        return;
      }
      setOrderIdTarget(order?.id);
      setShowOrderPurchaseModal(true);
    };

    const handleCloseOrderPurchaseModal = () => {
      setOrderIdTarget(null);
      setShowOrderPurchaseModal(false);
    };

    const getReviewStatus = (order: IOrder) => {
      if (!order) return null;

      return (
        <Button
          size="sm"
          onClick={() => handlePurchase(order)}
          disabled={
            !(order.status === EOrderStatus.PENDING && order.collateralPercent < 100) ||
            !settleStatus.canPurchase
          }
        >
          Purchase
        </Button>
      );
    };

    const statusInfo = getSettleStatusDisplay(settleStatus.status);

    return (
      <Card className="overflow-x-auto">
        <CardHeader className="flex justify-between p-6 pb-4">
          <CardTitle className="flex justify-between text-xl">
            <span className="inline-block">My Orders</span>
            <Link href="/my-orders" className="text-end text-base underline">
              View All
            </Link>
          </CardTitle>

          {/* Status notification using the new hook */}
          {settleStatus.message && (
            <div
              className={`mt-2 rounded-lg border border-border p-3 text-sm ${statusInfo.className}`}
            >
              <p className="font-medium">
                {statusInfo.icon} {statusInfo.title}
              </p>
              <p>{settleStatus.message}</p>
            </div>
          )}
        </CardHeader>
        <CardContent className="w-full overflow-x-auto p-6 pt-0">
          {isLoading && <TransactionHistorySkeleton />}
          {!isLoading && orders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={1}>Time</TableHead>
                  {/* <TableHead colSpan={1}>Your Wallet</TableHead> */}
                  <TableHead colSpan={2} className="text-right">
                    Amount
                  </TableHead>
                  <TableHead colSpan={1} className="text-right">
                    Collateral
                  </TableHead>
                  <TableHead colSpan={1} className="text-right">
                    Discount
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
                  <TableHead colSpan={1} className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order?.id}>
                    <TableCell colSpan={1} className="font-medium" width={64}>
                      {dayjs(order.createdAt).fromNow()}
                    </TableCell>
                    {/* <TableCell colSpan={1}>{truncateAddress(order.buyer?.address, 4)}</TableCell> */}
                    <TableCell colSpan={2}>
                      <div className="flex items-center justify-end gap-1">
                        {formatNumberShort(order.amount)}
                        <div className="relative mb-0.5 h-4 w-4 min-w-4 flex-shrink-0 overflow-hidden rounded-full bg-gray-800">
                          <Image
                            src={order.offer?.tokens?.logo || '/placeholder.svg'}
                            alt={`${order.offer?.tokens?.symbol} symbol`}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell colSpan={1} className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {formatNumberShort(order.collateralPercent)}%
                      </div>
                    </TableCell>
                    <TableCell colSpan={1} className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {formatNumberShort(order?.discountPercent)}%
                      </div>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <div className="flex flex-col gap-1">
                        {order.discountPercent > 0 && (
                          <div className="flex items-center justify-end gap-1 text-red-500">
                            {formatNumberShort(
                              order.amount * order.offer.price * (1 - order.discountPercent / 100)
                            )}
                            <div className="relative mb-0.5 h-4 w-4 min-w-4 flex-shrink-0 overflow-hidden rounded-full bg-gray-800">
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
                          className={cn('flex items-center justify-end gap-1', {
                            'line-through': order.discountPercent > 0,
                          })}
                        >
                          {formatNumberShort(order.amount * order.offer.price)}
                          <div className="relative mb-0.5 h-4 w-4 min-w-4 flex-shrink-0 overflow-hidden rounded-full bg-gray-800">
                            <Image
                              src={order.offer?.exToken?.logo || '/placeholder.svg'}
                              alt={`${order.offer?.exToken?.symbol} symbol`}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell colSpan={1} className="text-right">
                      {getBadge(order.status)}
                    </TableCell>
                    <TableCell colSpan={1} className="text-right" width={100}>
                      {order.hashId ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleLinkTxHash({
                              txHashUrl: order.offer?.exToken?.network?.txHashUrl || '',
                              txHash: order.hashId || '',
                            });
                          }}
                        >
                          <ArrowUpRight className="text-content h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-content text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell colSpan={1} className="text-right" width={160}>
                      {getReviewStatus(order)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-content text-lg font-medium">No orders found</div>
              <div className="text-content text-sm">
                You haven't placed any orders for this offer yet.
              </div>
            </div>
          )}
          {!isLoading && orders.length > 0 && totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <PaginationCustom
                pageNumber={pageNumber}
                totalPages={totalPages}
                paginate={paginate}
              />
            </div>
          )}
        </CardContent>
        {orderFind && (
          <DialogOrderPurchase
            order={orderFind}
            isOpen={showOrderPurchaseModal}
            onClose={handleCloseOrderPurchaseModal}
            refetchOrders={async () => {
              resetToFirstPage();
            }}
          />
        )}
      </Card>
    );
  }
);

TransactionHistory.displayName = 'TransactionHistory';

export default TransactionHistory;

// export function TransactionHistorySkeleton() {
//   return (
//     <div className="space-y-4">
//       {Array.from({ length: 3 }).map((_, index) => (
//         <div key={index} className="flex items-center space-x-4">
//           <Skeleton className="h-4 w-20" />
//           <Skeleton className="h-4 w-32" />
//           <Skeleton className="h-4 w-24" />
//           <Skeleton className="h-4 w-16" />
//           <Skeleton className="h-4 w-20" />
//           <Skeleton className="h-4 w-20" />
//           <Skeleton className="h-4 w-24" />
//           <Skeleton className="h-4 w-28" />
//         </div>
//       ))}
//     </div>
//   );
// }

export function TransactionHistorySkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          {/* <TableHead>Your Wallet</TableHead> */}
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Collateral</TableHead>
          <TableHead className="text-right">Discount</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Txn</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-1/2" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-1/2" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
