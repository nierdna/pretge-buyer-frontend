import OrdersScreen from '@/screens/Orders';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders | Pre-Market',
  description: 'View and track your orders',
};

export default function OrdersPage() {
  return <OrdersScreen />;
}
