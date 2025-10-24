import apiClient from "@/api/client";

/**
 * Fetches all menus.
 * @returns {Promise<Array>} A promise that resolves to an array of menus.
 */
async function getAllMenus() {
  const response = await apiClient.get(`/menu`);
  return response.data;
}

export default getAllMenus;
