import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { postsService } from '@/services/posts/getPosts'

/**
 * Query keys factory for posts
 */
export const postsKeys = {
  all: ['posts'],
  lists: () => [...postsKeys.all],
  list: (filters) => [...postsKeys.lists(), { filters }],
  details: () => [...postsKeys.all, 'detail'],
  detail: (id) => [...postsKeys.details(), id],
  byUser: (userId) => [...postsKeys.all, 'byUser', userId]
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

/**
 * Hook to get a single post
 * @param {number} id - Post ID
 * @param {Object} options - Query options
 */
export function usePost(id, options = {}) {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: () => postsService.getPost(id),
    enabled: !!id, // Only run query if id is provided
    ...options
  })
}

/**
 * Hook to get posts by user
 * @param {number} userId - User ID
 * @param {Object} options - Query options
 */
export function usePostsByUser(userId, options = {}) {
  return useQuery({
    queryKey: postsKeys.byUser(userId),
    queryFn: () => postsService.getPostsByUser(userId),
    enabled: !!userId,
    ...options
  })
}

/**
 * Hook to create a new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postsService.createPost,
    onSuccess: (newPost) => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
      
      // Optimistically add the new post to the cache
      queryClient.setQueryData(postsKeys.detail(newPost.id), newPost)
    },
    onError: (error) => {
      console.error('Failed to create post:', error)
    }
  })
}

/**
 * Hook to update a post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => postsService.updatePost(id, data),
    onSuccess: (updatedPost, { id }) => {
      // Update the specific post in cache
      queryClient.setQueryData(postsKeys.detail(id), updatedPost)
      
      // Invalidate posts list to ensure consistency
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update post:', error)
    }
  })
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postsService.deletePost,
    onSuccess: (_, deletedId) => {
      // Remove the post from cache
      queryClient.removeQueries({ queryKey: postsKeys.detail(deletedId) })
      
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to delete post:', error)
    }
  })
}