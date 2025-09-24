'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetReferralRewards } from '@/queries/useReferralQueries';
import { ReferralRewardWithDetails } from '@/types/referral';
import dayjs from 'dayjs';
import { RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
interface RewardRecord {
  timestamp: string;
  rewards: number;
  txHash: string;
  questTitle: string;
  referredUserName: string;
}

export default function RewardHistory() {
  const { data, pagination, isLoading, isError, isFetching, handlePageChange } =
    useGetReferralRewards();

  // Transform API data to display format
  const rewardRecords: RewardRecord[] = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((reward: ReferralRewardWithDetails) => ({
      timestamp: dayjs(reward.createdAt).fromNow(),
      rewards: reward.pointsEarned,
      txHash: reward.id.substring(0, 10) + '...',
      questTitle: reward.quest.title,
      referredUserName: reward?.referredUser?.name,
    }));
  }, [data]);

  const handlePageClick = (page: number) => {
    if (!isFetching) {
      handlePageChange(page);
    }
  };

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-gray-900" />
          <CardTitle className="font-medium text-gray-900">Reward History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              <TableHead className="w-[120px] text-xs font-medium text-content">Date</TableHead>
              <TableHead className="w-[100px] text-xs font-medium text-content">Points</TableHead>
              <TableHead className="text-xs font-medium text-content">Quest</TableHead>
              <TableHead className="w-[150px] text-xs font-medium text-content">User</TableHead>
              {/* <TableHead className="w-[100px] text-xs font-medium text-content">TX ID</TableHead> */}
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableBody>
              {[...Array(4)].map((_, index) => (
                <TableRow key={index} className="border-line hover:bg-transparent">
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  {/* <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          ) : rewardRecords.length === 0 ? (
            <TableBody>
              <TableRow className="border-line hover:bg-transparent">
                <TableCell colSpan={4} className="py-16 pt-24 text-center text-content">
                  No reward history found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {rewardRecords.map((record, index) => (
                <TableRow key={index} className="border-line hover:bg-gray-50/50">
                  <TableCell className="text-sm font-medium text-gray-700">
                    {record.timestamp}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-green-600">+{record.rewards}</span>
                      <Image
                        src="/point.png"
                        height={16}
                        width={16}
                        alt="point"
                        className="opacity-80"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="space-y-1">
                      <div className="font-medium leading-tight text-gray-900">
                        {record.questTitle}
                      </div>
                      {/* <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>Referred:</span>
                        <span className="font-medium text-blue-600">{record.referredUserName}</span>
                      </div> */}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
                      {record.referredUserName}
                    </div>
                  </TableCell>
                  {/* <TableCell className="text-sm">
                    <div className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
                      {record.txHash}
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageClick(pagination.page - 1)}
                    className={
                      pagination.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {/* First page */}
                {pagination.page > 2 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageClick(1)} className="cursor-pointer">
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {pagination.page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {/* Previous page */}
                {pagination.page > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageClick(pagination.page - 1)}
                      className="cursor-pointer"
                    >
                      {pagination.page - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Current page */}
                <PaginationItem>
                  <PaginationLink isActive className="cursor-default">
                    {pagination.page}
                  </PaginationLink>
                </PaginationItem>

                {/* Next page */}
                {pagination.page < pagination.totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageClick(pagination.page + 1)}
                      className="cursor-pointer"
                    >
                      {pagination.page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Last page */}
                {pagination.page < pagination.totalPages - 1 && (
                  <>
                    {pagination.page < pagination.totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageClick(pagination.totalPages)}
                        className="cursor-pointer"
                      >
                        {pagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageClick(pagination.page + 1)}
                    className={
                      pagination.page >= pagination.totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
