import getAllMenus from "@/services/menu/getAllMenus";
import getMenusByUserId from "@/services/menu/getMenusByUserId";
import insertMenu from "@/services/menu/insertMenu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { toast } from "vue3-toastify";

/**
 * Query keys factory for menus
 */
export const menusKeys = {
  all: ["menus"],
  lists: () => [...menusKeys.all],
};

/**
 * Hook to fetch all menus.
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useAllMenus(options = {}) {
  return useQuery({
    queryKey: computed(() => ["menus"]),
    queryFn: async () => {
      const result = await getAllMenus();
      return result || [];
    },
    ...options,
  });
}

/**
 * Hook to fetch menus for a specific user by user ID.
 * @param {string} userId - User's ID
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export function useMenusByUserId(options = {}) {
  return useQuery({
    queryKey: computed(() => menusKeys.all),
    queryFn: async () => {
      const result = await getMenusByUserId();

      return result.data || [];
    },
    ...options,
  });
}

/**
 * Hook to insert a new menu item and refresh menu list on success.
 * @returns {Object} Mutation result
 */
export function useInsertMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertMenu,
    onSuccess: () => {
      // Invalidate and refetch menu queries after successful insertion
      toast.success("Menu added successfully.");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (error) => {
      // Extract error message from API response
      const errorMessage =
        error.response?.data?.error || error.message || "An error occurred";

      toast.error(errorMessage);
      console.error("Error inserting menu:", errorMessage);
    },
  });
}
