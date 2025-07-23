import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let wallet_id = searchParams.get('wallet_id');
    let ex_token_id = searchParams.get('ex_token_id');
    const wallet_address = searchParams.get('wallet_address');
    const ex_token_address = searchParams.get('ex_token_address');
    const chain_type = searchParams.get('chain_type'); // optional, useful for wallet lookup

    // If wallet_id is not available, try to get it from address
    if (!wallet_id && wallet_address) {
      // If chain_type is provided, use it, otherwise get any wallet matching the address
      let walletQuery = supabase
        .from('wallets')
        .select('id')
        .ilike('address', `${wallet_address.toLowerCase()}`);
      if (chain_type) walletQuery = walletQuery.eq('chain_type', chain_type);
      const { data: walletData, error: walletError } = await walletQuery.single();
      if (walletError || !walletData) {
        return NextResponse.json(
          { success: false, message: 'Wallet not found with this address' },
          { status: 404 }
        );
      }
      wallet_id = walletData.id;
    }

    // If ex_token_id is not available, try to get it from address
    if (!ex_token_id && ex_token_address) {
      const { data: tokenData, error: tokenError } = await supabase
        .from('ex_tokens')
        .select('id')
        .ilike('address', `${ex_token_address.toLowerCase()}`)
        .single();
      if (tokenError || !tokenData) {
        return NextResponse.json(
          { success: false, message: 'Ex_token not found with this address' },
          { status: 404 }
        );
      }
      ex_token_id = tokenData.id;
    }

    if (!wallet_id || !ex_token_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'wallet_id and ex_token_id are required (or provide corresponding addresses)',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .select('balance, ex_token:ex_token_id(*)')
      .eq('wallet_id', wallet_id)
      .eq('ex_token_id', ex_token_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { success: false, message: 'No token in wallet' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ success: true, balance: 0, ex_token: null });
    }
    return NextResponse.json({ success: true, balance: data.balance, ex_token: data.ex_token });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
