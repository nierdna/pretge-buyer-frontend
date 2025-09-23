'use client';

import { Button } from '@/components/ui/button';
import { useGetReferralStats } from '@/queries/useReferralQueries';
import { ChartNoAxesCombined, Copy } from 'lucide-react';
import { toast } from 'sonner';
import ReferralStats from './components/ReferralStats';
// import ReferralTierInfo from './components/ReferralTierInfo';
// import DistributionHistory from './components/DistributionHistory';
import { Skeleton } from '@/components/ui/skeleton';
import DistributionHistory from './components/DistributionHistory';
import ReferralTierInfo from './components/ReferralTierInfo';

export default function ReferralScreen() {
  const { data, isLoading, isError } = useGetReferralStats();

  const handleCopyLink = () => {
    if (!data?.referralLink) return;
    navigator.clipboard.writeText(data.referralLink);
    toast.success('Referral link copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-8 p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  // if (isError || !data) {
  //   return (
  //     <div className="container mx-auto p-6">
  //       <div className="text-center py-8">
  //         <p className="text-content">Failed to load referral data</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          {/* Main Stats */}
          <ReferralStats
            totalReferrals={data?.totalReferrals || 0}
            totalFilledVolume={data?.totalFilledVolume || 0}
            lastEpochRewards={data?.lastEpochRewards || 0}
            totalDistributedRewards={data?.totalDistributedRewards || 0}
            tier={data?.currentTier || 0}
          />
          <DistributionHistory />
        </div>
        {/* Two Column Layout */}
        <div className="flex flex-col gap-4 rounded-lg bg-white/95 p-6">
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined className="h-5 w-5" />
            <div className="text-2xl font-bold text-gray-900">Referral Tier Info</div>
          </div>
          {/* Right Column - Referral Info */}
          <div className="flex w-full flex-col gap-4">
            {/* Your Referral Link */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 py-1">
              <span className="flex-1 truncate text-sm text-gray-900">
                {data?.referralLink || 'mock link'}{' '}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyLink}
                className="h-8 w-8 shrink-0 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {/* Referral Tier Info */}
            <ReferralTierInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
