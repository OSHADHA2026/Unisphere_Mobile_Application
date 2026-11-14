import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLostItemById,
  getAllLostItems,
  createLostItem,
  deleteLostItem,
  updateLostItem,
  markItemAsResolved,
} from "../services/itemApi";
import { queryKeys } from "@/lib/queryKeys";

/* =========================
   🔹 QUERY: GET ONE ITEM
========================= */
export const useLostItemDetailQuery = (itemId: string) => {
  return useQuery({
    queryKey: queryKeys.lostItem(itemId),
    queryFn: () => getLostItemById(itemId),
    enabled: !!itemId,
  });
};

/* =========================
   🔹 QUERY: GET ALL ITEMS
========================= */
export const useLostItemsListQuery = () => {
  return useQuery({
    queryKey: queryKeys.lostItems,
    queryFn: getAllLostItems,
    
  });
};

/* =========================
   🔹 MUTATION: CREATE ITEM
========================= */
export const useCreateLostItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLostItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lostItems,
        refetchType: "all",
      });
    },
  });
};

/* =========================
   🔹 MUTATION: DELETE ITEM
========================= */
export const useDeleteLostItemMutation = (navigation?: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteLostItem(itemId),

    onSuccess: (_, deletedItemId) => {
      // refresh list
      queryClient.invalidateQueries({ queryKey: queryKeys.lostItems });

      // remove detail cache
      queryClient.removeQueries({ queryKey: queryKeys.lostItem(deletedItemId) });

      if (navigation) {
        navigation.goBack();
      }
    },
  });
};

export const useMarkItemAsResolvedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => markItemAsResolved(itemId),
    onSuccess: (_, itemId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lostItems,
        refetchType: "all",
      });
    },
  });
};

export const useUpdateLostItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      itemData,
    }: {
      itemId: string;
      itemData: FormData;
    }) => updateLostItem(itemId, itemData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lostItems,
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.lostItem(variables.itemId),
        refetchType: "all",
      });
    },
  });
};