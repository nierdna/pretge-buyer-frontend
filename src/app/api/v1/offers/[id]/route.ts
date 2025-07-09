import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/offers/[id] - Get offer detail by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Offer ID is required' },
        { status: 400 }
      );
    }

    // Get offer with related data
    const { data: offer, error } = await supabase
      .from('offers')
      .select(
        `
        *,
        tokens:token_id (*),
        seller_wallet:seller_wallet_id (*),
        ex_token:ex_token_id (*, network:network_id (*))
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ success: false, message: 'Offer not found' }, { status: 404 });
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch offer' },
        { status: 500 }
      );
    }

    if (!offer) {
      return NextResponse.json({ success: false, message: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: offer,
      message: 'Offer retrieved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
