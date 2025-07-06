import { UserService } from '@/server/service/user.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'active' | 'banned' | 'pending' | undefined;
    const search = searchParams.get('search');

    if (search) {
      const result = await UserService.searchSellers(search, page, limit);
      return NextResponse.json(result);
    }

    const result = await UserService.getSellers(page, limit, status);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const sellerData = {
      name: body.name,
      avatar: body.avatar || '',
      banner: body.banner || '',
      description: body.description || '',
      socialMedia: body.socialMedia || {
        twitter: '',
        telegram: '',
        discord: '',
        instagram: '',
        facebook: '',
        youtube: '',
      },
      kycStatus: body.kycStatus || 'pending',
      status: body.status || 'pending',
    };

    const seller = await UserService.createSeller(sellerData);
    return NextResponse.json(seller, { status: 201 });
  } catch (error) {
    console.error('Error creating seller:', error);
    return NextResponse.json({ error: 'Failed to create seller' }, { status: 500 });
  }
}
