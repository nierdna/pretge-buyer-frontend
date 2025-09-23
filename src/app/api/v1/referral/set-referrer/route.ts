import { supabase } from '@/server/db/supabase';
import { AuthenticatedRequest, withAuth } from '@/server/middleware/auth';
import { NextResponse } from 'next/server';

async function setReferrerHandler(req: AuthenticatedRequest) {
  try {
    const { user } = req;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { inviteCode } = body;

    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invite code is required' },
        { status: 400 }
      );
    }

    // Check if user already has a referrer
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('id, referred_by_user_id')
      .eq('id', user.userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    if (currentUser.referred_by_user_id) {
      return NextResponse.json(
        { success: false, message: 'You already have a referrer set' },
        { status: 400 }
      );
    }

    // Find referrer by invite code
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id, invite_code')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json({ success: false, message: 'Invalid invite code' }, { status: 400 });
    }

    // Check if user is trying to refer themselves
    if (referrer.id === user.userId) {
      return NextResponse.json(
        { success: false, message: 'You cannot refer yourself' },
        { status: 400 }
      );
    }

    // Update user with referrer
    const { error: updateError } = await supabase
      .from('users')
      .update({ referred_by_user_id: referrer.id })
      .eq('id', user.userId);

    if (updateError) {
      console.error('Error updating user referrer:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to set referrer' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        referrerId: referrer.id,
        inviteCode: referrer.invite_code,
      },
      message: 'Referrer set successfully',
    });
  } catch (error) {
    console.error('Set referrer error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/v1/referral/set-referrer - Set referrer for current user
export const POST = withAuth(setReferrerHandler);
