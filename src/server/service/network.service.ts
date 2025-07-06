import { supabase } from '../db/supabase';
import { ChainTypeString } from '../enums/chain';
import { Network } from '../types/network';

export class NetworkService {
  // Get all networks
  static async getNetworks() {
    const { data, error } = await supabase
      .from('networks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch networks: ${error.message}`);
    }

    // Map DB fields to camelCase
    return (data || []).map((n) => ({
      id: n.id,
      name: n.name,
      chainType: n.chain_type as ChainTypeString,
      rpcUrl: n.rpc_url,
      explorerUrl: n.explorer_url,
      createdAt: n.created_at,
    })) as Network[];
  }

  // Get network by ID
  static async getNetworkById(id: string) {
    const { data, error } = await supabase.from('networks').select('*').eq('id', id).single();

    if (error) {
      throw new Error(`Failed to fetch network: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      chainType: data.chain_type as ChainTypeString,
      rpcUrl: data.rpc_url,
      explorerUrl: data.explorer_url,
      createdAt: data.created_at,
    } as Network;
  }

  // Get networks by chain type
  static async getNetworksByChainType(chainType: ChainTypeString) {
    const { data, error } = await supabase
      .from('networks')
      .select('*')
      .eq('chain_type', chainType)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch networks by chain type: ${error.message}`);
    }

    return (data || []).map((n) => ({
      id: n.id,
      name: n.name,
      chainType: n.chain_type as ChainTypeString,
      rpcUrl: n.rpc_url,
      explorerUrl: n.explorer_url,
      createdAt: n.created_at,
    })) as Network[];
  }

  // Create new network
  static async createNetwork(networkData: Omit<Network, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('networks')
      .insert({
        name: networkData.name,
        chain_type: networkData.chainType,
        rpc_url: networkData.rpcUrl,
        explorer_url: networkData.explorerUrl,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create network: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      chainType: data.chain_type as ChainTypeString,
      rpcUrl: data.rpc_url,
      explorerUrl: data.explorer_url,
      createdAt: data.created_at,
    } as Network;
  }

  // Update network
  static async updateNetwork(id: string, updates: Partial<Omit<Network, 'id' | 'createdAt'>>) {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.chainType) updateData.chain_type = updates.chainType;
    if (updates.rpcUrl) updateData.rpc_url = updates.rpcUrl;
    if (updates.explorerUrl) updateData.explorer_url = updates.explorerUrl;

    const { data, error } = await supabase
      .from('networks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update network: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      chainType: data.chain_type as ChainTypeString,
      rpcUrl: data.rpc_url,
      explorerUrl: data.explorer_url,
      createdAt: data.created_at,
    } as Network;
  }

  // Delete network
  static async deleteNetwork(id: string) {
    const { error } = await supabase.from('networks').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete network: ${error.message}`);
    }

    return true;
  }
}
