'use client';

import { ReferralBanner } from '@/components/ReferralBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useReferralCode } from '@/hooks/useReferralCode';
import { addReferralCodeToUrl, generateReferralLink } from '@/utils/referral';
import { useState } from 'react';
import { toast } from 'sonner';

export default function TestReferralPage() {
  const [testCode, setTestCode] = useState('TEST123');
  const referralState = useReferralCode();

  const generateTestLink = () => {
    const link = generateReferralLink(testCode);
    navigator.clipboard.writeText(link);
    toast.success('Test referral link copied to clipboard!');
  };

  const visitWithTestCode = () => {
    const newUrl = addReferralCodeToUrl(window.location.origin, testCode);
    window.location.href = newUrl;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Referral System Test</h1>
          <p className="text-muted-foreground">
            Test the referral code functionality with real API calls.
          </p>
        </div>

        {/* Current Referral State */}
        <Card>
          <CardHeader>
            <CardTitle>Current Referral State</CardTitle>
            <CardDescription>Real-time state from the useReferralCode hook</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <div>
                <strong>Has Referral Code:</strong> {referralState.hasReferralCode ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Referral Code:</strong> {referralState.referralCode || 'None'}
              </div>
              <div>
                <strong>Is Valid:</strong> {referralState.isValid ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Is Validating:</strong> {referralState.isValidating ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Is Applying:</strong> {referralState.isApplying ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Can Apply:</strong> {referralState.canApply ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Has Existing Referrer:</strong>{' '}
                {referralState.hasExistingReferrer ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Error:</strong> {referralState.error || 'None'}
              </div>
            </div>

            {referralState.referrerInfo && (
              <div className="bg-muted mt-4 rounded-lg p-4">
                <h4 className="mb-2 font-semibold">Referrer Info:</h4>
                <pre className="overflow-auto text-xs">
                  {JSON.stringify(referralState.referrerInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referral Banner Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Banner</CardTitle>
            <CardDescription>
              This banner will show when there's a valid referral code in the URL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReferralBanner />
            {!referralState.hasReferralCode && (
              <p className="text-muted-foreground italic">
                No referral code detected. Add ?ref=CODE to the URL to see the banner.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Tools to test the referral functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                placeholder="Enter test referral code"
                className="max-w-xs"
              />
              <Button onClick={generateTestLink} variant="outline">
                Copy Test Link
              </Button>
              <Button onClick={visitWithTestCode}>Visit with Test Code</Button>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => referralState.applyReferralCode()}
                disabled={!referralState.canApply}
                className="mr-2"
              >
                Manually Apply Code
              </Button>
              <Button
                onClick={() => referralState.dismissReferralCode()}
                variant="outline"
                disabled={!referralState.hasReferralCode}
              >
                Dismiss Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints Used</CardTitle>
            <CardDescription>The referral system uses these API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <strong>Validate Code:</strong> GET /api/v1/referral/validate-code?code=CODE
              </div>
              <div>
                <strong>Set Referrer:</strong> POST /api/v1/referral/set-referrer
              </div>
              <div>
                <strong>My Code:</strong> GET /api/v1/referral/my-code
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>1. Generate Test Link:</strong> Enter a referral code and click "Copy Test
              Link" to copy a URL with the referral parameter.
            </div>
            <div>
              <strong>2. Visit with Code:</strong> Click "Visit with Test Code" to navigate to the
              current page with the referral code in the URL.
            </div>
            <div>
              <strong>3. Check Banner:</strong> When a valid referral code is detected, the
              ReferralBanner component will show referrer information.
            </div>
            <div>
              <strong>4. Connect Wallet:</strong> Connect your wallet to enable the "Accept
              Invitation" button.
            </div>
            <div>
              <strong>5. Apply Code:</strong> Click "Accept Invitation" to apply the referral code
              using the setReferrer API.
            </div>
            <div>
              <strong>6. Auto-clear:</strong> After successful application, the referral code will
              be automatically cleared from the URL.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
