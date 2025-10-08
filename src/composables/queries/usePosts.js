import { postsService } from '@/services/posts/postService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

/**
 * Query keys factory for posts
 */
export const postsKeys = {
  all: ['posts'],
  lists: () => [...postsKeys.all],
}

/**
 * Hook to get all posts
 * @param {Object} options - Query options
 */
export function usePosts(options = {}) {
  return useQuery({
    queryKey: postsKeys.lists(),
    queryFn: postsService.getPosts,
    ...options
  })
}