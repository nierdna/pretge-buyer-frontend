import { supabase } from '@/server/db/supabase';
import { NextResponse } from 'next/server';

interface Promotion {
  id: string;
  offer_id: string;
  is_active: boolean;
  discount_percent: number;
  check_type: string;
  check_eligible_url: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
}

interface Offer {
  id: string;
  [key: string]: any; // other offer fields
}

export async function GET() {
  try {
    // Get active promotions
    const { data: promotions, error: promotionsError } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true);

    if (promotionsError) {
      throw promotionsError;
    }

    // Extract and get unique offerIds from promotions
    const offerIds = [...new Set((promotions as Promotion[]).flatMap((promo) => promo.offer_id))];

    if (offerIds.length === 0) {
      return NextResponse.json({
        data: [],
        message: 'No active promotions found',
      });
    }

    // Get offers based on offerIds
    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select(
        `
        *,
        tokens:token_id (*),
        seller_wallet: seller_wallet_id (*, user:user_id (*)),
        ex_token:ex_token_id (*, network:network_id (*))
      `
      )
      .in('id', offerIds);
    // .eq('status', 'open');

    if (offersError) {
      throw offersError;
    }

    // Map promotion info to offers
    const offersWithPromotion = (offers as Offer[]).map((offer) => {
      const relatedPromotions = (promotions as Promotion[])
        .filter((promo) => promo.offer_id === offer.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return {
        ...offer,
        promotion: relatedPromotions[0] || null, // Get the first (most recent) promotion or null if none exists
      };
    });

    return NextResponse.json({
      data: offersWithPromotion,
      message: 'Get flash sale offers successfully',
    });
  } catch (error) {
    console.error('Error getting flash sale offers:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
