import { supabase } from '../db/supabase';
import { Offer } from '../types/offer';
import { Token } from '../types/token';

export class TokenService {
  // Get all tokens with pagination
  static async getTokens(
    page = 1,
    limit = 10,
    status?: 'draft' | 'active' | 'ended' | 'cancelled'
  ) {
    let query = supabase
      .from('tokens')
      .select('*')
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch tokens: ${error.message}`);
    }

    return {
      tokens: data as Token[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get token by ID
  static async getTokenById(id: string) {
    const { data, error } = await supabase.from('tokens').select('*').eq('id', id).single();

    if (error) {
      throw new Error(`Failed to fetch token: ${error.message}`);
    }

    return data as Token;
  }

  // Create new token
  static async createToken(tokenData: Omit<Token, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('tokens')
      .insert({
        name: tokenData.name,
        symbol: tokenData.symbol,
        logo: tokenData.logo,
        token_contract: tokenData.tokenContract,
        network_id: tokenData.networkId,
        start_time: tokenData.startTime.toISOString(),
        end_time: tokenData.endTime.toISOString(),
        status: tokenData.status,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create token: ${error.message}`);
    }

    return data as Token;
  }

  // Update token
  static async updateToken(
    id: string,
    updates: Partial<Omit<Token, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.symbol) updateData.symbol = updates.symbol;
    if (updates.logo) updateData.logo = updates.logo;
    if (updates.tokenContract) updateData.token_contract = updates.tokenContract;
    if (updates.networkId) updateData.network_id = updates.networkId;
    if (updates.startTime) updateData.start_time = updates.startTime.toISOString();
    if (updates.endTime) updateData.end_time = updates.endTime.toISOString();
    if (updates.status) updateData.status = updates.status;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('tokens')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update token: ${error.message}`);
    }

    return data as Token;
  }

  // Delete token
  static async deleteToken(id: string) {
    const { error } = await supabase.from('tokens').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete token: ${error.message}`);
    }

    return true;
  }

  // Search tokens by name or symbol
  static async searchTokens(query: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('tokens')
      .select('*')
      .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search tokens: ${error.message}`);
    }

    return {
      tokens: data as Token[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get active tokens
  static async getActiveTokens(page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('tokens')
      .select('*')
      .eq('status', 'active')
      .gte('end_time', new Date().toISOString())
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active tokens: ${error.message}`);
    }

    return {
      tokens: data as Token[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
}

export class OfferService {
  // Get all offers with pagination
  static async getOffers(page = 1, limit = 10, status?: 'open' | 'closed') {
    let query = supabase
      .from('offers')
      .select('*')
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
      offers: data as Offer[],
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

    return data as Offer;
  }

  // Create new offer
  static async createOffer(offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('offers')
      .insert({
        token_id: offerData.tokenId,
        seller_wallet_id: offerData.sellerWalletId,
        price: offerData.price,
        quantity: offerData.quantity,
        filled: offerData.filled || 0,
        status: offerData.status,
        start_time: offerData.startTime.toISOString(),
        end_time: offerData.endTime.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create offer: ${error.message}`);
    }

    return data as Offer;
  }

  // Update offer
  static async updateOffer(
    id: string,
    updates: Partial<Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const updateData: any = {};

    if (updates.tokenId) updateData.token_id = updates.tokenId;
    if (updates.sellerWalletId) updateData.seller_wallet_id = updates.sellerWalletId;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.filled !== undefined) updateData.filled = updates.filled;
    if (updates.status) updateData.status = updates.status;
    if (updates.startTime) updateData.start_time = updates.startTime.toISOString();
    if (updates.endTime) updateData.end_time = updates.endTime.toISOString();

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

    return data as Offer;
  }

  // Delete offer
  static async deleteOffer(id: string) {
    const { error } = await supabase.from('offers').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete offer: ${error.message}`);
    }

    return true;
  }

  // Get offers by token ID
  static async getOffersByToken(tokenId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('offers')
      .select('*')
      .eq('token_id', tokenId)
      .eq('status', 'open')
      .range((page - 1) * limit, page * limit - 1)
      .order('price', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch offers by token: ${error.message}`);
    }

    return {
      offers: data as Offer[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get offers by seller wallet
  static async getOffersBySeller(sellerWalletId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('offers')
      .select('*')
      .eq('seller_wallet_id', sellerWalletId)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch offers by seller: ${error.message}`);
    }

    return {
      offers: data as Offer[],
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

    return data as Offer;
  }
}
