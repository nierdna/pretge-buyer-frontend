'use client';

import LoadingIcon from '@/components/LoadingIcon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CONTRACTS } from '@/contracts/contracts';
import { useEscrow } from '@/hooks/useEscrow';
import { useToken } from '@/hooks/useToken';
import { useWallet } from '@/hooks/useWallet';
import { Service } from '@/service';
import axiosInstance from '@/service/axios';
import { useAuthStore } from '@/store/authStore';
import { IOrder } from '@/types/order';
import { formatNumberShort } from '@/utils/helpers/number';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CreditCard, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DialogOrderPurchaseProps {
  order: IOrder;
  isOpen: boolean;
  onClose: () => void;
  refetchOrders: () => Promise<void>;
}

const DialogOrderPurchase = ({
  order,
  isOpen,
  onClose,
  refetchOrders,
}: DialogOrderPurchaseProps) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const { walletAddress: address, wallets } = useAuthStore();

  const chainId = order?.offer?.exToken?.network?.chainId?.toString() || '';
  const tokenAddress = order?.offer?.exToken?.address;
  const purchasedCost =
    Number(order?.amount || 0) *
    Number(order?.offer?.price || 0) *
    ((order?.collateralPercent || 0) / 100);
  const estimatedCost =
    Number(order?.amount || 0) *
    Number(order?.offer?.price || 0) *
    (1 - (order?.collateralPercent || 0) / 100);

  const { tokenContract } = useToken(tokenAddress || '', chainId);
  const contractAddress = CONTRACTS[chainId]?.ESCROW;
  const { escrowContract } = useEscrow(chainId);
  const wallet = useWallet(chainId);

  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: isAllowanceLoading,
  } = useQuery({
    queryKey: ['allowance', tokenAddress, address],
    queryFn: async () => {
      if (!tokenContract || !address) return 0;
      try {
        return await tokenContract.getAllowance(address, contractAddress);
      } catch (err) {
        console.error('Get allowance failed', err);
        return 0;
      }
    },
    enabled: !!address && !!tokenAddress,
  });

  const {
    data: balance,
    refetch: refetchBalance,
    isLoading: isBalanceLoading,
  } = useQuery({
    queryKey: ['balance', tokenAddress, address],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/wallet-ex-tokens/balance', {
          params: {
            wallet_address: address,
            ex_token_address: tokenAddress,
          },
        });
        return res.data?.balance as number;
      } catch (error) {
        return 0;
      }
    },
    enabled: !!address && !!tokenAddress,
  });

  const handleApprove = async () => {
    if (!wallet) {
      toast.error('Please connect your wallet to approve');
      return;
    }
    try {
      setApproveLoading(true);
      const txData = await tokenContract?.buildApprove(contractAddress, Number.MAX_SAFE_INTEGER);
      if (!txData) return;
      const tx = await wallet?.sendTransaction(txData);
      if (!tx) return;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await refetchAllowance();
    } catch (err: any) {
      console.error('Approve failed', err);
      toast.error(err?.message || 'Approve failed');
    } finally {
      setApproveLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!wallet) {
      toast.error('Please connect your wallet to deposit');
      return;
    }
    try {
      setDepositLoading(true);

      const txData = await escrowContract?.buildDeposit(tokenAddress!, estimatedCost);
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
      } catch (err) {
        console.error('Deposit callback API failed', err);
        throw err;
      }
      // Refetch balance
      await refetchBalance();
    } catch (err: any) {
      console.error('Deposit failed', err);
      toast.error(err?.message || 'Deposit failed');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleUpdateCollateralPercent = async () => {
    // setOrderIdTarget(order?.id);
    const walletId = wallets?.find((wallet) => wallet.address === address)?.id;
    if (!walletId) {
      toast.error('No wallet found');
      return;
    }
    try {
      setPurchaseLoading(true);
      const res = await Service.order.purchaseOrder(order?.id, walletId);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await refetchOrders();
      onClose();
    } catch (error: any) {
      console.error('Purchase failed', error);
      toast.error(error?.message || 'Purchase failed');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const renderButton = () => {
    if (isAllowanceLoading || isBalanceLoading) {
      return (
        <Button disabled className="w-full">
          Checking allowance...
        </Button>
      );
    }

    if (Number(allowance || 0) < estimatedCost) {
      return (
        <Button onClick={handleApprove} disabled={approveLoading} className="w-full">
          {approveLoading ? (
            <>
              <LoadingIcon />
              Approving...
            </>
          ) : (
            'Approve'
          )}
        </Button>
      );
    }
    if (Number(balance || 0) < estimatedCost) {
      return (
        <Button onClick={handleDeposit} disabled={depositLoading} className="w-full">
          {depositLoading ? (
            <>
              <LoadingIcon />
              Depositing...
            </>
          ) : (
            'Deposit'
          )}
        </Button>
      );
    }
    return (
      <Button onClick={handleUpdateCollateralPercent} disabled={purchaseLoading} className="w-full">
        {purchaseLoading ? (
          <>
            <LoadingIcon />
            Purchasing...
          </>
        ) : (
          'Purchase'
        )}
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <CreditCard className="h-12 w-12" /> {/* Success/Info icon */}
          <DialogTitle>Order Purchase</DialogTitle>
          <DialogDescription className="text-headline text-center">
            Purchased <span className="font-semibold">{formatNumberShort(purchasedCost)}</span>{' '}
            {order?.offer?.exToken?.symbol}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4 pt-2">
          <div className="text-secondary-foreground flex items-center justify-center gap-2 text-center text-base font-bold sm:text-lg">
            <Wallet className="text-content h-5 w-5" />
            <span>Required Purchase:</span>
            <span className="">
              {formatNumberShort(estimatedCost)} {order?.offer?.exToken?.symbol}
            </span>
          </div>
          {(balance || 0) < estimatedCost && (
            <p className="text-center text-xs text-gray-600 sm:text-sm">
              Your balance is not enough to complete this purchase. Please deposit{' '}
              {order?.offer?.exToken?.symbol} to continue.
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="flex-1" disabled={depositLoading}>
              Cancel
            </Button>
          </DialogClose>
          <div className="text-secondary-foreground flex-1 text-center">
            {/* Deposit modal logic */}
            {renderButton()}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogOrderPurchase;
