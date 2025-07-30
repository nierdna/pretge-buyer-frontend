import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { IOffer } from '@/types/offer';
import { formatNumberShort } from '@/utils/helpers/number';
import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { CheckCircle, Wallet } from 'lucide-react';

interface DialogDepositProps {
  showDepositModal: boolean;
  setShowDepositModal: (show: boolean) => void;
  isEligible: boolean;
  estimatedCost: number;
  offer?: IOffer;
  balance: number;
  allowance: number;
  approveLoading: boolean;
  depositLoading: boolean;
  handleApprove: () => Promise<void>;
  handleDeposit: () => Promise<void>;
}

const DialogDeposit = ({
  showDepositModal,
  setShowDepositModal,
  isEligible,
  estimatedCost,
  offer,
  balance,
  allowance,
  approveLoading,
  depositLoading,
  handleApprove,
  handleDeposit,
}: DialogDepositProps) => {
  return (
    <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
      <DialogContent className="border-gray-200 bg-primary-foreground text-center shadow-2xl sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2">
          <CheckCircle className="h-12 w-12" /> {/* Success/Info icon */}
          <DialogTitle className="mt-2 text-xl font-bold">Confirm Deposit</DialogTitle>
          {/* <DialogDescription>
                     Your balance is not enough to complete this purchase. Please deposit{' '}
                     {offer?.exToken?.symbol} to continue.
                   </DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="flex items-center justify-center gap-2 text-center text-base font-bold text-gray-800 sm:text-lg">
            <Wallet className="h-5 w-5 text-content" />
            <span>Required Deposit:</span>
            <span className="">
              {isEligible
                ? formatNumberShort(
                    estimatedCost * (1 - (offer?.promotion?.discountPercent || 0) / 100) - balance,
                    {
                      maxDecimalCount: 4,
                    }
                  )
                : formatNumberShort(estimatedCost - balance, {
                    maxDecimalCount: 4,
                  })}{' '}
              {offer?.exToken?.symbol}
            </span>
          </div>
          <p className="text-center text-xs text-gray-600 sm:text-sm">
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
          <div className="flex-1 text-center text-gray-700">
            {/* Deposit modal logic */}
            {allowance !== undefined && estimatedCost !== undefined ? (
              allowance < estimatedCost ? (
                <Button onClick={handleApprove} disabled={approveLoading} className="w-full">
                  {approveLoading ? (
                    <>
                      <svg className="mr-2 inline h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
                      <svg className="mr-2 inline h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
  );
};

export default DialogDeposit;
