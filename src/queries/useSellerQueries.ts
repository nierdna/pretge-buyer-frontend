import { Service } from '@/service';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetSellerById = (id: string) => {
  return useQuery({
    queryKey: ['seller', id],
    queryFn: async () => {
      try {
        const response = await Service.seller.getSellerById(id);
        return response.data;
      } catch (error) {
        console.error('Error fetching seller:', error);
        toast.error('Error fetching seller');
        return undefined;
      }
    },
    enabled: !!id,
  });
};
