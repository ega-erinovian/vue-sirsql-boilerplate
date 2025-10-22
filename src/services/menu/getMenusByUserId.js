import apiClient from "@/api/client"

/**
 * Get sidebar menus by user id
 * @returns {Promise<Array>} Array of menus
 */
async function getMenusByUserId(userId) {
  const result = await apiClient.get(`/menu/user/${userId}`);
  return result.data;
}

export default getMenusByUserId;