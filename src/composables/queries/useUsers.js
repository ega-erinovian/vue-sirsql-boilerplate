import getAllUsers from "@/services/user/getAllUsers";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";

/**
 * Query keys factory for menus
 */
export const usersKeys = {
  all: ["users"],
  list: (params) => ["users", "list", params],
  exportData: () => ["users", "all-data"],
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

export function useExportUsers(params = {}) {
  const isExporting = ref(false);
  
  const exportAllUsers = async () => {
    isExporting.value = true;
    
    try {
      // Langsung request dengan limit besar
      const response = await getAllUsers({ 
        page: 1, 
        limit: params.value.limit || 10000, // Angka besar untuk cover semua data
        start: params.value.start,
        end: params.value.end,
      });
      
      return response;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };
  
  return {
    exportAllUsers,
    isExporting
  };
}