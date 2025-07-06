-- Migration: Add Base Network Support
-- This migration adds Base network to the networks table

-- Insert Base network (mainnet)
INSERT INTO networks (name, chain_type, rpc_url, explorer_url) 
VALUES (
  'Base',
  'evm',
  'https://mainnet.base.org',
  'https://basescan.org'
) ON CONFLICT (name) DO NOTHING;

-- Insert Base Sepolia (testnet)
INSERT INTO networks (name, chain_type, rpc_url, explorer_url) 
VALUES (
  'Base Sepolia',
  'evm',
  'https://sepolia.base.org',
  'https://sepolia.basescan.org'
) ON CONFLICT (name) DO NOTHING;

-- Update existing wallets to use EVM chain type if they are Base addresses
-- This is optional and depends on your existing data structure
-- UPDATE wallets 
-- SET chain_type = 'evm' 
-- WHERE address LIKE '0x%' AND chain_type = 'sol';

-- Add index for better performance on chain_type queries
CREATE INDEX IF NOT EXISTS idx_wallets_chain_type_address ON wallets(chain_type, address);

-- Add constraint to ensure wallet addresses are unique per chain type
ALTER TABLE wallets ADD CONSTRAINT unique_wallet_per_chain 
  UNIQUE (chain_type, address); 