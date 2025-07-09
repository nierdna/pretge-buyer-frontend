import OfferDetailV2 from '@/screens/OfferDetailV2';

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OfferDetailV2 id={id} />;
}
