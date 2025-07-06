import { supabase } from '../db/supabase';
import { ChainType } from '../enums/chain';
import { Seller } from '../types/user';
import { Wallet } from '../types/wallet';

export class UserService {
  // Get all sellers with pagination
  static async getSellers(page = 1, limit = 10, status?: 'active' | 'banned' | 'pending') {
    let query = supabase
      .from('users')
      .select('*')
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch sellers: ${error.message}`);
    }

    return {
      sellers: data as Seller[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get seller by ID
  static async getSellerById(id: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

    if (error) {
      throw new Error(`Failed to fetch seller: ${error.message}`);
    }

    return data as Seller;
  }

  // Create new seller
  static async createSeller(
    sellerData: Omit<Seller, 'id' | 'createdAt' | 'updatedAt' | 'wallets'>
  ) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: sellerData.name,
        avatar: sellerData.avatar,
        banner: sellerData.banner,
        description: sellerData.description,
        social_media: sellerData.socialMedia,
        kyc_status: sellerData.kycStatus,
        status: sellerData.status,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create seller: ${error.message}`);
    }

    return data as Seller;
  }

  // Update seller
  static async updateSeller(
    id: string,
    updates: Partial<Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        avatar: updates.avatar,
        banner: updates.banner,
        description: updates.description,
        social_media: updates.socialMedia,
        kyc_status: updates.kycStatus,
        status: updates.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update seller: ${error.message}`);
    }

    return data as Seller;
  }

  // Delete seller
  static async deleteSeller(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete seller: ${error.message}`);
    }

    return true;
  }

  // Get seller wallets
  static async getSellerWallets(sellerId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch seller wallets: ${error.message}`);
    }

    return data as Wallet[];
  }

  // Add wallet to seller
  static async addWallet(walletData: Omit<Wallet, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('wallets')
      .insert({
        user_id: walletData.userId,
        chain_type: walletData.chainType,
        address: walletData.address,
        is_primary: walletData.isPrimary || false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add wallet: ${error.message}`);
    }

    return data as Wallet;
  }

  // Update wallet
  static async updateWallet(id: string, updates: Partial<Omit<Wallet, 'id' | 'createdAt'>>) {
    const { data, error } = await supabase
      .from('wallets')
      .update({
        user_id: updates.userId,
        chain_type: updates.chainType,
        address: updates.address,
        is_primary: updates.isPrimary,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update wallet: ${error.message}`);
    }

    return data as Wallet;
  }

  // Delete wallet
  static async deleteWallet(id: string) {
    const { error } = await supabase.from('wallets').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete wallet: ${error.message}`);
    }

    return true;
  }

  // Search sellers by name
  static async searchSellers(query: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('users')
      .select('*')
      .ilike('name', `%${query}%`)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search sellers: ${error.message}`);
    }

    return {
      sellers: data as Seller[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get wallets by chain type
  static async getWalletsByChainType(userId: string, chainType: ChainType) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('chain_type', chainType)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch wallets by chain type: ${error.message}`);
    }

    return data as Wallet[];
  }

  // Get primary wallet
  static async getPrimaryWallet(userId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (error) {
      throw new Error(`Failed to fetch primary wallet: ${error.message}`);
    }

    return data as Wallet;
  }
}
