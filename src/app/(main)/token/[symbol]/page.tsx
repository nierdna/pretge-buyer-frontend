import TokenDetail from '@/screens/TokenDetail';

export default async function TokenPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return <TokenDetail symbol={symbol} />;
}
