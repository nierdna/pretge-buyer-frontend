import { supabase } from '../db/supabase';
import { ChainTypeString } from '../enums/chain';
import { ExToken } from '../types/exToken';
import { WalletExToken } from '../types/walletExToken';

function mapExToken(row: any): ExToken {
  return {
    id: row.id,
    name: row.name,
    symbol: row.symbol,
    logo: row.logo ?? null,
    address: row.address,
    networkId: row.network_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ExTokenService {
  // Get all external tokens with pagination
  static async getExTokens(page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('ex_tokens')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch external tokens: ${error.message}`);
    }

    return {
      exTokens: (data || []).map(mapExToken),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get external token by ID
  static async getExTokenById(id: string) {
    const { data, error } = await supabase.from('ex_tokens').select('*').eq('id', id).single();

    if (error) {
      throw new Error(`Failed to fetch external token: ${error.message}`);
    }

    return mapExToken(data);
  }

  // Create new external token
  static async createExToken(exTokenData: Omit<ExToken, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('ex_tokens')
      .insert({
        name: exTokenData.name,
        symbol: exTokenData.symbol,
        logo: exTokenData.logo ?? null,
        address: exTokenData.address,
        network_id: exTokenData.networkId ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create external token: ${error.message}`);
    }

    return mapExToken(data);
  }

  // Update external token
  static async updateExToken(
    id: string,
    updates: Partial<Omit<ExToken, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.symbol !== undefined) updateData.symbol = updates.symbol;
    if (updates.logo !== undefined) updateData.logo = updates.logo;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.networkId !== undefined) updateData.network_id = updates.networkId;

    const { data, error } = await supabase
      .from('ex_tokens')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update external token: ${error.message}`);
    }

    return mapExToken(data);
  }

  // Delete external token
  static async deleteExToken(id: string) {
    const { error } = await supabase.from('ex_tokens').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete external token: ${error.message}`);
    }

    return true;
  }

  // Get external tokens by network
  static async getExTokensByNetwork(networkId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('ex_tokens')
      .select('*', { count: 'exact' })
      .eq('network_id', networkId)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch external tokens by network: ${error.message}`);
    }

    return {
      exTokens: (data || []).map(mapExToken),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Search external tokens by name or symbol
  static async searchExTokens(query: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('ex_tokens')
      .select('*', { count: 'exact' })
      .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search external tokens: ${error.message}`);
    }

    return {
      exTokens: (data || []).map(mapExToken),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
}

function mapWalletExToken(row: any): WalletExToken {
  return {
    id: row.id,
    chainType: row.chain_type as ChainTypeString,
    address: row.address,
    walletId: row.wallet_id,
    exTokenId: row.ex_token_id,
    balance: row.balance,
    createdAt: row.created_at,
  };
}

export class WalletExTokenService {
  // Get wallet external tokens by wallet ID
  static async getWalletExTokens(walletId: string) {
    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch wallet external tokens: ${error.message}`);
    }

    return (data || []).map(mapWalletExToken);
  }

  // Get wallet external token by ID
  static async getWalletExTokenById(id: string) {
    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch wallet external token: ${error.message}`);
    }

    return mapWalletExToken(data);
  }

  // Create new wallet external token
  static async createWalletExToken(walletExTokenData: Omit<WalletExToken, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .insert({
        chain_type: walletExTokenData.chainType,
        address: walletExTokenData.address,
        wallet_id: walletExTokenData.walletId,
        ex_token_id: walletExTokenData.exTokenId,
        balance: walletExTokenData.balance,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create wallet external token: ${error.message}`);
    }

    return mapWalletExToken(data);
  }

  // Update wallet external token
  static async updateWalletExToken(
    id: string,
    updates: Partial<Omit<WalletExToken, 'id' | 'createdAt'>>
  ) {
    const updateData: any = {};
    if (updates.chainType !== undefined) updateData.chain_type = updates.chainType;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.walletId !== undefined) updateData.wallet_id = updates.walletId;
    if (updates.exTokenId !== undefined) updateData.ex_token_id = updates.exTokenId;
    if (updates.balance !== undefined) updateData.balance = updates.balance;

    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update wallet external token: ${error.message}`);
    }

    return mapWalletExToken(data);
  }

  // Delete wallet external token
  static async deleteWalletExToken(id: string) {
    const { error } = await supabase.from('wallet_ex_tokens').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete wallet external token: ${error.message}`);
    }

    return true;
  }

  // Update wallet external token balance
  static async updateBalance(id: string, balance: number) {
    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .update({ balance })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update balance: ${error.message}`);
    }

    return mapWalletExToken(data);
  }

  // Get wallet external tokens by chain type
  static async getWalletExTokensByChainType(walletId: string, chainType: ChainTypeString) {
    const { data, error } = await supabase
      .from('wallet_ex_tokens')
      .select('*')
      .eq('wallet_id', walletId)
      .eq('chain_type', chainType)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch wallet external tokens by chain type: ${error.message}`);
    }

    return (data || []).map(mapWalletExToken);
  }
}
