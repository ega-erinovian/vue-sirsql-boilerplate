import apiClient from "@/api/client";

/**
 * Fetches sidebar menus for a specific user.
 * @returns {Promise<Array>} A promise that resolves to an array of menus.
 */
async function getMenusByUserId() {
  const result = await apiClient.get(`/menus/get-sidebar`);
  return result.data;
}

export default getMenusByUserId;
