import { IChain } from '@/types/chain';
import axiosInstance from './axios';

class ChainsService {
  async getChains(): Promise<IChain[]> {
    const response = await axiosInstance.get('/chains');
    return response.data;
  }
}

export default ChainsService;
