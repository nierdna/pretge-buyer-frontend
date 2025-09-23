import { supabase } from '@/server/db/supabase';
import { AuthenticatedRequest, withAuth } from '@/server/middleware/auth';
import { NextResponse } from 'next/server';

async function getReferralRewardsHandler(req: AuthenticatedRequest) {
  try {
    const { user } = req;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortField = searchParams.get('sortField') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, message: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Get user's wallet address to find referral rewards
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('id, user_id')
      .eq('address', user.walletAddress)
      .eq('chain_type', user.chainType)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('referral_rewards')
      .select('*', { count: 'exact' })
      .eq('referrer_user_id', wallet.user_id);

    if (countError) {
      console.error('Error counting referral rewards:', countError);
      return NextResponse.json(
        { success: false, message: 'Failed to count referral rewards' },
        { status: 500 }
      );
    }

    // Get referral rewards with user and quest details
    const { data: rewards, error: rewardsError } = await supabase
      .from('referral_rewards')
      .select(
        `
        id,
        points_earned,
        percent_bps,
        created_at,
        referred_user:users!referred_user_id(
          id,
          name,
          avatar
        ),
        quest:quests(
          id,
          code,
          title,
          type,
          points
        )
      `
      )
      .eq('referrer_user_id', wallet.user_id)
      .order(sortField, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (rewardsError) {
      console.error('Error fetching referral rewards:', rewardsError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch referral rewards' },
        { status: 500 }
      );
    }

    // Calculate pagination
    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      success: true,
      data: rewards || [],
      pagination: {
        total: totalCount || 0,
        page,
        limit,
        totalPages,
      },
      message: 'Referral rewards retrieved successfully',
    });
  } catch (error) {
    console.error('Get referral rewards error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/v1/referral/rewards - Get referral rewards list for authenticated user
export const GET = withAuth(getReferralRewardsHandler);
