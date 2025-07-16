'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Separator from '@/components/ui/separator';
import { CONTRACTS } from '@/contracts/contracts';
import { useEscrow } from '@/hooks/useEscrow';
import { useToken } from '@/hooks/useToken';
import { useWallet } from '@/hooks/useWallet';
import { cn } from '@/lib/utils';
import axiosInstance from '@/service/axios';
import { useAuthStore } from '@/store/authStore';
import { IOffer } from '@/types/offer';
import { formatNumberShort } from '@/utils/helpers/number';
import { normalizeNetworkName, transformToNumber } from '@/utils/helpers/string';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CheckCircle, ChevronRight, Loader2, Minus, Plus, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// import DepositModal from "./deposit-modal"

interface OfferDetailPageContentProps {
  offer?: IOffer;
  onOrderPlaced?: () => void;
}

// This component now contains the right-hand side details of the offer
function OfferDetailsRightColumn({ offer, onOrderPlaced }: OfferDetailPageContentProps) {
  const { walletAddress: address } = useAuthStore();
  const queryClient = useQueryClient();

  const [buyQuantity, setBuyQuantity] = useState(1);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [isEligible, setIsEligible] = useState(false);
  const [isShowPromotion, setIsShowPromotion] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  const estimatedCost = buyQuantity * Number(offer?.price || 0);
  const chainId = offer?.exToken?.network?.chainId?.toString() || '';

  const fetchBalance = async () => {
    if (!address || !offer?.exToken?.address) return;
    try {
      // Always use English for comments and console logs in code
      const res = await axiosInstance.get('/wallet-ex-tokens/balance', {
        params: {
          wallet_address: address,
          ex_token_address: offer.exToken.address,
        },
      });
      setBalance(Number(res.data?.balance ?? 0));
      console.log('Fetched ex token balance:', res.data?.balance);
    } catch (err) {
      console.error('Failed to fetch ex token balance', err);
      setBalance(0);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address, offer?.exToken?.address]);

  const { escrowContract } = useEscrow(chainId);
  const wallet = useWallet(chainId);

  const tokenAddress = offer?.exToken?.address;

  const { tokenContract } = useToken(tokenAddress || '', chainId);
  const contractAddress = CONTRACTS[chainId]?.ESCROW;

  const { data: allowance, refetch: refetchAllowance } = useQuery({
    queryKey: ['allowance', tokenAddress, address],
    queryFn: async () => {
      if (!tokenContract || !address) return 0;
      return await tokenContract.getAllowance(address, contractAddress);
    },
    enabled: !!address && !!tokenAddress,
  });

  const { data: walletInfo } = useQuery({
    queryKey: ['wallet_info', address],
    queryFn: async () => {
      if (!address) return;
      const res = await axiosInstance.get(`wallets/${address}`);
      return res.data.data;
    },
    enabled: !!address,
  });

  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      const txData = await tokenContract?.buildApprove(contractAddress, Number.MAX_SAFE_INTEGER);
      if (!txData) return;
      const tx = await wallet?.sendTransaction(txData);
      if (!tx) return;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await refetchAllowance();
    } catch (err: any) {
      console.error('Approve failed', err);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleDeposit = async () => {
    setDepositLoading(true);
    try {
      console.log('escrowContract', escrowContract);
      console.log('tokenAddress', tokenAddress);
      const txData = await escrowContract?.buildDeposit(tokenAddress!, buyQuantity);
      console.log('txData', txData);
      if (!txData) return;
      const tx = await wallet?.sendTransaction(txData);
      console.log('tx', tx);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      if (!tx) return;
      // Call deposit-callback API
      try {
        await axios.post('/api/deposit-callback', {
          tx_hash: tx || '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          chain_id: chainId,
        });
        console.log('Deposit callback API called');
      } catch (err) {
        console.error('Deposit callback API failed', err);
      }
      // Refetch balance
      await fetchBalance();
      setShowDepositModal(false);
    } catch (err: any) {
      console.error('Deposit failed', err);
    } finally {
      setDepositLoading(false);
    }
  };

  // Placeholder: create order function
  const placeOrder = async () => {
    // Always use English for comments and console logs in code
    if (!offer) return;

    try {
      // Fake address for placeholder
      const orderInput = {
        offer_id: offer.id,
        wallet_id: walletInfo?.id,
        quantity: buyQuantity,
      };
      const res = await axiosInstance.post('orders', orderInput);
      console.log('Order created (placeholder):', res.data);
      alert('Order placed (placeholder)');

      // Refetch TransactionHistory data and reset page to 1
      await queryClient.invalidateQueries({
        queryKey: ['orders', offer.id],
      });

      // Call the callback to reset TransactionHistory to first page
      onOrderPlaced?.();
      await fetchBalance();
    } catch (err) {
      console.error('Failed to place order (placeholder)', err);
      alert('Failed to place order (placeholder)');
    }
  };

  const handleBuy = () => {
    if (balance === null) {
      // Always use English for comments and console logs in code
      console.log('Balance not loaded yet');
      return;
    }
    if (balance >= estimatedCost) {
      // Placeholder: call API to create order
      placeOrder();
    } else {
      // Not enough balance, open deposit modal
      setShowDepositModal(true);
    }
  };

  const handleCheckEligibility = async () => {
    if (!address) {
      toast.error('Please connect your wallet to check eligibility');
      return;
    }
    if (!offer?.promotionId || !offer?.promotion?.isActive) {
      toast.error('This offer does not have a promotion');
      return;
    }
    setIsCheckingEligibility(true);
    try {
      const res = await axiosInstance.post('/promotion', {
        promotion_id: offer?.promotionId,
        address: address,
      });
      console.log('res', res?.data?.data);
      if (res?.data?.data) {
        setIsEligible(true);
      } else {
        setIsEligible(false);
      }
    } catch (error) {
      console.error('Failed to check eligibility', error);
      toast.error('Failed to check eligibility');
    } finally {
      setIsShowPromotion(true);
      setIsCheckingEligibility(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setBuyQuantity((prev) =>
      Math.max(1, Math.min((offer?.quantity || 0) - (offer?.filled || 0), prev + delta))
    );
  };

  const getCollateralColorClass = (percent: number) => {
    if (percent >= 100) return 'text-green-500';
    if (percent >= 75) return 'text-cyan-500';
    if (percent >= 50) return 'text-orange-500';
    return '';
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = transformToNumber(e.target.value);
    const availableQuantity = (offer?.quantity || 0) - (offer?.filled || 0);
    if (Number(value) > availableQuantity) {
      setBuyQuantity(availableQuantity);
    } else {
      setBuyQuantity(Number(value));
    }
  };

  const collateralColorClass = getCollateralColorClass(Number(offer?.collateralPercent || 0));

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg border-gray-300">
      <CardHeader className="p-6 pb-4">
        {/* Top Section: Token Identity, Rating */}
        <div className="flex flex-col items-start gap-4 flex-shrink-0">
          {offer?.promotionId && (
            <Badge
              variant="secondary"
              className="w-fit bg-orange-500 hover:bg-orange-600 text-white px-2 py-0.5 text-xs font-semibold"
            >
              Hot Deals
            </Badge>
          )}
          <CardTitle className="text-2xl md:text-3xl font-bold w-full">
            <div className="flex flex-col gap-2">
              <div className="w-full break-words">{offer?.title}</div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="max-w-40 w-fit">
                  <div className="w-full truncate">{offer?.tokens?.symbol}</div>
                </Badge>
                <Badge variant="secondary" className="max-w-40 w-fit">
                  <div className="w-full truncate">
                    {normalizeNetworkName(offer?.exToken?.network?.name)}
                  </div>
                </Badge>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">{offer?.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6 grid gap-6 pt-0">
        {/* Price Section - Styled like product page */}
        <div className="flex items-baseline gap-2 bg-orange-500/20 p-4 rounded-md">
          <span className="text-orange-500 text-2xl md:text-3xl font-bold">
            {formatNumberShort(offer?.price)} {offer?.exToken?.symbol}
          </span>
          {/* <span className="text-gray-500 line-through text-sm md:text-base">
            ${offer.originalPriceUSD.toLocaleString()}
          </span> */}
          {/* <Badge className="bg-shopee-red text-white text-sm font-semibold px-2 py-0.5">
            -{offer.discountPercent}%
          </Badge> */}
        </div>

        {/* Key Offer Details (Payment, Collateral, Settle Time) - Now compact on one row */}
        <div className="grid gap-4 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 flex-shrink-0">Payment with:</span>
            <div className="flex items-center gap-1 font-medium">
              <Image
                src={offer?.exToken?.logo || '/placeholder.svg'}
                alt={`${offer?.exToken?.symbol} symbol`}
                width={20}
                height={20}
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 flex-shrink-0">Collateral:</span>
            <span className={cn('font-medium', collateralColorClass)}>
              {`${offer?.collateralPercent}%`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 flex-shrink-0">Settle After TGE:</span>
            <span className="font-medium">{offer?.settleDuration} hours</span>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Quantity Selector and Estimated Cost */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-600 text-sm">Quantity</span>
            <div className="text-gray-500 text-sm">
              Balance:{' '}
              <span className="text-primary font-semibold">
                {balance !== null ? balance : '...'} {offer?.exToken?.symbol}
              </span>
            </div>
          </div>
          <div className="flex items-center border border-gray-300 rounded-md w-fit">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={buyQuantity <= 1}
              className="h-8 w-8 rounded-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={buyQuantity}
              onChange={handleQuantityInputChange}
              className="w-16 text-center border-y-0 border-x rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              min={1}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              className="h-8 w-8 rounded-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Estimated cost:{' '}
            <span className="font-bold text-primary">
              {formatNumberShort(estimatedCost)} {offer?.exToken?.symbol}
            </span>
          </div>

          {/* Add discount section */}
        </div>
        {!isShowPromotion && offer?.promotion?.isActive && (
          <div
            className="flex items-center gap-2  bg-orange-500/20 hover:bg-orange-500/30 p-4 justify-between rounded-md font-medium cursor-pointer"
            onClick={() => handleCheckEligibility()}
          >
            <div className="text-primary">Get Voucher</div>
            {isCheckingEligibility ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4 text-primary" />
            )}
          </div>
        )}
        {isShowPromotion && offer?.promotion?.isActive && (
          <>
            {isEligible ? (
              <div className="flex flex-col gap-1 bg-green-50 p-3 rounded-md">
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-sm font-medium">Voucher Applied!</span>
                </div>
                <div className="text-sm text-gray-600">
                  Discount: {offer?.promotion?.discountPercent}%
                </div>
                <div className="text-sm text-gray-600">
                  Final cost:{' '}
                  <span className="font-bold text-green-600">
                    {formatNumberShort(
                      estimatedCost * (1 - (offer?.promotion?.discountPercent || 0) / 100)
                    )}{' '}
                    {offer?.exToken?.symbol}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-600">
                  You don't have any voucher for this offer
                </div>
              </div>
            )}
          </>
        )}
        <Separator className="bg-gray-200" />

        {/* Action Button */}
        <div
          className={cn('grid gap-4', {
            'mb:grid-cols-1': offer?.promotion?.isActive,
          })}
        >
          {/* {offer?.promotion?.isActive && (
            <Button onClick={handleCheckEligibility} size="xl" disabled={buyQuantity === 0}>
              Check Eligibility
            </Button>
          )} */}
          <Button
            onClick={handleBuy}
            size="xl"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={buyQuantity === 0}
          >
            Buy Now
          </Button>
        </div>

        {/* <Separator className="bg-gray-200" /> */}

        {/* Terms and Conditions */}
        {/* <div className="grid gap-2 text-sm text-gray-600">
          <h3 className="text-lg font-semibold text-gray-800">Terms and Conditions</h3>
          <p>{offer?.description}</p>
        </div> */}
      </CardContent>

      {/* Deposit Modal */}
      {/* <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        amount={estimatedCost}
        tokenSymbol={offer.tokenSymbol}
        paymentToken={offer.paymentToken}
      /> */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-gray-300 text-center">
          <DialogHeader className="flex flex-col items-center gap-2">
            <CheckCircle className="h-12 w-12 text-green-500" /> {/* Success/Info icon */}
            <DialogTitle className="text-xl font-bold mt-2">Confirm Deposit</DialogTitle>
            {/* <DialogDescription>
                  Your balance is not enough to complete this purchase. Please deposit{' '}
                  {offer?.exToken?.symbol} to continue.
                </DialogDescription> */}
          </DialogHeader>
          <div className="py-4 grid gap-2">
            <div className="flex items-center text-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
              <Wallet className="h-5 w-5 text-gray-600" />
              <span>Required Deposit:</span>
              <span className="text-primary">
                {isEligible
                  ? formatNumberShort(
                      estimatedCost * (1 - (offer?.promotion?.discountPercent || 0) / 100) - balance
                    )
                  : formatNumberShort(estimatedCost - balance)}{' '}
                {offer?.exToken?.symbol}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              Your balance is not enough to complete this purchase. Please deposit{' '}
              {offer?.exToken?.symbol} to continue.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="flex-1" disabled={depositLoading}>
                Cancel
              </Button>
            </DialogClose>
            <div className="text-center text-gray-700 flex-1">
              {/* Deposit modal logic */}
              {allowance !== undefined && estimatedCost !== undefined ? (
                allowance < estimatedCost ? (
                  <Button onClick={handleApprove} disabled={approveLoading} className="w-full">
                    {approveLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Approving...
                      </>
                    ) : (
                      'Approve'
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleDeposit} disabled={depositLoading} className="w-full">
                    {depositLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Depositing...
                      </>
                    ) : (
                      'Deposit'
                    )}
                  </Button>
                )
              ) : (
                <div>Checking allowance...</div>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Main component for the offer detail page content
export default function OfferDetailPageContent({ offer }: OfferDetailPageContentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
      {/* Left Column: Product Images and Social Share */}
      <div className="flex flex-col gap-6 lg:col-span-1">
        {/* Main Product Image */}
        <AspectRatio
          ratio={1 / 1}
          className="
          rounded-xl overflow-hidden border border-gray-200 w-full h-auto"
        >
          <Image
            src={offer?.imageUrl || offer?.tokens?.logo || '/placeholder.svg'}
            alt={offer?.title || 'Offer Image'}
            fill
            style={{ objectFit: 'contain' }}
            className="bg-gray-200"
          />
        </AspectRatio>

        {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Chia sẻ:</span>
            <div className="flex gap-2">
              {offer?.sellerInfo?.twitterUrl && (
                <Link
                  href={offer?.sellerInfo?.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6 text-blue-500 hover:opacity-80" />
                </Link>
              )}
              {offer.telegramUrl && (
                <Link
                  href={offer.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <Send className="h-6 w-6 text-blue-400 hover:opacity-80" />
                </Link>
              )}
              {offer.websiteUrl && (
                <Link
                  href={offer.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                >
                  <Globe className="h-6 w-6 text-gray-600 hover:opacity-80" />
                </Link>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-shopee-red hover:bg-shopee-red/10"
          >
            <Heart className="h-5 w-5 fill-shopee-red" />
            <span>Đã thích (16,4k)</span>
          </Button>
        </div> */}
      </div>

      {/* Right Column: Offer Details */}
      <div className="sm:col-span-2">
        <OfferDetailsRightColumn offer={offer} />
      </div>
    </div>
  );
}
