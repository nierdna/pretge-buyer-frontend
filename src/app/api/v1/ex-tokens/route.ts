import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/server/db/supabase';

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.from('ex_tokens').select('*, network:network_id (*)');
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
