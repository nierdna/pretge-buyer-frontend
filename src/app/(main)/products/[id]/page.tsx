import ProductDetailScreen from '@/screens/ProductDetail';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ProductDetailScreen productId={id} />;
}
