'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function getWalletId() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('wallet_id') || '';
  }
  return '';
}

export default function ProductDetailTestPage() {
  const params = useParams();
  const id = params?.id as string;
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [walletId, setWalletId] = useState('');

  // Lấy wallet_id từ localStorage
  useEffect(() => {
    setWalletId(getWalletId());
  }, []);

  // Lấy thông tin offer
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`/api/v1/offers?id=${id}`)
      .then((res) => {
        setOffer(res.data.data?.[0] || null);
      })
      .catch(() => setOffer(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Lấy số dư ex_token
  useEffect(() => {
    if (!offer?.ex_token?.id || !walletId) return;
    setBalanceLoading(true);
    axios
      .get(
        `/api/v1/wallet-ex-tokens/balance?wallet_id=${walletId}&ex_token_id=${offer.ex_token.id}`
      )
      .then((res) => {
        setBalance(res.data.balance ?? 0);
      })
      .catch(() => setBalance(0))
      .finally(() => setBalanceLoading(false));
  }, [offer?.ex_token?.id, walletId]);

  const handleBuy = async () => {
    if (!offer) return;
    setBuying(true);
    setMessage(null);
    try {
      const res = await axios.post(`/api/v1/orders`, {
        offer_id: id,
        quantity,
        wallet_id: walletId,
      });
      setMessage('Mua thành công!');
      // Reload số dư
      setBalanceLoading(true);
      axios
        .get(
          `/api/v1/wallet-ex-tokens/balance?wallet_id=${walletId}&ex_token_id=${offer.ex_token.id}`
        )
        .then((res) => {
          setBalance(res.data.balance ?? 0);
        })
        .catch(() => setBalance(0))
        .finally(() => setBalanceLoading(false));
      setBuying(false);
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Có lỗi xảy ra khi mua hàng');
      setBuying(false);
    }
  };

  if (loading) return <div className="text-gray-300 p-8">Đang tải...</div>;
  if (!offer) return <div className="text-red-400 p-8">Không tìm thấy sản phẩm</div>;

  return (
    <div className="min-h-[80vh] bg-[#10141c] flex flex-col items-center py-10">
      <div className="w-full max-w-lg bg-[#181e2a] rounded-xl p-8 shadow border border-[#232a3a]">
        <h1 className="text-2xl font-bold text-blue-400 mb-4">Chi tiết sản phẩm</h1>
        <div className="mb-2 text-lg text-white font-bold">
          {offer.tokens?.name} ({offer.tokens?.symbol})
        </div>
        <div className="mb-2 text-gray-300">
          Giá: <span className="text-green-400 font-bold">{offer.price}</span>
        </div>
        <div className="mb-2 text-gray-300">
          Số lượng còn: <span className="font-bold">{offer.quantity}</span>
        </div>
        <div className="mb-2 text-gray-400 text-xs">Seller: {offer.seller_wallet?.address}</div>
        <div className="mb-2 text-gray-400 text-xs">
          Thời gian: {offer.start_time?.slice(0, 10)} - {offer.end_time?.slice(0, 10)}
        </div>
        <div className="mb-2 text-gray-500 text-xs">Trạng thái: {offer.status}</div>
        {offer.ex_token && (
          <div className="bg-[#232a3a] rounded p-2 mt-2 text-xs text-gray-200">
            ExToken: <b>{offer.ex_token.name}</b> ({offer.ex_token.symbol})
            {offer.ex_token.network && (
              <span>
                {' '}
                &gt; Network: <b>{offer.ex_token.network.name}</b> ({offer.ex_token.network.symbol})
              </span>
            )}
            <div className="mt-2 text-blue-300">
              Số dư của bạn: {balanceLoading ? '...' : (balance ?? 0)} {offer.ex_token.symbol}
            </div>
          </div>
        )}
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleBuy();
          }}
        >
          <label className="text-gray-300 text-sm">Số lượng muốn mua:</label>
          <input
            type="number"
            min={1}
            max={offer.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="px-3 py-2 rounded bg-[#232a3a] border border-[#232a3a] text-gray-200 w-full"
            required
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            disabled={buying}
          >
            {buying ? 'Đang mua...' : 'Mua ngay'}
          </button>
        </form>
        {message && (
          <div
            className={`mt-4 text-center ${
              message.includes('thành công') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
