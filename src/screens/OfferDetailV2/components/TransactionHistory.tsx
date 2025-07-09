'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetOrdersByOffer } from '@/queries/useOfferQueries';

interface TransactionHistoryProps {
  offerId: string;
}

export default function TransactionHistory({ offerId }: TransactionHistoryProps) {
  const { data, isLoading, isError } = useGetOrdersByOffer(offerId);
  console.log('data', data);
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Transaction History</CardTitle>
      </CardHeader>
      {/* <CardContent className="p-6 pt-0">
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.buyerName}</TableCell>
                  <TableCell>{tx.amount} Tokens</TableCell>
                  <TableCell className="text-right text-gray-600">{tx.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-4">No transactions yet for this offer.</p>
        )}
      </CardContent> */}
    </Card>
  );
}
