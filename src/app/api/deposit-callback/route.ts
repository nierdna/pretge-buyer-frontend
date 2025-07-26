import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/server/db/supabase';
import { CONTRACTS } from '@/contracts/contracts';
import { EscrowFactory } from '@/contracts/factory/escrow-factory';
import { Keypair } from '@solana/web3.js';
import { ChainType } from '@/server/enums/chain';

export async function POST(req: NextRequest) {
  try {
    const { tx_hash: txHash, chain_id: chainId } = await req.json();
    if (!txHash || !chainId) {
      return NextResponse.json({ error: 'Missing txHash or chainId' }, { status: 400 });
    }
    const { data: network, error: networkError } = await supabase
      .from('networks')
      .select('rpc_url, chain_type')
      .eq('chain_id', chainId.toString())
      .single();
    if (networkError || !network) {
      console.log('networkError: ' + networkError?.message);
      return NextResponse.json(
        { error: 'Network not found ' + networkError?.message },
        { status: 404 }
      );
    }
    const rpcUrl = network.rpc_url as string;
    const chainType = network.chain_type as ChainType;
    const escrowAddress = CONTRACTS[chainId.toString()].ESCROW;
    if (!escrowAddress) {
      console.log('escrowAddress not found ' + chainId.toString());
      return NextResponse.json(
        { error: 'Escrow address not found ' + chainId.toString() },
        { status: 404 }
      );
    }

    const escrowContract = EscrowFactory.create(chainType, chainId.toString(), {
      rpc: rpcUrl,
      programId: escrowAddress,
      userAddress: Keypair.generate().publicKey.toString(),
    });

    if (!escrowContract) {
      return NextResponse.json({ error: 'Escrow not found' }, { status: 404 });
    }

    const { found, userAddress, tokenAddress, rawAmount, formattedAmount, logIndex } =
      await escrowContract.parseTransaction(txHash);

    if (!found) {
      return NextResponse.json({ error: 'Deposit event not found' }, { status: 404 });
    }

    // 0. Kiểm tra txHash đã có trong bảng transactions chưa
    const { data: existedTx, error: existedTxError } = await supabase
      .from('transactions')
      .select('id')
      .eq('tx_hash', txHash)
      .single();
    if (existedTx && !existedTxError) {
      // Nếu đã có log giao dịch, return luôn (idempotent)
      return NextResponse.json({
        success: true,
        message: 'Transaction already processed',
        data: existedTx,
      });
    }

    // 1. Tìm walletId theo address
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('id')
      .ilike('address', userAddress.toLowerCase())
      .single();
    if (walletError || !wallet) {
      console.log('walletError: ' + walletError?.message);
      return NextResponse.json(
        { error: 'Wallet not found for userAddress: ' + userAddress },
        { status: 404 }
      );
    }
    const walletId = wallet.id;

    // 2. Tìm exTokenId theo address
    const { data: exToken, error: exTokenError } = await supabase
      .from('ex_tokens')
      .select('id')
      .ilike('address', tokenAddress.toLowerCase())
      .single();
    if (exTokenError || !exToken) {
      return NextResponse.json({ error: 'exToken not found for token address' }, { status: 404 });
    }
    const exTokenId = exToken.id;

    // 3. Tìm wallet_ex_tokens
    const { data: walletExToken, error: walletExTokenError } = await supabase
      .from('wallet_ex_tokens')
      .select('id, balance')
      .eq('wallet_id', walletId)
      .eq('ex_token_id', exTokenId)
      .single();

    let newBalance;
    if (walletExToken && !walletExTokenError) {
      // Đã có, cộng dồn balance
      newBalance = (Number(walletExToken.balance) + Number(formattedAmount)).toString();
      const { error: updateError } = await supabase
        .from('wallet_ex_tokens')
        .update({ balance: newBalance })
        .eq('id', walletExToken.id);
      if (updateError) {
        return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
      }
    } else {
      // Chưa có, tạo mới
      newBalance = rawAmount;
      const { error: insertError } = await supabase
        .from('wallet_ex_tokens')
        .insert({ wallet_id: walletId, ex_token_id: exTokenId, balance: newBalance });
      if (insertError) {
        return NextResponse.json({ error: 'Failed to insert wallet_ex_token' }, { status: 500 });
      }
    }

    // 4. Ghi log vào bảng transactions (chỉ lưu tx_hash, chain_id, log_index, event, event_data)
    const eventData = {
      user: userAddress,
      token: tokenAddress,
      amount: rawAmount,
      formattedAmount,
      walletId,
      exTokenId,
      newBalance,
    };

    const { error: txLogError } = await supabase.from('transactions').insert({
      tx_hash: txHash,
      chain_id: chainId,
      log_index: logIndex || 0,
      event: 'deposit',
      event_data: eventData,
      created_at: new Date().toISOString(),
    });

    if (txLogError) {
      return NextResponse.json({ error: 'Failed to log transaction' }, { status: 500 });
    }

    const data = { walletId, exTokenId, newBalance } as any;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.log('err: ' + err.message);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
