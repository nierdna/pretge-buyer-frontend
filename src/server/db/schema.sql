-- Create networks table (based on Network interface from network.ts)
CREATE TABLE IF NOT EXISTS networks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  chain_type VARCHAR(10) NOT NULL CHECK (chain_type IN ('evm', 'sui', 'sol')),
  rpc_url TEXT NOT NULL,
  explorer_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (based on User interface from user.ts)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  banner TEXT,
  description TEXT,
  social_media JSONB NOT NULL DEFAULT '{"twitter": "", "telegram": "", "discord": "", "instagram": "", "facebook": "", "youtube": ""}',
  kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'banned', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallets table (based on Wallet interface from wallet.ts)
CREATE TABLE IF NOT EXISTS wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chain_type VARCHAR(10) NOT NULL CHECK (chain_type IN ('evm', 'sui', 'sol')),
  address VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ex_tokens table (based on ExToken interface from exToken.ts)
CREATE TABLE IF NOT EXISTS ex_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  logo TEXT,
  address VARCHAR(255) NOT NULL,
  network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_ex_tokens table (based on WalletExToken interface from walletExToken.ts)
CREATE TABLE IF NOT EXISTS wallet_ex_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_type VARCHAR(10) NOT NULL CHECK (chain_type IN ('evm', 'sui', 'sol')),
  address VARCHAR(255) NOT NULL,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  ex_token_id UUID REFERENCES ex_tokens(id) ON DELETE CASCADE,
  balance DECIMAL(18,8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tokens table (based on Token interface from token.ts)
CREATE TABLE IF NOT EXISTS tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  logo TEXT,
  token_contract VARCHAR(255),
  network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'ended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offers table (based on Offer interface from offer.ts)
CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
  ex_token_id UUID REFERENCES ex_tokens(id) ON DELETE CASCADE,
  seller_wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  price DECIMAL(18,8) NOT NULL,
  quantity DECIMAL(18,8) NOT NULL,
  filled DECIMAL(18,8) NOT NULL DEFAULT 0,
  collateral_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  settle_duration INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  title VARCHAR(255) NOT NULL DEFAULT '',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_token_or_ex_token CHECK (token_id IS NOT NULL OR ex_token_id IS NOT NULL)
);

-- Create orders table (based on Order interface from order.ts)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  buyer_wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  amount DECIMAL(18,8) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'cancelled')),
  tx_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table (based on Review interface from review.ts)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE NOT NULL,
  buyer_id VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  reply TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table (based on Notification interface from notification.ts)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table (based on SupportTicket interface from support.ts)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table (based on ChatMessage interface from chat.ts)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_networks_chain_type ON networks(chain_type);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_chain_type ON wallets(chain_type);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_ex_tokens_network_id ON ex_tokens(network_id);
CREATE INDEX IF NOT EXISTS idx_ex_tokens_symbol ON ex_tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_ex_tokens_address ON ex_tokens(address);
CREATE INDEX IF NOT EXISTS idx_wallet_ex_tokens_wallet_id ON wallet_ex_tokens(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_ex_tokens_ex_token_id ON wallet_ex_tokens(ex_token_id);
CREATE INDEX IF NOT EXISTS idx_wallet_ex_tokens_chain_type ON wallet_ex_tokens(chain_type);
CREATE INDEX IF NOT EXISTS idx_tokens_network_id ON tokens(network_id);
CREATE INDEX IF NOT EXISTS idx_tokens_symbol ON tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
CREATE INDEX IF NOT EXISTS idx_offers_token_id ON offers(token_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller_wallet_id ON offers(seller_wallet_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_orders_offer_id ON orders(offer_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_wallet_id ON orders(buyer_wallet_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_offer_id ON reviews(offer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON reviews(buyer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_seller_id ON notifications(seller_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_support_tickets_seller_id ON support_tickets(seller_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_seller_id ON chat_messages(seller_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_buyer_id ON chat_messages(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_order_id ON chat_messages(order_id);

-- Add constraints
ALTER TABLE wallets ADD CONSTRAINT unique_primary_wallet_per_user 
  EXCLUDE (user_id WITH =) WHERE (is_primary = true);

-- Add unique constraint for wallet-token pairs
ALTER TABLE wallet_ex_tokens ADD CONSTRAINT unique_wallet_ex_token 
  UNIQUE (wallet_id, ex_token_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ex_tokens_updated_at BEFORE UPDATE ON ex_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
