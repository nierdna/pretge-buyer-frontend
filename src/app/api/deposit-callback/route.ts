import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { supabase } from '@/server/db/supabase';
import { CONTRACTS } from '@/contracts/contracts';

// Thay thế bằng RPC thực tế của bạn
const ESCROW_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'address', name: 'token', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Deposit',
    type: 'event',
  },
];
const ERC20_ABI = ['function decimals() view returns (uint8)'];

export async function POST(req: NextRequest) {
  try {
    const { tx_hash: txHash, chain_id: chainId } = await req.json();
    if (!txHash || !chainId) {
      return NextResponse.json({ error: 'Missing txHash or chainId' }, { status: 400 });
    }
    const { data: network, error: networkError } = await supabase
      .from('networks')
      .select('rpc_url')
      .eq('id', chainId.toString())
      .single();
    if (networkError || !network) {
      console.log('networkError: ' + networkError?.message);
      return NextResponse.json(
        { error: 'Network not found ' + networkError?.message },
        { status: 404 }
      );
    }
    const rpcUrl = network.rpc_url as string;
    const escrowAddress = CONTRACTS[chainId.toString()].ESCROW;
    if (!escrowAddress) {
      console.log('escrowAddress not found ' + chainId.toString());
      return NextResponse.json(
        { error: 'Escrow address not found ' + chainId.toString() },
        { status: 404 }
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const iface = new ethers.Interface(ESCROW_ABI);
    let found = false;
    let result = null;
    let userAddress = '';
    let tokenAddress = '';
    let rawAmount = '';
    let formattedAmount = '';
    let decimals = 18;
    let logIndex = -1;

    for (let i = 0; i < receipt.logs.length; i++) {
      const log = receipt.logs[i];
      if (log.address.toLowerCase() === escrowAddress.toLowerCase()) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === 'Deposit') {
            const { user, token, amount } = parsed.args;
            userAddress = user;
            tokenAddress = token;
            rawAmount = amount.toString();
            // Lấy decimals của token
            const tokenContract = new ethers.Contract(token, ERC20_ABI, provider);
            decimals = await tokenContract.decimals();
            // Format amount
            formattedAmount = ethers.formatUnits(amount, decimals);
            result = {
              user,
              token,
              amount: rawAmount,
              formattedAmount,
              decimals,
            };
            found = true;
            logIndex = i;
            break;
          }
        } catch (e) {
          // Không phải log của event Deposit, bỏ qua
        }
      }
    }

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
      .eq('address', userAddress.toLowerCase())
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
      .eq('address', tokenAddress.toLowerCase())
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
      log_index: logIndex,
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
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
