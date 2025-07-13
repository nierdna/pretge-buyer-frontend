import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMyBalance } from '@/queries/useProfile';
import { formatNumberShort } from '@/utils/helpers/number';

export default function BalanceSection() {
  const { data } = useMyBalance();
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300 h-fit">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Your Balances</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {Number(data?.balances?.length || 0) > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-500 text-sm">Token</TableHead>
                <TableHead className="text-right text-gray-500 text-sm">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.balances.map((balance) => (
                <TableRow key={balance.exTokenId}>
                  <TableCell className="font-medium text-base">
                    {balance?.exTokens?.symbol}
                  </TableCell>
                  <TableCell className="text-right font-medium text-base">
                    {formatNumberShort(balance?.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-4">No balances found.</p>
        )}
      </CardContent>
    </Card>
  );
}
