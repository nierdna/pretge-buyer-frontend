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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { getSettleStatusDisplay, SettleStatus, useSettleStatus } from '@/hooks/useSettleStatus';
import { useMyFilledOrders } from '@/queries/useProfile';
import { OrderService } from '@/service/order.service';
import { useAuthStore } from '@/store/authStore';
import { EOrderStatus, IOrder } from '@/types/order';
import { handleLinkTxHash } from '@/utils/helpers/getBlockUrlLink';
import { formatNumberShort } from '@/utils/helpers/number';
import { normalizeNetworkName } from '@/utils/helpers/string';
import { useAppKit } from '@reown/appkit/react';
import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import DialogOrderPurchase from './DialogOrderPurchase';
import ReviewModal from './ReviewModal';

export default function FilledOrdersList() {
  const { walletAddress: address } = useAuthStore();
  const { chainId: chainIdConnect } = useAuth();
  const { open } = useAppKit();

  const { data, isLoading, filters, setFilters, totalPages, refetchOrders } = useMyFilledOrders();
  const orders = data?.pages.flatMap((page) => page.data) || [];
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [orderIdTarget, setOrderIdTarget] = useState<string | null>(null);
  const [showOrderPurchaseModal, setShowOrderPurchaseModal] = useState(false);
  const [statusInfoList, setStatusInfoList] = useState<Record<string, SettleStatus>>({});

  const orderFind = orders.find((order) => order.id === orderIdTarget);

  const handleOpenReviewModal = (order: IOrder) => {
    setOrderIdTarget(order?.id);
    setIsReviewModalOpen(true);
  };
  const handleCloseReviewModal = () => {
    setOrderIdTarget(null);
    setIsReviewModalOpen(false);
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

  const handleReviewSubmit = async (rating: number, comment: string) => {
    setIsLoadingReview(true);
    try {
      if (!orderFind) return;

      const orderService = new OrderService();
      await orderService.reviewOrder(orderFind.id, rating, comment);
      await refetchOrders();

      toast.success('Review submitted successfully');
      handleCloseReviewModal();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsLoadingReview(false);
    }
  };

  const getBadge = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.PENDING:
        return <Badge variant="info">Pending</Badge>;
      case EOrderStatus.SETTLED:
        return <Badge variant="success">Settled</Badge>;
      case EOrderStatus.CANCELLED:
        return <Badge>Cancelled</Badge>;
      case EOrderStatus.SETTLING:
        return <Badge variant={'warning'}>Settling</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleSetStatusInfo = (order: IOrder, status: SettleStatus) => {
    setStatusInfoList((prev) => ({ ...prev, [order?.id]: status }));
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
    <div className="container p-6">
      <Card>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-xl">My Orders</CardTitle>
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
                  <TableHead className="text-right">Collateral</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Txn</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order?.id} className="font-medium">
                    <TableCell className="text-content">
                      <div className="flex items-center gap-1">
                        #{order?.id.split('-')[0]}
                        {(statusInfoList[order?.id] === 'purchase' ||
                          statusInfoList[order?.id] === 'not_purchase') && (
                          <Tooltip>
                            <TooltipTrigger className="mb-0.5">
                              {getSettleStatusDisplay(statusInfoList[order?.id]).icon}
                            </TooltipTrigger>
                            <TooltipContent>
                              {getSettleStatusDisplay(statusInfoList[order?.id]).title}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="text-content">
                          {dayjs(order?.createdAt).format('MM/DD/YY')}
                        </div>
                        <div className="text-content text-xs">
                          {dayjs(order?.createdAt).format('HH:mm')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell width={240}>
                      <div className="min-w-60">
                        <Link
                          href={`/offers/${order.offer?.id}`}
                          className="whitespace-normal break-words text-green-600 hover:underline"
                          target="_blank"
                        >
                          {`${order?.offer?.title || ''} - ${order?.offer?.tokens?.symbol || ''} - ${
                            normalizeNetworkName(order?.offer?.exToken?.network?.name) || ''
                          }`}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="relative mb-0.5 h-4 w-4 min-w-4 flex-shrink-0 overflow-hidden rounded-full bg-gray-800">
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
                      <Link
                        href={`/sellers/${order.offer?.sellerWallet?.user?.id}`}
                        className="hover:underline"
                      >
                        {order.offer?.sellerWallet?.user?.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">{formatNumberShort(order.amount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {formatNumberShort(order.offer?.price, {
                          maxDecimalCount: 4,
                        })}
                        <div className="relative mb-0.5 h-4 w-4 min-w-4 flex-shrink-0 overflow-hidden rounded-full bg-gray-800">
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
                      <div className="flex items-center justify-end gap-2">
                        {formatNumberShort(order.collateralPercent)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {formatNumberShort(order.offer?.promotion?.discountPercent)}%
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {formatNumberShort(
                          order.amount *
                            order.offer?.price *
                            (1 - (order.offer?.promotion?.discountPercent || 0) / 100),
                          {
                            maxDecimalCount: 4,
                          }
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
                      <TableCell className="text-content text-right">N/A</TableCell>
                    )}
                    <TableCell className="text-end" width={112}>
                      <ButtonAction
                        statusInfo={statusInfoList[order?.id]}
                        handleSetStatusInfo={handleSetStatusInfo}
                        order={order}
                        handlePurchase={handlePurchase}
                        handleOpenReviewModal={handleOpenReviewModal}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && orders.length === 0 && (
            <p className="text-content py-4 text-center">You have no filled orders.</p>
          )}
          {totalPages > 1 && (
            <PaginationCustom
              pageNumber={filters.page || 1}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </CardContent>
        {orderFind && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={handleCloseReviewModal}
            order={orderFind}
            onReviewSubmit={handleReviewSubmit}
            isLoading={isLoadingReview}
          />
        )}
        {orderFind && (
          <DialogOrderPurchase
            order={orderFind}
            isOpen={showOrderPurchaseModal}
            onClose={handleCloseOrderPurchaseModal}
            refetchOrders={refetchOrders}
          />
        )}
      </Card>
    </div>
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

const ButtonAction = ({
  order,
  statusInfo,
  handleSetStatusInfo,
  handlePurchase,
  handleOpenReviewModal,
}: {
  order: IOrder;
  statusInfo: SettleStatus;
  handleSetStatusInfo: (order: IOrder, status: SettleStatus) => void;
  handlePurchase: (order: IOrder) => void;
  handleOpenReviewModal: (order: IOrder) => void;
}) => {
  const settleStatus = useSettleStatus({
    startTime: order?.offer?.tokens?.startTime,
    settleDuration: order?.offer?.settleDuration || 0,
    tokenStatus: order?.offer?.tokens?.status,
    callBack: (status: SettleStatus) => {
      handleSetStatusInfo(order, status);
    },
  });

  if (!order) return <></>;

  if (order.status === EOrderStatus.PENDING && order.collateralPercent < 100) {
    return (
      <Button size="sm" onClick={() => handlePurchase(order)} disabled={!settleStatus.canPurchase}>
        Purchase
      </Button>
    );
  }

  if (order.status !== EOrderStatus.SETTLED || !order.review) {
    return <></>;
  }
  if (order?.review?.status === 'pending') return <Badge variant="info">Pending</Badge>;
  if (order?.review?.status === 'approved') return <Badge variant="success">Reviewed</Badge>;
  if (order?.review?.status === 'rejected') return <Badge variant="danger">Rejected</Badge>;
  return (
    <Button size="sm" onClick={() => handleOpenReviewModal(order)}>
      Review
    </Button>
  );
};
