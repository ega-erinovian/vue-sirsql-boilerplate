import apiClient from "@/api/client";

/**
 * Fetches sidebar menus for a specific user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array>} A promise that resolves to an array of menus.
 */
async function getMenusByUserId(userId) {
  const result = await apiClient.get(`/menu/user/${userId}`);
  return result;
}

export default getMenusByUserId;
