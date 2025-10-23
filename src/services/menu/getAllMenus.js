import apiClient from "@/api/client";

/**
 * Get all sidebar menus
 * @returns {Promise<Array>} Array of menus
 */
async function getAllMenus() {
  const response = await apiClient.get(`/menu`);
  return response.data;
}

export default getAllMenus;
