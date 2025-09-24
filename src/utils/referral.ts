/**
 * Utility functions for referral system
 */

/**
 * Generate a referral link with the given invite code
 */
export function generateReferralLink(inviteCode: string): string {
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://app.pretgemarket.xyz';

  return `${baseUrl}?ref=${encodeURIComponent(inviteCode)}`;
}

/**
 * Extract referral code from URL search parameters
 */
export function extractReferralCode(searchParams?: URLSearchParams | string): string | null {
  if (!searchParams) return null;

  if (typeof searchParams === 'string') {
    const params = new URLSearchParams(searchParams);
    return params.get('ref');
  }

  return searchParams.get('ref');
}

/**
 * Check if current URL has a referral code
 */
export function hasReferralCode(): boolean {
  if (typeof window === 'undefined') return false;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('ref');
}

/**
 * Clear referral code from current URL
 */
export function clearReferralCodeFromUrl(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('ref');
  window.history.replaceState({}, '', url.toString());
}

/**
 * Add referral code to a URL
 */
export function addReferralCodeToUrl(url: string, inviteCode: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set('ref', encodeURIComponent(inviteCode));
  return urlObj.toString();
}

/**
 * Validate invite code format (basic validation)
 */
export function isValidInviteCodeFormat(code: string): boolean {
  // Basic validation: should be alphanumeric and between 4-20 characters
  const codeRegex = /^[A-Z0-9]{4,20}$/;
  return codeRegex.test(code.toUpperCase());
}
