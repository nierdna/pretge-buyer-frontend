'use client';

import { ITokenProjectExternal } from '@/types/tokenProject';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface TokenInvestorsProps {
  tokenExternal?: ITokenProjectExternal | null;
}

export default function TokenInvestors({ tokenExternal }: TokenInvestorsProps) {
  const investors = tokenExternal?.data?.investors || [];

  // Mock data if no investors
  const displayInvestors =
    investors.length > 0
      ? investors.slice(0, 6)
      : [
          { name: 'Cobie', type: 'Angel Investor', tier: 'Tier1', logoUrl: '' },
          { name: 'Framework Ventures', type: 'Ventures Capital', tier: 'Tier1', logoUrl: '' },
          { name: '6MV (6th Man Ventures)', type: 'Ventures Capital', tier: 'Tier2', logoUrl: '' },
          { name: 'Founders Fund', type: 'Ventures Capital', tier: 'Tier2', logoUrl: '' },
          { name: 'Framework Ventures', type: 'Ventures Capital', tier: 'Tier3', logoUrl: '' },
          { name: 'Framework Ventures', type: 'Ventures Capital', tier: 'NotRated', logoUrl: '' },
        ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier1':
        return 'text-amber-400';
      case 'Tier2':
        return 'text-orange-400';
      case 'Tier3':
        return 'text-emerald-400';
      default:
        return 'text-secondary-text';
    }
  };

  const getTierLabel = (tier: string) => {
    if (tier === 'NotRated') return 'Not Rated';
    return tier.replace('Tier', 'Tier ');
  };

  return (
    <div className="border-b border-border p-4 md:border-b-0 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <Star className="h-6 w-6 text-primary-text" />
        <h2 className="text-lg font-semibold text-primary-text">Investors</h2>
      </div>

      <div className="space-y-4">
        {displayInvestors.map((investor, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-card">
                  {investor.logoUrl ? (
                    <Image
                      src={investor.logoUrl}
                      alt={investor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-secondary-text">
                      {investor.name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-[121px]">
                  <div className="text-sm text-primary-text">{investor.name}</div>
                  <div className="text-xs text-secondary-text">{investor.type}</div>
                </div>
              </div>
              <div className="rounded-full border border-border bg-card px-2 py-1">
                <span className={`text-xs font-medium ${getTierColor(investor.tier)}`}>
                  {getTierLabel(investor.tier)}
                </span>
              </div>
            </div>
            {index < displayInvestors.length - 1 && <div className="my-4 h-[1px] bg-border" />}
          </div>
        ))}
      </div>
    </div>
  );
}
