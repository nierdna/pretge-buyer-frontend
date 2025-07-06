import { supabase } from '../db/supabase';
import { Offer } from '../types/offer';

function mapOffer(row: any): Offer {
  return {
    id: row.id,
    tokenId: row.token_id ?? null,
    sellerWalletId: row.seller_wallet_id ?? null,
    price: row.price,
    quantity: row.quantity,
    filled: row.filled,
    status: row.status,
    startTime: row.start_time,
    endTime: row.end_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class OfferService {
  // Get all offers with pagination
  static async getOffers(page = 1, limit = 10, status?: 'open' | 'closed') {
    let query = supabase
      .from('offers')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch offers: ${error.message}`);
    }

    return {
      offers: (data || []).map(mapOffer),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get offer by ID
  static async getOfferById(id: string) {
    const { data, error } = await supabase.from('offers').select('*').eq('id', id).single();

    if (error) {
      throw new Error(`Failed to fetch offer: ${error.message}`);
    }

    return mapOffer(data);
  }

  // Create new offer
  static async createOffer(offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('offers')
      .insert({
        token_id: offerData.tokenId ?? null,
        seller_wallet_id: offerData.sellerWalletId ?? null,
        price: offerData.price,
        quantity: offerData.quantity,
        filled: offerData.filled ?? 0,
        status: offerData.status ?? 'open',
        start_time: offerData.startTime,
        end_time: offerData.endTime,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create offer: ${error.message}`);
    }

    return mapOffer(data);
  }

  // Update offer
  static async updateOffer(
    id: string,
    updates: Partial<Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const updateData: any = {};
    if (updates.tokenId !== undefined) updateData.token_id = updates.tokenId;
    if (updates.sellerWalletId !== undefined) updateData.seller_wallet_id = updates.sellerWalletId;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.filled !== undefined) updateData.filled = updates.filled;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
    if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update offer: ${error.message}`);
    }

    return mapOffer(data);
  }

  // Delete offer
  static async deleteOffer(id: string) {
    const { error } = await supabase.from('offers').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete offer: ${error.message}`);
    }

    return true;
  }

  // Get offers by token
  static async getOffersByToken(tokenId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('offers')
      .select('*', { count: 'exact' })
      .eq('token_id', tokenId)
      .eq('status', 'open')
      .range((page - 1) * limit, page * limit - 1)
      .order('price', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch token offers: ${error.message}`);
    }

    return {
      offers: (data || []).map(mapOffer),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get offers by seller wallet
  static async getOffersBySellerWallet(sellerWalletId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('offers')
      .select('*', { count: 'exact' })
      .eq('seller_wallet_id', sellerWalletId)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch seller offers: ${error.message}`);
    }

    return {
      offers: (data || []).map(mapOffer),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Close offer
  static async closeOffer(id: string) {
    const { data, error } = await supabase
      .from('offers')
      .update({
        status: 'closed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to close offer: ${error.message}`);
    }

    return mapOffer(data);
  }

  // Update filled amount
  static async updateFilledAmount(id: string, filledAmount: number) {
    const { data, error } = await supabase
      .from('offers')
      .update({
        filled: filledAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update filled amount: ${error.message}`);
    }

    return mapOffer(data);
  }

  // Get active offers
  static async getActiveOffers(page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('offers')
      .select('*', { count: 'exact' })
      .eq('status', 'open')
      .gte('end_time', new Date().toISOString())
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active offers: ${error.message}`);
    }

    return {
      offers: (data || []).map(mapOffer),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get offers by date range
  static async getOffersByDateRange(startDate: string, endDate: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('offers')
      .select('*', { count: 'exact' })
      .gte('start_time', startDate)
      .lte('end_time', endDate)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch offers by date range: ${error.message}`);
    }

    return {
      offers: (data || []).map(mapOffer),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get offer statistics
  static async getOfferStats() {
    const { data, error } = await supabase.from('offers').select('status, price, quantity, filled');

    if (error) {
      throw new Error(`Failed to fetch offer stats: ${error.message}`);
    }

    const totalOffers = data.length;
    const openOffers = data.filter((offer) => offer.status === 'open').length;
    const closedOffers = data.filter((offer) => offer.status === 'closed').length;
    const totalVolume = data.reduce((sum, offer) => sum + offer.price * offer.quantity, 0);
    const totalFilled = data.reduce((sum, offer) => sum + offer.filled, 0);

    return {
      totalOffers,
      openOffers,
      closedOffers,
      totalVolume,
      totalFilled,
      fillRate: totalVolume > 0 ? (totalFilled / totalVolume) * 100 : 0,
    };
  }
}
