import apiClient from "@/api/client"

/**
 * Get sidebar menus by user id
 * @returns {Promise<Array>} Array of menus
 */
async function getMenusByUserId(userId, token) {
  const response = await apiClient.get(`/menu/user/${userId}`, null, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response
}

export default getMenusByUserId;