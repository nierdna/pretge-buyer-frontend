'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
}

interface SellerWallet {
  id: string;
  address: string;
}

interface Offer {
  id: string;
  price: number;
  quantity: number;
  status: string;
  start_time: string;
  end_time: string;
  tokens: Token;
  seller_wallet: SellerWallet;
}

const SORT_OPTIONS = [
  { label: 'Recently Added', value: 'recent' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function ProductsTestPage() {
  const [products, setProducts] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `/api/v1/products?page=${page}&limit=8&search=${encodeURIComponent(search)}&sort=${sort}`
      )
      .then((res) => {
        setProducts(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, search, sort]);

  return (
    <div className="min-h-[80vh] bg-[#10141c] flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold text-blue-400 mb-6">Danh sách sản phẩm (Offers)</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-5xl items-center">
        <input
          className="px-3 py-2 rounded bg-[#181e2a] border border-[#232a3a] text-gray-200 w-full md:w-1/2"
          placeholder="Search token name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="px-3 py-2 rounded bg-[#181e2a] border border-[#232a3a] text-gray-200"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-gray-300">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {products.map((offer) => (
            <div
              key={offer.id}
              className="bg-[#181e2a] rounded-xl p-5 shadow border border-[#232a3a] flex flex-col gap-2"
            >
              <div className="flex items-center gap-3 mb-2">
                {offer.tokens?.logo && (
                  <img
                    src={offer.tokens.logo}
                    alt={offer.tokens.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="text-lg font-semibold text-white">
                    {offer.tokens?.name || 'Token'}
                  </div>
                  <div className="text-xs text-gray-400">{offer.tokens?.symbol}</div>
                </div>
              </div>
              <div className="text-gray-300">
                Giá: <span className="text-green-400 font-bold">{offer.price}</span>
              </div>
              <div className="text-gray-300">
                Số lượng: <span className="font-bold">{offer.quantity}</span>
              </div>
              <div className="text-gray-400 text-xs">
                Seller: {offer.seller_wallet?.address?.slice(0, 8)}...
              </div>
              <div className="text-gray-400 text-xs">
                Thời gian: {offer.start_time?.slice(0, 10)} - {offer.end_time?.slice(0, 10)}
              </div>
              <div className="text-gray-500 text-xs">Trạng thái: {offer.status}</div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-8">
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:bg-gray-700"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Trang trước
        </button>
        <span className="text-gray-300">
          Trang {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:bg-gray-700"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}
