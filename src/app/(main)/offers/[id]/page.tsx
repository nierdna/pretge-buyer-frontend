import OfferDetailScreen from '@/screens/OfferDetail';

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OfferDetailScreen offerId={id} />;
}
