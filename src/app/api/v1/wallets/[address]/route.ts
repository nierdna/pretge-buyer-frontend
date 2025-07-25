import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/wallets/[address]
export async function GET(req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    // Validate address
    const { address } = await params;

    // Get wallet information (prioritize EVM, can be extended for other chains if needed)
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('address', address)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });
    }

    // Return wallet information
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        userId: data.user_id,
        chainType: data.chain_type,
        address: data.address,
        isPrimary: data.is_primary,
        createdAt: data.created_at,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
