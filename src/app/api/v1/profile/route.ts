import { NextResponse } from 'next/server';
import { supabase } from '../../../../server/db/supabase';
import { AuthenticatedRequest, withAuth } from '../../../../server/middleware/auth';

async function getProfileHandler(req: AuthenticatedRequest) {
  try {
    const { user } = req;
    console.log('user', user);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Get user profile from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get user's wallets from Supabase
    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.userId);

    if (walletsError) {
      console.error('Error fetching wallets:', walletsError);
    }

    // Transform user data to match frontend interface

    // Transform wallets data

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        wallets: wallets,
        currentWallet: {
          address: user.walletAddress,
          chainType: user.chainType,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

async function updateProfileHandler(req: AuthenticatedRequest) {
  try {
    const { user } = req;
    const body = await req.json();

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Validate required fields
    const { name, description, avatar } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (name.trim().length > 20) {
      return NextResponse.json(
        { success: false, message: 'Name must be 20 characters or less' },
        { status: 400 }
      );
    }

    // Optional validation for description and avatar_url
    if (
      description !== undefined &&
      (typeof description !== 'string' || description.length > 1000)
    ) {
      return NextResponse.json(
        { success: false, message: 'Description must be a string with maximum 1000 characters' },
        { status: 400 }
      );
    }

    if (avatar !== undefined && typeof avatar !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Avatar URL must be a string' },
        { status: 400 }
      );
    }

    // Update user profile in Supabase
    const updateData: any = {
      name: name.trim(),
      updated_at: new Date().toISOString(),
    };

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar.trim();
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export const GET = withAuth(getProfileHandler);
export const PUT = withAuth(updateProfileHandler);
