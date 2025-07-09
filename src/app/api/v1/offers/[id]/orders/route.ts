import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    // Validate offer ID parameter
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Offer ID is required' },
        { status: 400 }
      );
    }

    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') as 'pending' | 'settled' | 'cancelled' | undefined;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, message: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Validate status parameter if provided
    if (status && !['pending', 'settled', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status parameter' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('orders')
      .select(
        `
        *,
        offers (
          *,
          tokens (*)
        )
      `,
        { count: 'exact' }
      )
      .eq('offer_id', id)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      message: 'Orders retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error fetching orders by offer:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
