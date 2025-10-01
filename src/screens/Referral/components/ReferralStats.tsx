'use client';

import { Card } from '@/components/ui/card';
import { formatNumberShort } from '@/utils/helpers/number';
import Image from 'next/image';

interface ReferralStatsProps {
  totalReferrals: number;
  totalReferralPoints: number;
  totalPoints: number; // Điểm từ quest
  tier: number;
}

export default function ReferralStats({
  totalReferrals,
  totalReferralPoints,
  totalPoints,
  tier,
}: ReferralStatsProps) {
  return (
    <Card className="grid gap-6 bg-white/95 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold text-gray-900">Referral</div>
        <div className="flex flex-col">
          <div className="flex w-full items-center divide-x divide-orange-600 rounded-lg border-2 border-orange-600 p-4">
            <div className="w-full text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatNumberShort(totalReferrals)}
              </div>
              <div className="text-sm text-content">Total Referee</div>
            </div>

            <div className="w-full text-center">
              <div className="flex items-center justify-center gap-0">
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumberShort(totalPoints)}
                </div>
                <Image src={'/point.png'} height={24} width={24} alt="points" />
              </div>
              <div className="text-sm text-content">Total Points from Quests</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
