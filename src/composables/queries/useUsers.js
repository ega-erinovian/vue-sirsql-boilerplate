import getAllUsers from "@/services/user/getAllUsers";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

/**
 * Query keys factory for menus
 */
export const usersKeys = {
  all: ["users"],
  list: (params) => ["users", "list", params],
};

/**
 * Hook to get all users
 * @param {Object} params - Query parameters (page, limit, offset, sort)
 * @param {Object} options - Vue Query options
 */
export function useAllUsers(params = {}, options = {}) {
  return useQuery({
    queryKey: computed(() => usersKeys.list(params.value)),
    queryFn: async () => {
      const result = await getAllUsers(params.value);
      return result || [];
    },
    ...options,
  });
}
