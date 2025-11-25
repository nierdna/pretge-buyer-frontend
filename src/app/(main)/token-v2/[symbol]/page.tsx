import TokenDetailV2 from '@/screens/TokenDetailV2';
import { Metadata } from 'next';

interface TokenDetailV2PageProps {
  params: {
    symbol: string;
  };
}

export async function generateMetadata({ params }: TokenDetailV2PageProps): Promise<Metadata> {
  const { symbol } = params;

  return {
    title: `${symbol.toUpperCase()} - Token Details V2 | Pre-market Trading`,
    description: `View detailed information about ${symbol.toUpperCase()} token including price, market cap, investors, and exchanges.`,
    openGraph: {
      title: `${symbol.toUpperCase()} Token Details V2`,
      description: `Explore ${symbol.toUpperCase()} token metrics, investors, and trading information.`,
    },
  };
}

export default function TokenDetailV2Page({ params }: TokenDetailV2PageProps) {
  const { symbol } = params;

  return <TokenDetailV2 symbol={symbol} />;
}
