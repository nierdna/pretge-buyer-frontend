import { IChain } from '@/types/chain';
import axiosInstance from './axios';

interface IChainResponse {
  success: boolean;
  data: IChain[];
}
class ChainsService {
  async getChains(): Promise<IChainResponse> {
    const response = await axiosInstance.get('/networks');
    return response.data;
  }
}

export default ChainsService;
