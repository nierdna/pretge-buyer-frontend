'use client';

import { useSetReferrer, useValidateInviteCode } from '@/queries/useReferralQueries';
import { useAuthStore } from '@/store/authStore';
import { clearReferralCodeFromUrl } from '@/utils/referral';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ReferralCodeState {
  referralCode: string | null;
  isValidating: boolean;
  isApplying: boolean;
  isValid: boolean;
  referrerInfo: any;
  error: string | null;
  hasAttemptedApplication: boolean;
}

export const useReferralCode = () => {
  const searchParams = useSearchParams();
  const { user, accessToken } = useAuthStore();

  const [state, setState] = useState<ReferralCodeState>({
    referralCode: null,
    isValidating: false,
    isApplying: false,
    isValid: false,
    referrerInfo: null,
    error: null,
    hasAttemptedApplication: false,
  });

  // Extract referral code from URL
  const referralCode = searchParams?.get('ref');

  // Validate referral code
  const {
    data: validationData,
    isLoading: isValidating,
    error: validationError,
  } = useValidateInviteCode(referralCode);

  // Set referrer mutation
  const setReferrerMutation = useSetReferrer();

  // Update state when referral code changes
  useEffect(() => {
    if (referralCode !== state.referralCode) {
      setState((prev) => ({
        ...prev,
        referralCode,
        isValid: false,
        referrerInfo: null,
        error: null,
        hasAttemptedApplication: false,
      }));
    }
  }, [referralCode, state.referralCode]);

  // Update validation state
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isValidating,
      isValid: !!(validationData?.success && validationData?.data),
      referrerInfo: validationData?.data || null,
      error: validationError ? 'Invalid referral code' : null,
    }));
  }, [validationData, isValidating, validationError]);

  // Auto-apply referral code when user is logged in and has referral code
  useEffect(() => {
    if (
      user &&
      accessToken &&
      referralCode &&
      !state.hasAttemptedApplication &&
      !user.referredByUserId // Only if user doesn't already have a referrer
    ) {
      applyReferralCode();
    }
  }, [user, accessToken, referralCode, state.hasAttemptedApplication]);

  const applyReferralCode = useCallback(async () => {
    if (!referralCode) {
      toast.error('No referral code to apply');
      return;
    }

    if (user?.referredByUserId) {
      toast.info('You already have a referrer');
      return;
    }

    setState((prev) => ({ ...prev, isApplying: true, hasAttemptedApplication: true }));

    try {
      await setReferrerMutation.mutateAsync(referralCode);

      setState((prev) => ({ ...prev, isApplying: false }));

      const referrerName = validationData?.data?.referrer?.name || 'the referrer';
      toast.success(`Successfully applied referral code from ${referrerName}!`);

      // Clear referral code from URL after successful application
      clearReferralCodeFromUrl();
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isApplying: false,
        error: error?.response?.data?.message || 'Failed to apply referral code',
      }));

      toast.error(error?.response?.data?.message || 'Failed to apply referral code');
    }
  }, [referralCode, validationData, user, setReferrerMutation]);

  const manualApplyReferralCode = useCallback(async () => {
    if (!user || !accessToken) {
      toast.error('Please connect your wallet first');
      return;
    }

    await applyReferralCode();
  }, [user, accessToken, applyReferralCode]);

  const dismissReferralCode = useCallback(() => {
    // Clear referral code from URL
    clearReferralCodeFromUrl();

    setState((prev) => ({
      ...prev,
      referralCode: null,
      isValid: false,
      referrerInfo: null,
      error: null,
      hasAttemptedApplication: true,
    }));
  }, []);

  return {
    // State
    referralCode,
    isValidating: state.isValidating,
    isApplying: state.isApplying,
    isValid: state.isValid,
    referrerInfo: state.referrerInfo,
    error: state.error,
    hasReferralCode: !!referralCode,
    canApply: !!(user && accessToken && referralCode && !user?.referredByUserId),
    hasExistingReferrer: !!user?.referredByUserId,

    // Actions
    applyReferralCode: manualApplyReferralCode,
    dismissReferralCode,
  };
};
