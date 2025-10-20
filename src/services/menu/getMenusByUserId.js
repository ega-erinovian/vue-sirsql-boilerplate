import apiClient from "@/api/client"

/**
 * Get sidebar menus by user id
 * @returns {Promise<Array>} Array of menus
 */
async function getMenusByUserId(userId) {
  const response = await apiClient.get(`/menu/user/${userId}`);
  return response;
}

export default getMenusByUserId;