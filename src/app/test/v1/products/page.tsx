'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

interface Network {
  id: string;
  name: string;
  chain_type: string;
  rpc_url: string;
  explorer_url: string;
}

interface ExToken {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
  address?: string;
  network?: Network;
}

interface Offer {
  id: string;
  price: number;
  quantity: number;
  filled: number;
  collateral_percent: number;
  settle_duration: number;
  status: string;
  start_time: string;
  end_time: string;
  tokens: Token;
  seller_wallet: SellerWallet;
  ex_token_id?: string;
  ex_token?: ExToken;
}

const SORT_OPTIONS = [
  { label: 'Recently Added', value: 'recent' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const COLLATERAL_PERCENT_OPTIONS = [
  { label: 'All', value: '' },
  { label: '25%', value: '25' },
  { label: '50%', value: '50' },
  { label: '75%', value: '75' },
  { label: '100%', value: '100' },
];

const SETTLE_DURATION_OPTIONS = [
  { label: 'All', value: '' },
  { label: '1 hr', value: '1' },
  { label: '2 hrs', value: '2' },
  { label: '4 hrs', value: '4' },
  { label: '6 hrs', value: '6' },
  { label: '12 hrs', value: '12' },
  { label: '24 hrs', value: '24' },
];

export default function ProductsTestPage() {
  const [products, setProducts] = useState<Offer[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');

  // New filter states
  const [selectedNetworkIds, setSelectedNetworkIds] = useState<string[]>([]);
  const [selectedCollateralPercents, setSelectedCollateralPercents] = useState<string[]>([]);
  const [selectedSettleDurations, setSelectedSettleDurations] = useState<string[]>([]);

  // Load networks on component mount
  useEffect(() => {
    axios
      .get('/api/v1/networks')
      .then((res) => {
        setNetworks(res.data.data || []);
      })
      .catch(() => setNetworks([]));
  }, []);

  useEffect(() => {
    setLoading(true);

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '8',
      search: search,
      sort: sort,
    });

    // Add network filter
    if (selectedNetworkIds.length > 0) {
      params.append('network_ids', selectedNetworkIds.join(','));
    }

    // Add collateral percent filter
    if (selectedCollateralPercents.length > 0) {
      params.append('collateral_percents', selectedCollateralPercents.join(','));
    }

    // Add settle duration filter
    if (selectedSettleDurations.length > 0) {
      params.append('settle_durations', selectedSettleDurations.join(','));
    }

    axios
      .get(`/api/v1/offers?${params.toString()}`)
      .then((res) => {
        setProducts(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, search, sort, selectedNetworkIds, selectedCollateralPercents, selectedSettleDurations]);

  const handleNetworkChange = (networkId: string, checked: boolean) => {
    if (checked) {
      setSelectedNetworkIds((prev) => [...prev, networkId]);
    } else {
      setSelectedNetworkIds((prev) => prev.filter((id) => id !== networkId));
    }
    setPage(1);
  };

  const handleCollateralPercentChange = (percent: string, checked: boolean) => {
    if (checked) {
      setSelectedCollateralPercents((prev) => [...prev, percent]);
    } else {
      setSelectedCollateralPercents((prev) => prev.filter((p) => p !== percent));
    }
    setPage(1);
  };

  const handleSettleDurationChange = (duration: string, checked: boolean) => {
    if (checked) {
      setSelectedSettleDurations((prev) => [...prev, duration]);
    } else {
      setSelectedSettleDurations((prev) => prev.filter((d) => d !== duration));
    }
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedNetworkIds([]);
    setSelectedCollateralPercents([]);
    setSelectedSettleDurations([]);
    setSearch('');
    setSort('recent');
    setPage(1);
  };

  return (
    <div className="min-h-[80vh] bg-[#10141c] flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold text-blue-400 mb-6">Danh sách sản phẩm (Offers)</h1>

      {/* Main filters */}
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
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Advanced filters */}
      <div className="w-full max-w-5xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Network filter */}
          <div className="bg-[#181e2a] rounded-xl p-4 border border-[#232a3a]">
            <h3 className="text-white font-semibold mb-3">Networks</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {networks.map((network) => (
                <label
                  key={network.id}
                  className="flex items-center space-x-2 text-gray-300 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedNetworkIds.includes(network.id)}
                    onChange={(e) => handleNetworkChange(network.id, e.target.checked)}
                    className="rounded border-[#232a3a] bg-[#232a3a] text-blue-600"
                  />
                  <span>{network.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Collateral Percent filter */}
          <div className="bg-[#181e2a] rounded-xl p-4 border border-[#232a3a]">
            <h3 className="text-white font-semibold mb-3">Collateral Percent</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {COLLATERAL_PERCENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 text-gray-300 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCollateralPercents.includes(option.value)}
                    onChange={(e) => handleCollateralPercentChange(option.value, e.target.checked)}
                    className="rounded border-[#232a3a] bg-[#232a3a] text-blue-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Settle Duration filter */}
          <div className="bg-[#181e2a] rounded-xl p-4 border border-[#232a3a]">
            <h3 className="text-white font-semibold mb-3">Settle Duration</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {SETTLE_DURATION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 text-gray-300 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedSettleDurations.includes(option.value)}
                    onChange={(e) => handleSettleDurationChange(option.value, e.target.checked)}
                    className="rounded border-[#232a3a] bg-[#232a3a] text-blue-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {(selectedNetworkIds.length > 0 ||
        selectedCollateralPercents.length > 0 ||
        selectedSettleDurations.length > 0) && (
        <div className="w-full max-w-5xl mb-4">
          <div className="bg-[#232a3a] rounded-lg p-3">
            <h4 className="text-white font-semibold mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedNetworkIds.map((networkId) => {
                const network = networks.find((n) => n.id === networkId);
                return (
                  <span
                    key={networkId}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                  >
                    Network: {network?.name || networkId}
                  </span>
                );
              })}
              {selectedCollateralPercents.map((percent) => (
                <span key={percent} className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                  Collateral: {percent}%
                </span>
              ))}
              {selectedSettleDurations.map((duration) => (
                <span key={duration} className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                  Duration: {duration} days
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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
                {offer.filled > 0 && (
                  <span className="text-gray-500 ml-2">(Đã bán: {offer.filled})</span>
                )}
              </div>
              <div className="text-gray-300">
                Collateral:{' '}
                <span className="text-yellow-400 font-bold">{offer.collateral_percent}%</span>
              </div>
              <div className="text-gray-300">
                Duration:{' '}
                <span className="text-blue-400 font-bold">{offer.settle_duration} days</span>
              </div>
              <div className="text-gray-400 text-xs">
                Seller: {offer.seller_wallet?.address?.slice(0, 8)}...
              </div>
              <div className="text-gray-400 text-xs">
                Thời gian: {offer.start_time?.slice(0, 10)} - {offer.end_time?.slice(0, 10)}
              </div>
              <div className="text-gray-500 text-xs">Trạng thái: {offer.status}</div>
              {offer.ex_token_id && (
                <div className="text-xs text-blue-300 mt-2">ex_token_id: {offer.ex_token_id}</div>
              )}
              {offer.ex_token && (
                <div className="bg-[#232a3a] rounded p-2 mt-1 text-xs text-gray-200">
                  ExToken: <b>{offer.ex_token.name}</b> ({offer.ex_token.symbol})
                  {offer.ex_token.network && (
                    <span>
                      {' '}
                      &gt; Network: <b>{offer.ex_token.network.name}</b>
                    </span>
                  )}
                </div>
              )}
              <Link
                href={`/test/v1/products/${offer.id}`}
                className="mt-3 px-4 py-2 rounded bg-blue-600 text-white text-center font-semibold hover:bg-blue-700 transition"
              >
                Chi tiết & Mua
              </Link>
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
