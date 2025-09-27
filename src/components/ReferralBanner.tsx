'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useReferralCode } from '@/hooks/useReferralCode';
import { cn } from '@/lib/utils';
import { clearReferralCodeFromUrl } from '@/utils/referral';
import { Gift, X } from 'lucide-react';
import { useEffect } from 'react';

interface ReferralBannerProps {
  className?: string;
}

export const ReferralBanner = ({ className }: ReferralBannerProps) => {
  const {
    hasReferralCode,
    referralCode,
    isValidating,
    isApplying,
    isValid,
    referrerInfo,
    error,
    canApply,
    hasExistingReferrer,
    applyReferralCode,
    dismissReferralCode,
  } = useReferralCode();

  // Clear referral code from URL when conditions are met (moved to useEffect to avoid render-time side effects)
  useEffect(() => {
    if (!hasReferralCode || hasExistingReferrer) {
      clearReferralCodeFromUrl();
    }
  }, [hasReferralCode, hasExistingReferrer]);

  // Don't show banner if no referral code or already has referrer
  if (!hasReferralCode || hasExistingReferrer) {
    return null;
  }

  // Show loading state
  if (isValidating) {
    return (
      <Card
        className={cn(
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
          className
        )}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex-shrink-0">
            <Gift className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-blue-900 dark:text-blue-100">
              Validating referral code: <strong>{referralCode}</strong>...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state only if there's an actual error
  if (error || !isValid) {
    return (
      <Card
        className={cn('border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950', className)}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <X className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <p className="text-red-900 dark:text-red-100">
              Invalid referral code: <strong>{referralCode}</strong>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissReferralCode}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show referral code banner
  if (referralCode) {
    return (
      <Card
        className={cn(
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  {referrerInfo?.referrer?.name
                    ? `You've been invited by ${referrerInfo.referrer.name}!`
                    : `Referral Code: ${referralCode}`}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {canApply
                    ? 'Click accept to get benefits!'
                    : 'Connect your wallet to accept this invitation'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canApply && (
                <Button
                  onClick={applyReferralCode}
                  disabled={isApplying}
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  {isApplying ? 'Applying...' : 'Accept'}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={dismissReferralCode}
                className="text-green-600 hover:text-green-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
