import apiClient from '@/api/client'

/**
 * Posts API service functions
 */
export const postsService = {
  /**
   * Get all posts
   * @returns {Promise<Array>} Array of posts
   */
  async getPosts() {
    const response = await apiClient.get('/posts')
    return response.data
  },

  /**
   * Get a single post by ID
   * @param {number} id - Post ID
   * @returns {Promise<Object>} Post object
   */
  async getPost(id) {
    
    const response = await apiClient.get(`/posts/${id}`)
    return response.data
  },

  /**
   * Get posts by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of posts by user
   */
  async getPostsByUser(userId) {
    const response = await apiClient.get(`/posts?userId=${userId}`)
    return response.data
  },

  /**
   * Create a new post
   * @param {Object} postData - Post data
   * @returns {Promise<Object>} Created post
   */
  async createPost(postData) {
    const response = await apiClient.post('/posts', postData)
    return response.data
  },

  /**
   * Update a post
   * @param {number} id - Post ID
   * @param {Object} postData - Updated post data
   * @returns {Promise<Object>} Updated post
   */
  async updatePost(id, postData) {
    const response = await apiClient.put(`/posts/${id}`, postData)
    return response.data
  },

  /**
   * Delete a post
   * @param {number} id - Post ID
   * @returns {Promise<void>}
   */
  async deletePost(id) {
    await apiClient.delete(`/posts/${id}`)
  }
}