'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReferralTierInfo() {
  return (
    <Card className="bg-card border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="text-blue-400">🎁</div>
          <CardTitle className="text-gray-900">Referral Rewards</CardTitle>
        </div>
        <p className="text-sm text-content">
          Earn rewards by inviting friends to join our platform. Both you and your friends will
          benefit from our referral program.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Referrer Reward */}
          <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">💰</span>
              <h3 className="font-medium text-gray-900">For You (Referrer)</h3>
            </div>
            <p className="mb-1 text-sm text-content">
              Receive <span className="font-semibold text-blue-600">10% of trading fees</span> from
              your referred friends
            </p>
          </div>

          {/* Referee Reward */}
          <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <h3 className="font-medium text-gray-900">For Your Friend (Referee)</h3>
            </div>
            <p className="mb-1 text-sm text-content">
              Your friend receives{' '}
              <span className="font-semibold text-green-600">10% bonus points</span> on their
              activities
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-yellow-600">ℹ️</span>
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">How it works:</span> When someone uses your referral
                code and makes trades, you automatically earn 10% of their trading fees, while they
                get 10% bonus points on their account.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
