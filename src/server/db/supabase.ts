import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/configs/env';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = SUPABASE_URL || '';
const supabaseAnonKey = SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our updated schema
export interface Database {
  public: {
    Tables: {
      networks: {
        Row: {
          id: string;
          name: string;
          chain_type: 'evm' | 'sol' | 'sui';
          rpc_url: string;
          explorer_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          chain_type: 'evm' | 'sol' | 'sui';
          rpc_url: string;
          explorer_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          chain_type?: 'evm' | 'sol' | 'sui';
          rpc_url?: string;
          explorer_url?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          avatar: string | null;
          banner: string | null;
          description: string | null;
          social_media: {
            twitter: string;
            telegram: string;
            discord: string;
            instagram: string;
            facebook: string;
            youtube: string;
          };
          kyc_status: 'pending' | 'verified' | 'rejected';
          status: 'active' | 'banned' | 'pending';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar?: string | null;
          banner?: string | null;
          description?: string | null;
          social_media?: {
            twitter: string;
            telegram: string;
            discord: string;
            instagram: string;
            facebook: string;
            youtube: string;
          };
          kyc_status?: 'pending' | 'verified' | 'rejected';
          status?: 'active' | 'banned' | 'pending';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar?: string | null;
          banner?: string | null;
          description?: string | null;
          social_media?: {
            twitter: string;
            telegram: string;
            discord: string;
            instagram: string;
            facebook: string;
            youtube: string;
          };
          kyc_status?: 'pending' | 'verified' | 'rejected';
          status?: 'active' | 'banned' | 'pending';
          created_at?: string;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string | null;
          chain_type: 'evm' | 'sol' | 'sui';
          address: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          chain_type: 'evm' | 'sol' | 'sui';
          address: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          chain_type?: 'evm' | 'sol' | 'sui';
          address?: string;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      ex_tokens: {
        Row: {
          id: string;
          name: string;
          symbol: string;
          logo: string | null;
          address: string;
          network_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          symbol: string;
          logo?: string | null;
          address: string;
          network_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          symbol?: string;
          logo?: string | null;
          address?: string;
          network_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wallet_ex_tokens: {
        Row: {
          id: string;
          chain_type: 'evm' | 'sol' | 'sui';
          address: string;
          wallet_id: string | null;
          ex_token_id: string | null;
          balance: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          chain_type: 'evm' | 'sol' | 'sui';
          address: string;
          wallet_id?: string | null;
          ex_token_id?: string | null;
          balance: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          chain_type?: 'evm' | 'sol' | 'sui';
          address?: string;
          wallet_id?: string | null;
          ex_token_id?: string | null;
          balance?: number;
          created_at?: string;
        };
      };
      tokens: {
        Row: {
          id: string;
          name: string;
          symbol: string;
          logo: string | null;
          token_contract: string | null;
          network_id: string | null;
          start_time: string;
          end_time: string;
          status: 'draft' | 'active' | 'ended' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          symbol: string;
          logo?: string | null;
          token_contract?: string | null;
          network_id?: string | null;
          start_time: string;
          end_time: string;
          status?: 'draft' | 'active' | 'ended' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          symbol?: string;
          logo?: string | null;
          token_contract?: string | null;
          network_id?: string | null;
          start_time?: string;
          end_time?: string;
          status?: 'draft' | 'active' | 'ended' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          token_id: string | null;
          seller_wallet_id: string | null;
          price: number;
          quantity: number;
          filled: number;
          status: 'open' | 'closed';
          start_time: string;
          end_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          token_id?: string | null;
          seller_wallet_id?: string | null;
          price: number;
          quantity: number;
          filled?: number;
          status?: 'open' | 'closed';
          start_time: string;
          end_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          token_id?: string | null;
          seller_wallet_id?: string | null;
          price?: number;
          quantity?: number;
          filled?: number;
          status?: 'open' | 'closed';
          start_time?: string;
          end_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          offer_id: string | null;
          buyer_wallet_id: string | null;
          amount: number;
          status: 'pending' | 'settled' | 'cancelled';
          tx_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          offer_id?: string | null;
          buyer_wallet_id?: string | null;
          amount: number;
          status?: 'pending' | 'settled' | 'cancelled';
          tx_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          offer_id?: string | null;
          buyer_wallet_id?: string | null;
          amount?: number;
          status?: 'pending' | 'settled' | 'cancelled';
          tx_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          offer_id: string | null;
          buyer_id: string;
          rating: number;
          comment: string;
          reply: string | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          offer_id?: string | null;
          buyer_id: string;
          rating: number;
          comment: string;
          reply?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          offer_id?: string | null;
          buyer_id?: string;
          rating?: number;
          comment?: string;
          reply?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          title: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: string;
          title: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: string;
          title?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string | null;
          subject: string;
          content: string;
          status: 'open' | 'in_progress' | 'resolved' | 'closed';
          admin_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          subject: string;
          content: string;
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          admin_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          subject?: string;
          content?: string;
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          admin_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          order_id: string | null;
          user_id: string | null;
          message: string;
          attachment_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          user_id?: string | null;
          message: string;
          attachment_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          user_id?: string | null;
          message?: string;
          attachment_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
