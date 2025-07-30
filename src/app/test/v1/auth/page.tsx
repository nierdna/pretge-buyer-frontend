'use client';
import axios from 'axios';
import { useState } from 'react';

const WALLET_TYPES = [
  { label: 'Base (EVM)', value: 'evm', icon: '🦊' },
  { label: 'Solana', value: 'sol', icon: '🌞' },
];

declare global {
  interface EthereumProvider {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  }
}

export default function AuthPage() {
  const [chainType, setChainType] = useState('evm');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Kết nối ví
  const connectWallet = async () => {
    setError('');
    if (chainType === 'evm') {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await (window.ethereum as unknown as EthereumProvider).request({
          method: 'eth_requestAccounts',
        });
        setAddress(accounts[0]);
      } else {
        setError('Không tìm thấy MetaMask');
      }
    } else if (chainType === 'sol') {
      if (
        typeof window !== 'undefined' &&
        (window as any).solana &&
        (window as any).solana.isPhantom
      ) {
        const resp = await (window as any).solana.connect();
        setAddress(resp.publicKey.toString());
      } else {
        setError('Không tìm thấy ví Phantom');
      }
    }
  };

  // Đăng nhập
  const handleLogin = async () => {
    setLoading(true);
    setStatus('');
    setError('');
    try {
      // 1. Lấy message từ API
      const msgRes = await axios.post('/api/v1/auth/login-message', {
        walletAddress: address,
        chainType,
      });
      const { message, timestamp } = msgRes.data;
      setMessage(message);

      // 2. Ký message
      let signature = '';
      if (chainType === 'evm') {
        if (typeof window !== 'undefined' && window.ethereum) {
          signature = await (window.ethereum as unknown as EthereumProvider).request({
            method: 'personal_sign',
            params: [message, address],
          });
        } else {
          setError('Không tìm thấy MetaMask');
          setLoading(false);
          return;
        }
      } else if (chainType === 'sol') {
        if (
          typeof window !== 'undefined' &&
          (window as any).solana &&
          (window as any).solana.isPhantom
        ) {
          const encoded = new TextEncoder().encode(message);
          const signed = await (window as any).solana.signMessage(encoded, 'utf8');
          signature = Buffer.from(signed.signature).toString('base64');
        } else {
          setError('Không tìm thấy ví Phantom');
          setLoading(false);
          return;
        }
      }

      // 3. Gửi signature lên API
      const loginRes = await axios.post('/api/v1/auth/login', {
        walletAddress: address,
        signature,
        message,
        timestamp,
        chainType,
      });
      if (loginRes.data.success) {
        setStatus('✅ Đăng nhập thành công! Xin chào ' + loginRes.data.data.user.name);
        // Lưu wallet_id vào localStorage để các trang khác dùng
        if (loginRes.data.data.wallet?.id) {
          localStorage.setItem('wallet_id', loginRes.data.data.wallet.id);
        }
      } else {
        setError('Đăng nhập thất bại: ' + loginRes.data.message);
      }
    } catch (err: any) {
      setError('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-[#10141c]">
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-[#232a3a] bg-[#181e2a] p-8 shadow-2xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-400">Đăng nhập bằng Wallet</h1>
        <p className="mb-6 text-center text-gray-400">Chọn loại ví và đăng nhập để tiếp tục</p>
        <div className="mb-4 w-full">
          <label className="mb-1 block font-medium text-gray-300">Chọn loại ví:</label>
          <div className="flex gap-2">
            {WALLET_TYPES.map((w) => (
              <button
                key={w.value}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-base font-bold shadow-sm transition ${
                  chainType === w.value
                    ? 'border-blue-500 bg-blue-600 text-primary'
                    : 'border-[#232a3a] bg-[#232a3a] text-gray-200 hover:border-blue-400'
                } `}
                onClick={() => setChainType(w.value)}
                type="button"
                disabled={loading}
              >
                <span className="text-xl">{w.icon}</span>
                {w.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 flex w-full flex-col items-center">
          <button
            className="w-full rounded-lg bg-blue-600 px-5 py-2 font-bold text-primary transition hover:bg-blue-700"
            onClick={connectWallet}
            disabled={loading}
            type="button"
          >
            Kết nối ví
          </button>
          {address && (
            <span className="mt-2 break-all text-xs text-green-400">
              Đã kết nối: <b>{address}</b>
            </span>
          )}
        </div>
        <div className="mb-4 w-full">
          <button
            className="w-full rounded-lg bg-green-600 px-5 py-2 font-bold text-primary transition hover:bg-green-700"
            onClick={handleLogin}
            disabled={loading || !address}
            type="button"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
        {message && (
          <div className="mb-2 w-full text-xs text-gray-400">
            <div>Message để ký:</div>
            <pre className="break-all rounded bg-[#232a3a] p-2 text-gray-300">{message}</pre>
          </div>
        )}
        {status && (
          <div className="mt-4 w-full text-center text-sm font-bold text-green-400">{status}</div>
        )}
        {error && (
          <div className="mt-4 w-full text-center text-sm font-bold text-red-400">{error}</div>
        )}
      </div>
    </div>
  );
}
