import { supabase } from '@/server/db/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/users/[id] - Get user by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || id.trim() === '') {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Get user by ID using Supabase directly
    const { data: user, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(
        { success: false, message: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Get all wallets for the user
    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', id);
    if (walletsError) {
      console.error('Error fetching wallets:', walletsError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch wallets' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...user, wallet: wallets || [] },
      message: 'User retrieved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
