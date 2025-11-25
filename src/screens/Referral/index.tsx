'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetReferralStats } from '@/queries/useReferralQueries';
import { ChartNoAxesCombined, Copy } from 'lucide-react';
import { toast } from 'sonner';
import ReferralStats from './components/ReferralStats';
import ReferralTierInfo from './components/ReferralTierInfo';
import RewardHistory from './components/RewardHistory';
import UserQuest from './components/UserQuest';

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
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
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
            totalReferralPoints={data?.totalReferralPoints || 0}
            totalPoints={data?.totalPoints || 0}
            tier={data?.currentTier || 0}
          />
          <RewardHistory />
        </div>
        {/* Two Column Layout */}
        <Card className="flex flex-col gap-4 bg-foreground/50 p-6">
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined className="h-5 w-5" />
            <div className="text-2xl font-bold text-gray-900">Referral Info</div>
          </div>
          {/* Right Column - Referral Info */}
          <div className="flex w-full flex-col gap-4">
            {/* Your Referral Link */}
            <div
              className={`flex items-center gap-2 rounded-lg border border-border p-3 py-1 ${
                data?.referralLink ? '' : 'bg-gray-100'
              }`}
            >
              <span
                className={`flex-1 truncate text-sm ${
                  data?.referralLink ? 'text-gray-900' : 'text-gray-300'
                }`}
              >
                {data?.referralLink || '--'}{' '}
              </span>
              <Button
                disabled={!data?.referralLink}
                size="sm"
                variant="ghost"
                onClick={handleCopyLink}
                className="h-8 w-8 shrink-0 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {/* Referral Info */}
            <ReferralTierInfo />
          </div>
        </Card>
      </div>

      <UserQuest />
    </div>
  );
}
