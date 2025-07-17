export interface IEscrow {
  parseTransaction(txHash: string): Promise<any>;
  buildDeposit: (token: string, amount: number) => any;
  buildSettle: ({
    id,
    tokenTransfer,
    tokenWithdraw,
    buyerAddress,
    transferAmount,
    withdrawAmount,
    nonce,
    deadline,
    signature,
  }: {
    id: string;
    tokenTransfer: string;
    tokenWithdraw: string;
    buyerAddress: string;
    transferAmount: string;
    withdrawAmount: string;
    nonce: number;
    deadline: number;
    signature: string;
  }) => Promise<any>;
  buildCancel: ({
    id,
    token,
    amount,
    nonce,
    deadline,
    signature,
  }: {
    id: string;
    token: string;
    amount: number;
    nonce: number;
    deadline: number;
    signature: string;
  }) => Promise<any>;
  buildWithdraw: (
    userAddress: string,
    tokenAddress: string,
    amount: number,
    nonce: number
  ) => Promise<any>;
}
