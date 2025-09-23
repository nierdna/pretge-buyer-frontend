import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/referral/validate-code?code=ABC123 - Validate invite code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inviteCode = searchParams.get('code');

    if (!inviteCode) {
      return NextResponse.json(
        { success: false, message: 'Invite code is required' },
        { status: 400 }
      );
    }

    // Find user by invite code
    const { data: referrer, error } = await supabase
      .from('users')
      .select('id, name, invite_code, avatar')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (error || !referrer) {
      return NextResponse.json({ success: false, message: 'Invalid invite code' }, { status: 404 });
    }

    // Get referrer stats
    const { count: totalReferrals } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('referred_by_user_id', referrer.id);

    const { data: referralRewards } = await supabase
      .from('referral_rewards')
      .select('points_earned')
      .eq('referrer_user_id', referrer.id);

    const totalReferralPoints =
      referralRewards?.reduce((sum, reward) => sum + reward.points_earned, 0) || 0;

    return NextResponse.json({
      success: true,
      data: {
        referrer: {
          id: referrer.id,
          name: referrer.name,
          avatar: referrer.avatar,
          inviteCode: referrer.invite_code,
        },
        stats: {
          totalReferrals: totalReferrals || 0,
          totalReferralPoints,
        },
      },
      message: 'Valid invite code',
    });
  } catch (error) {
    console.error('Validate invite code error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
