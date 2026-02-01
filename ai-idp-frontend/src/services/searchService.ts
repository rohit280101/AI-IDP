import { api } from './api';
import { SearchRequest, SearchResponse } from '../types';

export const performSemanticSearch = async (
  query: string,
  limit: number = 10
): Promise<SearchResponse> => {
  const request: SearchRequest = { query, limit };
  const response = await api.post<SearchResponse>('/search', request);
  return response.data;
};
