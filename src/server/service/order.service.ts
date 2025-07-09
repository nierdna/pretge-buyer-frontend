import { supabase } from '../db/supabase';
import { Order } from '../types/order';

export class OrderService {
  // Get all orders with pagination
  static async getOrders(page = 1, limit = 10, status?: 'pending' | 'settled' | 'cancelled') {
    let query = supabase
      .from('orders')
      .select(
        `
        *,
        offers (
          *,
          tokens (*)
        )
      `
      )
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return {
      orders: data as Order[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get order by ID
  static async getOrderById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        offers (
          *,
          tokens (*)
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    return data as Order;
  }

  // Create new order
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        offer_id: orderData.offerId,
        buyer_wallet_id: orderData.buyerWalletId,
        amount: orderData.amount,
        status: orderData.status,
        tx_hash: orderData.txHash,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return data as Order;
  }

  // Update order
  static async updateOrder(
    id: string,
    updates: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const updateData: any = {};

    if (updates.offerId) updateData.offer_id = updates.offerId;
    if (updates.buyerWalletId) updateData.buyer_wallet_id = updates.buyerWalletId;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.status) updateData.status = updates.status;
    if (updates.txHash !== undefined) updateData.tx_hash = updates.txHash;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }

    return data as Order;
  }

  // Delete order
  static async deleteOrder(id: string) {
    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }

    return true;
  }

  // Get orders by buyer wallet
  static async getOrdersByBuyer(buyerWalletId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('orders')
      .select(
        `
        *,
        offers (
          *,
          tokens (*)
        )
      `
      )
      .eq('buyer_wallet_id', buyerWalletId)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch buyer orders: ${error.message}`);
    }

    return {
      orders: data as Order[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get orders by offer
  static async getOrdersByOffer(offerId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('orders')
      .select(
        `
        *,
        offers (
          *,
          tokens (*)
        )
      `
      )
      .eq('offer_id', offerId)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch offer orders: ${error.message}`);
    }

    return {
      orders: data as Order[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Settle order (mark as completed)
  static async settleOrder(id: string, txHash?: string) {
    const updateData: any = {
      status: 'settled',
      updated_at: new Date().toISOString(),
    };

    if (txHash) {
      updateData.tx_hash = txHash;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to settle order: ${error.message}`);
    }

    return data as Order;
  }

  // Cancel order
  static async cancelOrder(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }

    return data as Order;
  }

  // Get order statistics
  static async getOrderStats() {
    const { data, error } = await supabase.from('orders').select('status');

    if (error) {
      throw new Error(`Failed to fetch order stats: ${error.message}`);
    }

    const stats = {
      total: data.length,
      pending: data.filter((order) => order.status === 'pending').length,
      settled: data.filter((order) => order.status === 'settled').length,
      cancelled: data.filter((order) => order.status === 'cancelled').length,
    };

    return stats;
  }

  // Get orders by date range
  static async getOrdersByDateRange(startDate: Date, endDate: Date, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('orders')
      .select(
        `
        *,
        offers (
          *,
          tokens (*)
        )
      `
      )
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch orders by date range: ${error.message}`);
    }

    return {
      orders: data as Order[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
}
