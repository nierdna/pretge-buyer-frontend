import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Search in tokens table for symbol only
    const { data: tokens, error: tokenError } = await supabase
      .from('tokens')
      .select('id, symbol, name, logo, networks:network_id(name)')
      .ilike('symbol', `%${query}%`)
      .limit(limit);

    if (tokenError) {
      console.error('Error fetching token suggestions:', tokenError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch suggestions' },
        { status: 500 }
      );
    }

    // Format suggestions
    const suggestions = (tokens || []).map((token: any) => ({
      id: token.id,
      type: 'token',
      symbol: token.symbol,
      name: token.name,
      logo: token.logo,
      network: token.networks?.name,
      displayText: `${token.symbol} - ${token.name}`,
    }));

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Error in search suggestions API:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
