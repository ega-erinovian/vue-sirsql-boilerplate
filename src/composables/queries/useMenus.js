import getAllMenus from '@/services/menu/getAllMenus'
import getMenusByUserId from '@/services/menu/getMenusByUserId'
import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

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
    queryKey: computed(() => ['menus', 'user']),
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
        return result?.response || result || []
    },
    ...options
  })
}