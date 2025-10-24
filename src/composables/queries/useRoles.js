import getAllRoles from "@/services/role/getAllRoles";
import updateRole from "@/services/role/updateRole";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { toast } from "vue3-toastify";

/**
 * Query keys for roles.
 */
export const roleKeys = {
  all: ["roles"],
  lists: () => [...roleKeys.all],
};

/**
 * Hook to fetch all roles.
 * @param {Object} options - Vue Query options
 * @returns {Object} Query result
 */
export function useAllRoles(options = {}) {
  return useQuery({
    queryKey: computed(() => roleKeys.all),
    queryFn: async () => {
      const result = await getAllRoles();
      return result || [];
    },
    ...options,
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      // Invalidate and refetch menu queries after successful insertion
      toast.success("Menu added successfully.");
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
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