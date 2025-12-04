import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';

const fetchMarketImpactNews = async (limit = 10) => {
  const response = await axios.get(`${API_BASE_URL}/ai/market-impact`, { params: { limit } });
  return response.data;
};

const analyzeNews = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/ai/analyze-news`, { params: { query } });
  return response.data;
};

export function useMarketImpactNews(limit = 10, options = {}) {
  return useQuery({
    queryKey: ['marketImpactNews', limit],
    queryFn: () => fetchMarketImpactNews(limit),
    staleTime: 300000,
    refetchInterval: 300000,
    ...options,
  });
}

export function useNewsAnalysis() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: analyzeNews,
    onSuccess: (data, variables) => { queryClient.setQueryData(['newsAnalysis', variables], data); },
  });

  return {
    analyze: mutation.mutate,
    analyzeAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useCachedNewsAnalysis(query) {
  return useQuery({
    queryKey: ['newsAnalysis', query],
    queryFn: () => analyzeNews(query),
    enabled: false,
    staleTime: 600000,
  });
}
