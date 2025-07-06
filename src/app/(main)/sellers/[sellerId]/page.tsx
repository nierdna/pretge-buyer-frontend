import SellerDetailScreen from '@/screens/SellerDetail';
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    sellerId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sellerId } = await params;
  // You would typically fetch the seller here
  return {
    title: `Seller ${sellerId} | Pre-Market`,
    description: `Profile and products for seller ${sellerId}`,
  };
}

export default async function SellerDetailPage({ params }: Props) {
  const { sellerId } = await params;

  return <SellerDetailScreen sellerId={sellerId} />;
}
