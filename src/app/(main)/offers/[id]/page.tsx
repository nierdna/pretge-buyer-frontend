import OfferDetailScreen from '@/screens/OfferDetail';

export default function OfferDetailPage({ params }: { params: { id: string } }) {
  return <OfferDetailScreen offerId={params.id} />;
}
