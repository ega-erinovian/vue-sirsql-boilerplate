import getAllMenus from '@/services/menu/getAllMenus'
import getMenusByUserId from '@/services/menu/getMenusByUserId'
import insertMenu from '@/services/menu/insertMenu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { toast } from 'vue3-toastify'

/**
 * Query keys factory for menus
 */
export const menusKeys = {
  all: ['menus'],
  lists: () => [...menusKeys.all],
}

/**
 * Hook to get all posts by user id
 * @param {Object} options - Query options
 */
export function useAllMenus(options = {}) {
  return useQuery({
    queryKey: computed(() => ['menus']),
    queryFn: async () => {
        const result = await getAllMenus()  
        return result || []
    },
    ...options
  })
}

/**
 * Hook to get all posts by user id
 * @param {Object} options - Query options
 */
export function useMenusByUserId(userId, options = {}) {
  return useQuery({
    queryKey: computed(() => ['menus', 'user', toValue(userId)]),
    queryFn: async () => {
        const userIdVal = toValue(userId)
        
        const result = await getMenusByUserId(userIdVal)  
        
        // Return the actual data based on what getMenusByUserId returns
        return result.data || []
    },
    ...options
  })
}

/*
 * Inserts a menu item and refreshes the menu list on success. 
 */
export function useInsertMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertMenu,
    onSuccess: (data) => {
      // Invalidate and refetch menu queries after successful insertion
      toast.success("Menu added successfully.");
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
    onError: (error) => {
      // Extract error message from API response
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
      
      toast.error(errorMessage);
      console.error('Error inserting menu:', errorMessage);
    },
  });
}