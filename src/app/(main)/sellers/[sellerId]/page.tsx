import SellerDetailScreen from '@/screens/SellerDetail';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}): Promise<Metadata> {
  const { sellerId } = await params;
  return {
    title: `Seller ${sellerId} | Pre-Market`,
    description: `Profile and products for seller ${sellerId}`,
  };
}

export default async function SellerDetailPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = await params;
  return <SellerDetailScreen sellerId={sellerId} />;
}
