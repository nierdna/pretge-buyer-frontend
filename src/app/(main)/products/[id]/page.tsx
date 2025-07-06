import ProductDetailScreen from '@/screens/ProductDetail';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  return <ProductDetailScreen productId={productId} />;
}
