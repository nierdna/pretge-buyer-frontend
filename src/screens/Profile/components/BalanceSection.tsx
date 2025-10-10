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
    <Card className="h-fit border-border bg-foreground/50 shadow-2xl backdrop-blur-md">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Your Balances</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {Number(data?.balances?.length || 0) > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-content text-sm">Token</TableHead>
                <TableHead className="text-content text-right text-sm">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.balances.map((balance) => (
                <TableRow key={balance.exTokenId}>
                  <TableCell className="text-base font-medium">
                    {balance?.exTokens?.symbol}
                  </TableCell>
                  <TableCell className="text-right text-base font-medium">
                    {formatNumberShort(balance?.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-content py-4 text-center">No balances found.</p>
        )}
      </CardContent>
    </Card>
  );
}
