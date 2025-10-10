import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { formatNumberShort, minus } from '@/utils/helpers/number';
import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { CheckCircle, Wallet } from 'lucide-react';

interface DialogDepositProps {
  showDepositModal: boolean;
  setShowDepositModal: (show: boolean) => void;
  // isEligible: boolean;
  // estimatedCost: number;
  totalValue: number;
  // offer?: IOffer;
  exTokenSymbol: string;
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
  // isEligible,
  // estimatedCost,
  exTokenSymbol,
  totalValue,
  balance,
  allowance,
  approveLoading,
  depositLoading,
  handleApprove,
  handleDeposit,
}: DialogDepositProps) => {
  return (
    <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2">
          <CheckCircle className="h-12 w-12" /> {/* Success/Info icon */}
          <DialogTitle className="mt-2 text-xl font-bold">Confirm Deposit</DialogTitle>
          {/* <DialogDescription>
                     Your balance is not enough to complete this purchase. Please deposit{' '}
                     {offer?.exToken?.symbol} to continue.
                   </DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="text-secondary-foreground flex items-center justify-center gap-2 text-center text-base font-bold sm:text-lg">
            <Wallet className="text-content h-5 w-5" />
            <span>Required Deposit:</span>
            <span className="">
              {formatNumberShort(minus(totalValue, balance))}
              {exTokenSymbol}
            </span>
          </div>
          <p className="text-center text-xs text-gray-600 sm:text-sm">
            Your balance is not enough to complete this purchase. Please deposit {exTokenSymbol} to
            continue.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="flex-1" disabled={depositLoading}>
              Cancel
            </Button>
          </DialogClose>
          <div className="text-secondary-foreground flex-1 text-center">
            {/* Deposit modal logic */}
            {allowance !== undefined && totalValue !== undefined ? (
              allowance < totalValue ? (
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
