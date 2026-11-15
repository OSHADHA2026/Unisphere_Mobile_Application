import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import apiClient from "@/services/api";
import { currentUserQueryOptions } from "@/hooks/useUser";
import { queryKeys } from "@/lib/queryKeys";

export interface Housing {
  id: string;
  title: string;
  location: string;
  rentPrice: number;
  roomType: string;
  images?: string[];
  isMine: boolean;
  /** Full record from the API, used to open the detail page instantly. */
  raw?: any;
}

const formatHousing = (h: any, currentUserId?: string): Housing => ({
  id: typeof h._id === "string" ? h._id : typeof h.id === "string" ? h.id : "",
  title: h.title,
  location: h.address,
  rentPrice: h.rentPrice,
  roomType: h.roomType,
  images: h.images || [],
  isMine: currentUserId ? h.postedBy === currentUserId : false,
  raw: h,
});

const fetchHousings = async (queryClient: QueryClient): Promise<Housing[]> => {
  // The signed-in user is cached, so this does not add a request every time.
  const [user, housingsRes] = await Promise.all([
    queryClient.fetchQuery(currentUserQueryOptions).catch(() => null),
    apiClient.get("/housing"),
  ]);

  const currentUserId = user?._id || user?.studentId;

  const fetchedHousings = housingsRes.data.data || [];

  return fetchedHousings.map((h: any) => formatHousing(h, currentUserId));
};

export const useHousing = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.housings,
    queryFn: () => fetchHousings(queryClient),
  });

  return {
    housings: data ?? [],
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshHousings: refetch,
  };
};
