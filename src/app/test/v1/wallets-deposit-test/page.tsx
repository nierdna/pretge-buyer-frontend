'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface ExToken {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
  address?: string;
  network?: { id: string; name: string; chain_type: string };
}

export default function WalletDepositTestPage() {
  const [walletId, setWalletId] = useState('');
  const [exTokens, setExTokens] = useState<ExToken[]>([]);
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const wid = localStorage.getItem('wallet_id') || '';
    setWalletId(wid);
    // Lấy toàn bộ ex_token
    axios
      .get(`/api/v1/ex-tokens`)
      .then((res) => setExTokens(res.data.data || []))
      .catch(() => setExTokens([]));
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        const msgRes = await axios.post('/api/v1/auth/login-message', {
          walletAddress: address,
          chainType: 'evm',
        });
        const { message, timestamp } = msgRes.data;
        const signature = await (window.ethereum as any).request({
          method: 'personal_sign',
          params: [message, address],
        });
        const loginRes = await axios.post('/api/v1/auth/login', {
          walletAddress: address,
          signature,
          message,
          timestamp,
          chainType: 'evm',
        });
        if (loginRes.data.success) {
          const wid = loginRes.data.data.wallet.id;
          localStorage.setItem('wallet_id', wid);
          setWalletId(wid);
          setLoginError('');
        } else {
          setLoginError('Đăng nhập thất bại: ' + loginRes.data.message);
        }
      } else {
        setLoginError('Không tìm thấy MetaMask');
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.message || err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleDeposit = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await axios.post('/api/v1/wallets/deposit-test', {
        wallet_id: walletId,
        token_id: tokenId,
        amount: Number(amount),
      });
      setResult(res.data.message || 'Nạp tiền thành công!');
    } catch (err: any) {
      setResult(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#10141c] flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold text-blue-400 mb-6">Demo Nạp Tiền Test cho User</h1>
      <div className="bg-[#181e2a] rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border border-[#232a3a]">
        {!walletId ? (
          <>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold w-full transition"
              onClick={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng ví (MetaMask)'}
            </button>
            {loginError && <div className="text-red-400 text-sm text-center">{loginError}</div>}
            <div className="mt-2 text-center text-xs text-yellow-400">
              Vui lòng login để lấy Wallet ID.
            </div>
          </>
        ) : (
          <>
            <div className="text-gray-300 text-sm mb-2">
              Wallet ID: <span className="text-blue-400 font-mono">{walletId}</span>
            </div>
            <select
              className="px-3 py-2 rounded bg-[#232a3a] border border-[#232a3a] text-gray-200"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            >
              <option value="">Chọn token muốn nạp</option>
              {exTokens.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.name} ({token.symbol}){token.network ? ` - ${token.network.name}` : ''}
                </option>
              ))}
            </select>
            <input
              className="px-3 py-2 rounded bg-[#232a3a] border border-[#232a3a] text-gray-200"
              placeholder="Số tiền muốn nạp"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold w-full transition"
              onClick={handleDeposit}
              disabled={loading || !walletId || !tokenId || !amount}
            >
              {loading ? 'Đang nạp...' : 'Nạp tiền test'}
            </button>
            {result && (
              <div
                className={`mt-2 text-center text-sm font-bold ${
                  result.includes('thành công') ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {result}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
