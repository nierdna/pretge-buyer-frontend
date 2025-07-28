import TokenDetailScreen from '@/screens/TokenDetail';
import { supabase } from '@/server/db/supabase';
import { Metadata } from 'next';

// Function to fetch token data from database
async function getTokenData(symbol: string) {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('*,networks:network_id(*)')
      .or(`symbol.ilike.${symbol}`)
      .single();

    if (error) {
      console.error('Error fetching token data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getTokenData:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol: symbolParam } = await params;
  const symbol = symbolParam.toUpperCase();

  // Fetch token data from database
  const tokenData = await getTokenData(symbol);

  // Use token data if available, otherwise fallback to default values
  const tokenName = tokenData?.name || `${symbol} Token`;
  const tokenDescription = `Explore ${symbol} token offers and pre-market opportunities. View current prices, seller listings, and exclusive deals for ${tokenName} on PreTGE Market.`;

  // Use banner_url from database if available, otherwise fallback to default banner
  const imageUrl = tokenData?.banner_url || '/banner.png';

  return {
    title: `${symbol} Token - Pre-Market Offers & Prices`,
    description: tokenDescription,
    keywords: [
      `${symbol} token`,
      `${symbol} price`,
      `${symbol} presale`,
      `${symbol} offers`,
      'cryptocurrency',
      'token trading',
      'pre-market deals',
      'crypto investment',
      'blockchain token',
      'digital asset',
    ],
    openGraph: {
      title: `${symbol} Token - PreTGE Market`,
      description: tokenDescription,
      url: `https://app.pretgemarket.xyz/token/${symbolParam.toLowerCase()}`,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${tokenName} Information`,
        },
      ],
    },
    twitter: {
      title: `${symbol} Token - PreTGE Market`,
      description: tokenDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://app.pretgemarket.xyz/token/${symbolParam.toLowerCase()}`,
    },
  };
}

export default async function TokenDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  return (
    <>
      <TokenDetailScreen symbol={symbol} />
    </>
  );
}
