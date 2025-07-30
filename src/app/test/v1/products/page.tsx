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
    <div className="flex min-h-[80vh] flex-col items-center bg-[#10141c] py-10">
      <h1 className="mb-6 text-2xl font-bold text-blue-400">Danh sách sản phẩm (Offers)</h1>

      {/* Main filters */}
      <div className="mb-6 flex w-full max-w-5xl flex-col items-center gap-4 md:flex-row">
        <input
          className="w-full rounded border border-[#232a3a] bg-[#181e2a] px-3 py-2 text-gray-200 md:w-1/2"
          placeholder="Search token name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="rounded border border-[#232a3a] bg-[#181e2a] px-3 py-2 text-gray-200"
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
          className="rounded bg-red-600 px-4 py-2 text-primary transition hover:bg-red-700"
        >
          Clear Filters
        </button>
      </div>

      {/* Advanced filters */}
      <div className="mb-6 w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Network filter */}
          <div className="rounded-xl border border-[#232a3a] bg-[#181e2a] p-4">
            <h3 className="mb-3 font-bold text-primary">Networks</h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {networks.map((network) => (
                <label
                  key={network.id}
                  className="flex items-center space-x-2 text-sm text-gray-300"
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
          <div className="rounded-xl border border-[#232a3a] bg-[#181e2a] p-4">
            <h3 className="mb-3 font-bold text-primary">Collateral Percent</h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {COLLATERAL_PERCENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 text-sm text-gray-300"
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
          <div className="rounded-xl border border-[#232a3a] bg-[#181e2a] p-4">
            <h3 className="mb-3 font-bold text-primary">Settle Duration</h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {SETTLE_DURATION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 text-sm text-gray-300"
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
        <div className="mb-4 w-full max-w-5xl">
          <div className="rounded-lg bg-[#232a3a] p-3">
            <h4 className="mb-2 font-bold text-primary">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedNetworkIds.map((networkId) => {
                const network = networks.find((n) => n.id === networkId);
                return (
                  <span
                    key={networkId}
                    className="rounded bg-blue-600 px-2 py-1 text-xs text-primary"
                  >
                    Network: {network?.name || networkId}
                  </span>
                );
              })}
              {selectedCollateralPercents.map((percent) => (
                <span key={percent} className="rounded bg-green-600 px-2 py-1 text-xs text-primary">
                  Collateral: {percent}%
                </span>
              ))}
              {selectedSettleDurations.map((duration) => (
                <span
                  key={duration}
                  className="rounded bg-purple-600 px-2 py-1 text-xs text-primary"
                >
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
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col gap-2 rounded-xl border border-[#232a3a] bg-[#181e2a] p-5 shadow"
            >
              <div className="mb-2 flex items-center gap-3">
                {offer.tokens?.logo && (
                  <img
                    src={offer.tokens.logo}
                    alt={offer.tokens.name}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <div className="text-lg font-bold text-primary">
                    {offer.tokens?.name || 'Token'}
                  </div>
                  <div className="text-xs text-gray-400">{offer.tokens?.symbol}</div>
                </div>
              </div>
              <div className="text-gray-300">
                Giá: <span className="font-bold text-green-400">{offer.price}</span>
              </div>
              <div className="text-gray-300">
                Số lượng: <span className="font-bold">{offer.quantity}</span>
                {offer.filled > 0 && (
                  <span className="ml-2 text-content">(Đã bán: {offer.filled})</span>
                )}
              </div>
              <div className="text-gray-300">
                Collateral:{' '}
                <span className="font-bold text-yellow-400">{offer.collateral_percent}%</span>
              </div>
              <div className="text-gray-300">
                Duration:{' '}
                <span className="font-bold text-blue-400">{offer.settle_duration} days</span>
              </div>
              <div className="text-xs text-gray-400">
                Seller: {offer.seller_wallet?.address?.slice(0, 8)}...
              </div>
              <div className="text-xs text-gray-400">
                Thời gian: {offer.start_time?.slice(0, 10)} - {offer.end_time?.slice(0, 10)}
              </div>
              <div className="text-xs text-content">Trạng thái: {offer.status}</div>
              {offer.ex_token_id && (
                <div className="mt-2 text-xs text-blue-300">ex_token_id: {offer.ex_token_id}</div>
              )}
              {offer.ex_token && (
                <div className="mt-1 rounded bg-[#232a3a] p-2 text-xs text-gray-200">
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
                className="mt-3 rounded bg-blue-600 px-4 py-2 text-center font-bold text-primary transition hover:bg-blue-700"
              >
                Chi tiết & Mua
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex gap-2">
        <button
          className="rounded bg-blue-600 px-3 py-1 text-primary disabled:bg-gray-700"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Trang trước
        </button>
        <span className="text-gray-300">
          Trang {page} / {totalPages}
        </span>
        <button
          className="rounded bg-blue-600 px-3 py-1 text-primary disabled:bg-gray-700"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}
