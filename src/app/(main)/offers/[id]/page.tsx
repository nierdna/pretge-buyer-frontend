import OfferDetailScreen from '@/screens/OfferDetail';
import { Metadata } from 'next';
import { supabase } from '@/server/db/supabase';

// Fetch offer data for metadata
async function getOfferData(offerId: string) {
  try {
    const { data: offer, error } = await supabase
      .from('offers')
      .select(
        `
        *,
        tokens:token_id (*),
        seller_wallet:seller_wallet_id (*, user:user_id (*)),
        ex_token:ex_token_id (*, network:network_id (*))
      `
      )
      .eq('id', offerId)
      .single();

    if (error || !offer) {
      return null;
    }

    return offer;
  } catch (error) {
    console.error('Error fetching offer data:', error);
    return null;
  }
}

// This would normally fetch offer data for metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: offerId } = await params;

  // Fetch real offer data
  const offer = await getOfferData(offerId);

  if (!offer) {
    // Fallback metadata if offer not found
    return {
      title: 'Offer Not Found - PreTGE Market',
      description: 'The requested offer could not be found.',
    };
  }

  // Extract useful information from offer
  const tokenInfo = offer.tokens || offer.ex_token;
  const tokenSymbol = tokenInfo?.symbol || 'Token';
  const tokenName = tokenInfo?.name || 'Unknown Token';
  const offerTitle = offer.title || `${tokenSymbol} Pre-Market Offer`;
  const price = offer.price ? `$${offer.price.toFixed(6)}` : 'Special Price';
  const sellerName = offer.seller_wallet?.user?.name || 'Verified Seller';

  // Create meaningful title and description
  const pageTitle = `${tokenSymbol} - ${offerTitle} at ${price} | PreTGE Market`;
  const description = `Buy ${tokenSymbol} (${tokenName}) from ${sellerName} at ${price}. Limited pre-market opportunity with verified seller.`;

  return {
    title: pageTitle,
    description: description,
    keywords: [
      tokenSymbol.toLowerCase(),
      tokenName.toLowerCase(),
      'token offer',
      'crypto presale',
      'pre-market deal',
      'cryptocurrency investment',
      'blockchain token',
      'verified seller',
      'limited offer',
      'exclusive deal',
    ],
    openGraph: {
      title: pageTitle,
      description: description,
      url: `https://app.pretgemarket.xyz/offers/${offerId}`,
      type: 'website',
      images: [
        {
          url: tokenInfo?.logo || '/banner.png',
          width: 1200,
          height: 630,
          alt: `${tokenSymbol} - ${offerTitle}`,
        },
      ],
    },
    twitter: {
      title: pageTitle,
      description: description,
      images: [tokenInfo?.logo || '/banner.png'],
    },
    alternates: {
      canonical: `https://app.pretgemarket.xyz/offers/${offerId}`,
    },
  };
}

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <OfferDetailScreen id={id} />
    </>
  );
}
