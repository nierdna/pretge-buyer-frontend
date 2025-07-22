'use client';

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
import { Label } from '@/components/ui/label';
import Separator from '@/components/ui/separator';
import { CONTRACTS } from '@/contracts/contracts';
import { useEscrow } from '@/hooks/useEscrow';
import { useToken } from '@/hooks/useToken';
import { useWallet } from '@/hooks/useWallet';
import axiosInstance from '@/service/axios';
import { useAuthStore } from '@/store/authStore';
import { IOffer } from '@/types/offer';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CheckCircle, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OfferDetailHeroProps {
  offer?: IOffer;
  onOrderPlaced?: () => void;
}

export default function OfferDetailHero({ offer, onOrderPlaced }: OfferDetailHeroProps) {
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [balance, setBalance] = useState<number>(0);
  const chainId = offer?.exToken?.network?.chainId?.toString() || '';
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const { walletAddress: address } = useAuthStore();
  const queryClient = useQueryClient();
  const estimatedCost = buyQuantity * Number(offer?.price || 0);

  // Đưa fetchBalance ra ngoài useEffect để có thể gọi lại
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
      const txData = await escrowContract?.buildDeposit(tokenAddress!, buyQuantity);
      if (!txData) return;
      const tx = await wallet?.sendTransaction(txData);
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
      toast.success('Order placed successfully');

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

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative min-w-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
            <Image
              src={offer?.tokens?.logo || '/placeholder.svg'}
              alt={`${offer?.tokens?.symbol} symbol`}
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="grid gap-1">
            <CardTitle className="text-2xl font-bold">{offer?.tokens?.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{offer?.tokens?.symbol}</Badge>
              <Badge variant="outline">{offer?.exToken?.network?.name}</Badge>
            </div>
          </div>
        </div>
        <CardDescription className="mt-6 text-sm text-gray-700">
          {offer?.description}
        </CardDescription>
      </CardHeader>

      <div className="px-6">
        <Separator className="bg-gray-200" />
      </div>

      <CardContent className="p-6 grid gap-6">
        {/* Price and Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-600 text-sm">Price per Token</Label>
            <div className="text-2xl font-extrabold text-primary mt-1">
              ${offer?.price.toLocaleString()}
            </div>
          </div>
          <div>
            <Label className="text-gray-600 text-sm">Quantity Available</Label>
            <div className="text-2xl font-extrabold text-gray-800 mt-1">
              {offer?.filled} / {offer?.quantity}
            </div>
          </div>
        </div>

        {/* Payment, Collateral, Settle Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Payment with:</span>
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
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Collateral:</span>
            <span className="font-medium">{`${offer?.collateralPercent}%`}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Settle After TGE:</span>
            <span className="font-medium">{offer?.settleDuration} hours</span>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Buy Section */}
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">Purchase Offer</h3>
          {/* Show balance (placeholder) */}
          <div className="text-sm text-gray-500 mb-2">
            Balance: {balance !== null ? balance : '...'} {offer?.exToken?.symbol}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="buy-quantity" className="text-gray-600">
                Quantity to Buy
              </Label>
              <Input
                id="buy-quantity"
                type="number"
                value={buyQuantity}
                onChange={(e) =>
                  setBuyQuantity(
                    Math.max(1, Math.min(offer?.quantity || 0, Number(e.target.value)))
                  )
                }
                min={1}
                max={offer?.quantity || 0}
                className="mt-1 bg-white/80 backdrop-blur-sm shadow-sm border-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-600">Estimated Cost</Label>
              <div className="text-2xl font-bold text-primary mt-1">
                ${estimatedCost.toLocaleString()}
              </div>
            </div>
          </div>
          <Button
            id="buy-now-offer-detail"
            onClick={handleBuy}
            className="w-full mt-4"
            disabled={buyQuantity === 0}
          >
            Buy Now
          </Button>
          {/* Deposit Modal (placeholder) */}
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
                    ${estimatedCost - balance} {offer?.exToken?.symbol}
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
        </div>

        <Separator className="bg-gray-200" />

        {/* Terms and Conditions */}
        <div className="grid gap-2 text-sm text-gray-600">
          <h3 className="text-lg font-semibold text-gray-800">Terms and Conditions</h3>
          <p>{offer?.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
