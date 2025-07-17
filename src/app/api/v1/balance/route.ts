import { NextResponse } from 'next/server';
import { supabase } from '../../../../server/db/supabase';
import { AuthenticatedRequest, withAuth } from '../../../../server/middleware/auth';

async function getBalanceHandler(req: AuthenticatedRequest) {
  try {
    const { user } = req;

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Get wallet ID from the address in JWT
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('id')
      .eq('address', user.walletAddress)
      .eq('chain_type', user.chainType)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });
    }

    // Get non-zero balances from wallet_ex_tokens
    const { data: balances, error: balancesError } = await supabase
      .from('wallet_ex_tokens')
      .select(
        `
        id,
        balance,
        ex_token_id,
        ex_tokens ( * )
      `
      )
      .eq('wallet_id', wallet.id)
      .gt('balance', 0)
      .order('balance', { ascending: false });

    if (balancesError) {
      console.error('Error fetching balances:', balancesError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch balances' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        walletId: wallet.id,
        walletAddress: user.walletAddress,
        chainType: user.chainType,
        balances: balances || [],
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export const GET = withAuth(getBalanceHandler);
