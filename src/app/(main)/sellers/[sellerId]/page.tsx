import SellerDetailScreen from '@/screens/SellerDetail';
import { Metadata } from 'next';

type Props = {
  params: {
    sellerId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // You would typically fetch the seller here
  return {
    title: `Seller ${params.sellerId} | Pre-Market`,
    description: `Profile and products for seller ${params.sellerId}`,
  };
}

export default function SellerDetailPage({ params }: Props) {
  const sellerId = params.sellerId;

  return <SellerDetailScreen sellerId={sellerId} />;
}
