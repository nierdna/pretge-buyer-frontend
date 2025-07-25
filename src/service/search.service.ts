import axiosInstance from './axios';

export interface SearchSuggestion {
  id: string;
  type: 'token';
  symbol: string;
  name: string;
  logo?: string;
  network?: string;
  displayText: string;
}

export interface SearchSuggestionsResponse {
  success: boolean;
  data: SearchSuggestion[];
  message?: string;
}

class SearchService {
  async getSuggestions(query: string, limit: number = 10): Promise<SearchSuggestionsResponse> {
    const response = await axiosInstance.get('/search/suggestions', {
      params: {
        q: query,
        limit,
      },
    });
    return response.data;
  }
}

export const searchService = new SearchService();
