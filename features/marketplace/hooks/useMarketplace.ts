import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";
import { queryKeys } from "@/lib/queryKeys";

const fetchMarketplaceItems = async (): Promise<any[]> => {
  const response = await apiClient.get("/api/marketplace");
  const data = response.data.data || response.data;
  return Array.isArray(data) ? data : [];
};

export const useMarketplace = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.marketplace,
    queryFn: fetchMarketplaceItems,
  });

  return {
    products: data ?? [],
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshProducts: refetch,
  };
};
