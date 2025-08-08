import { supabase } from '@/server/db/supabase';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { promotion_id, address } = body;

  const { data: promotion, error: promotionError } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', promotion_id)
    .single();

  if (promotionError) {
    return NextResponse.json({ success: false, message: promotionError.message }, { status: 500 });
  }

  if (!promotion) {
    return NextResponse.json({ success: false, message: 'Promotion not found' }, { status: 404 });
  }

  if (promotion.check_type === 'test') {
    return NextResponse.json({ success: true, message: 'Promotion found', data: true });
  }

  // Get the host from request URL
  const host = request.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  // Create axios instance with base URL
  const axiosInstance = axios.create({
    baseURL: `${protocol}://${host}`,
  });

  // Call the mock API using axios
  const { data } = await axiosInstance.post('/api/promotion-mock', {
    address,
  });

  return NextResponse.json({
    message: 'Hello, world!',
    success: true,
    data: data.data,
  });
}
