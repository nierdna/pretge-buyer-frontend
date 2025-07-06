'use client';
import { useState } from 'react';
import axios from 'axios';

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#10141c]">
      <div className="bg-[#181e2a] rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center border border-[#232a3a]">
        <h1 className="text-3xl font-bold mb-2 text-blue-400">Đăng nhập bằng Wallet</h1>
        <p className="text-gray-400 mb-6 text-center">Chọn loại ví và đăng nhập để tiếp tục</p>
        <div className="w-full mb-4">
          <label className="block mb-1 font-medium text-gray-300">Chọn loại ví:</label>
          <div className="flex gap-2">
            {WALLET_TYPES.map((w) => (
              <button
                key={w.value}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition text-base font-semibold shadow-sm
                  ${
                    chainType === w.value
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-[#232a3a] text-gray-200 border-[#232a3a] hover:border-blue-400'
                  }
                `}
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
        <div className="w-full mb-4 flex flex-col items-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold w-full transition"
            onClick={connectWallet}
            disabled={loading}
            type="button"
          >
            Kết nối ví
          </button>
          {address && (
            <span className="mt-2 text-green-400 text-xs break-all">
              Đã kết nối: <b>{address}</b>
            </span>
          )}
        </div>
        <div className="w-full mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold w-full transition"
            onClick={handleLogin}
            disabled={loading || !address}
            type="button"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
        {message && (
          <div className="mb-2 text-xs text-gray-400 w-full">
            <div>Message để ký:</div>
            <pre className="bg-[#232a3a] p-2 rounded break-all text-gray-300">{message}</pre>
          </div>
        )}
        {status && (
          <div className="mt-4 text-sm text-green-400 font-semibold w-full text-center">
            {status}
          </div>
        )}
        {error && (
          <div className="mt-4 text-sm text-red-400 font-semibold w-full text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
