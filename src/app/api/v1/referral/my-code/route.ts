import { supabase } from '@/server/db/supabase';
import { AuthenticatedRequest, withAuth } from '@/server/middleware/auth';
import { NextResponse } from 'next/server';

// Generate random 6-character alphanumeric code
function generateInviteCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Check if invite code already exists
async function isInviteCodeUnique(code: string): Promise<boolean> {
  const { data } = await supabase.from('users').select('id').eq('invite_code', code).single();

  return !data; // Returns true if no user found with this code
}

// Generate unique invite code
async function generateUniqueInviteCode(): Promise<string> {
  let code: string;
  let isUnique = false;

  do {
    code = generateInviteCode();
    isUnique = await isInviteCodeUnique(code);
  } while (!isUnique);

  return code;
}

async function getMyCodeHandler(req: AuthenticatedRequest) {
  try {
    const { user } = req;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get user with invite code
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, invite_code, referred_by_user_id')
      .eq('id', user.userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Generate invite code if user doesn't have one
    let inviteCode = userData.invite_code;
    if (!inviteCode) {
      try {
        inviteCode = await generateUniqueInviteCode();

        // Update user with new invite code
        const { error: updateError } = await supabase
          .from('users')
          .update({ invite_code: inviteCode })
          .eq('id', user.userId);

        if (updateError) {
          console.error('Error updating invite code:', updateError);
          return NextResponse.json(
            { success: false, message: 'Failed to generate invite code' },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error('Error generating invite code:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to generate invite code' },
          { status: 500 }
        );
      }
    }

    // Get referrer info separately if exists
    let referrerData = null;
    if (userData.referred_by_user_id) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id, name, invite_code')
        .eq('id', userData.referred_by_user_id)
        .single();

      if (referrer) {
        referrerData = referrer;
      }
    }

    // Get referral stats
    const { count: totalReferrals } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('referred_by_user_id', user.userId);

    const { data: referralRewards } = await supabase
      .from('referral_rewards')
      .select('points_earned')
      .eq('referrer_user_id', user.userId);

    const totalReferralPoints =
      referralRewards?.reduce((sum, reward) => sum + reward.points_earned, 0) || 0;

    // Get list of referred users (recent 10)
    const { data: referredUsers } = await supabase
      .from('users')
      .select('id, name, avatar, created_at')
      .eq('referred_by_user_id', user.userId)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        myInviteCode: inviteCode,
        referredBy: referrerData
          ? {
              id: referrerData.id,
              name: referrerData.name,
              inviteCode: referrerData.invite_code,
            }
          : null,
        stats: {
          totalReferrals: totalReferrals || 0,
          totalReferralPoints,
        },
        recentReferrals: referredUsers || [],
      },
      message: 'Referral data retrieved successfully',
    });
  } catch (error) {
    console.error('Get my referral code error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/v1/referral/my-code - Get current user's invite code and referral stats
export const GET = withAuth(getMyCodeHandler);
