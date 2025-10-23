import getAllRoles from "@/services/role/getAllRoles";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

/**
 * Query keys factory for menus
 */
export const menusKeys = {
  all: ["roles"],
  lists: () => [...menusKeys.all],
};

/**
 * Hook to get all roles
 * @param {Object} options - Query options
 */
export function useAllRoles(options = {}) {
  return useQuery({
    queryKey: computed(() => menusKeys.all),
    queryFn: async () => {
      const result = await getAllRoles();
      return result || [];
    },
    ...options,
  });
}
