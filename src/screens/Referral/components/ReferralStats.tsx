'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ReferralStatsProps {
  totalReferrals: number;
  totalFilledVolume: number;
  lastEpochRewards: number;
  totalDistributedRewards: number;
  tier: number;
}

export default function ReferralStats({
  totalReferrals,
  totalFilledVolume,
  lastEpochRewards,
  totalDistributedRewards,
  tier,
}: ReferralStatsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return `$${formatNumber(num)}`;
  };

  return (
    <div className="grid gap-6 rounded-lg bg-white/95 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold text-gray-900">Referral</div>
        <div className="flex flex-col">
          <div className="rounded-t-lg border border-gray-300 p-3 text-black">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-content">YOUR TIER:</span>
              <Badge
                variant="outline"
                className="border-orange-600 bg-orange-600/20 text-orange-600"
              >
                TIER {tier}
              </Badge>
            </div>
          </div>
          {/* Left Stats */}
          <div className="flex w-full items-center rounded-b-lg border-x border-b border-gray-300 p-4">
            <div className="w-full text-center">
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalReferrals)}</div>
              <div className="text-sm text-content">Total Referee</div>
            </div>

            <div className="w-full text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalFilledVolume)}
              </div>
              <div className="text-sm text-content">Total Referee Filled Volume</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Stats - Distribution Box */}
      <Card className="bg-card border-2 border-orange-600">
        <div className="p-3 text-center">
          <div className="text-sm font-semibold text-orange-600">REFERRAL DISTRIBUTION</div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-300">
          <div className="rounded-l-lg border-t border-gray-300 p-4 text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
              {formatNumber(lastEpochRewards)}
              <Image src="/point.png" className="" height={20} width={20} alt="point" />
            </div>
            <div className="text-xs text-content">Last Epoch Rewards</div>
          </div>

          <div className="rounded-r-lg border-t border-gray-300 p-4 text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
              {formatNumber(totalDistributedRewards)}
              <Image src="/point.png" className="" height={20} width={20} alt="point" />
            </div>
            <div className="text-xs text-content">Total Distributed Rewards</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
