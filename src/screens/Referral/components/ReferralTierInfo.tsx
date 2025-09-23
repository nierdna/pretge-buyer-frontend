'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TierInfo {
  tier: number;
  emoji: string;
  rewards: string;
  requirements: string;
}

const tierData: TierInfo[] = [
  {
    tier: 1,
    emoji: '',
    rewards: '2.5% fee collected from referee paid in xWHALES',
    requirements: 'No requirements.',
  },
  {
    tier: 2,
    emoji: '🥉',
    rewards: '5% fee collected from referee paid in xWHALES',
    requirements: 'Combined filled volume over $200K from referee.',
  },
  {
    tier: 3,
    emoji: '🔥',
    rewards: '7.5% fee collected from referee paid in xWHALES',
    requirements: 'Combined filled volume over $500K from referee.',
  },
  {
    tier: 4,
    emoji: '👑',
    rewards: '10% fee collected from referee paid in xWHALES',
    requirements: 'Combined filled volume over $1M from referee.',
  },
];

export default function ReferralTierInfo() {
  return (
    <Card className="bg-card border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="text-blue-400">📊</div>
          <CardTitle className="text-gray-900">Referral Tier Info</CardTitle>
        </div>
        <p className="text-sm text-content">
          The Referral Program Reward will be distributed{' '}
          <span className="font-medium text-gray-900">monthly</span> based on the User Tier
          accumulated through the combined{' '}
          <span className="font-medium text-gray-900">filled volume from referees</span>.
        </p>
        <button className="flex w-fit items-center gap-1 text-sm text-yellow-500 transition-colors hover:text-yellow-400">
          Learn more ↗
        </button>
      </CardHeader>
      <CardContent className="">
        <div className="grid gap-1 text-xs">
          <div className="grid grid-cols-3 border-b border-gray-200 font-medium text-content">
            <div className="border-r border-gray-200 py-3 pr-4">REFERRAL TIER</div>
            <div className="border-r border-gray-200 px-4 py-3">REWARDS</div>
            <div className="py-3 pl-4">REQUIREMENTS</div>
          </div>
        </div>

        <div className="">
          {tierData.map((tier) => (
            <div
              key={tier.tier}
              className="grid grid-cols-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                <span className="text-xs font-medium text-gray-900">TIER {tier.tier}</span>
                {tier.emoji && <span className="text-sm">{tier.emoji}</span>}
              </div>

              <div className="border-r border-gray-200 px-4 py-2 text-xs text-content">
                {tier.rewards}
              </div>

              <div className="px-4 py-2 text-xs text-content">{tier.requirements}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
