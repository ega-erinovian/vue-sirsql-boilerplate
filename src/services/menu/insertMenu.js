import apiClient from "@/api/client";

/**
 * Get all sidebar menus
 * @returns {Promise<Array>} Array of menus
 */
async function insertMenu(data) {
  const response = await apiClient.post(`/menu`, data);
  return response.data;
}
export default insertMenu;
