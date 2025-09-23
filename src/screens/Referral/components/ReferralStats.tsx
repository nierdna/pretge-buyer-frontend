'use client';

import { Card } from '@/components/ui/card';

interface ReferralStatsProps {
  totalReferrals: number;
  totalReferralPoints: number;
  tier: number;
}

export default function ReferralStats({
  totalReferrals,
  totalReferralPoints,
  tier,
}: ReferralStatsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return `$${formatNumber(num)}`;
  };

  return (
    <Card className="grid gap-6 bg-white/95 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold text-gray-900">Referral</div>
        <div className="flex flex-col">
          <div className="flex w-full items-center divide-x divide-orange-600 rounded-lg border-2 border-orange-600 p-4">
            <div className="w-full text-center">
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalReferrals)}</div>
              <div className="text-sm text-content">Total Referee</div>
            </div>

            <div className="w-full text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalReferralPoints)}
              </div>
              <div className="text-sm text-content">Total Referee Filled Volume</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
