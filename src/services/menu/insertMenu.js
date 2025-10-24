import apiClient from "@/api/client";

/**
 * Inserts a new menu into the database.
 * @param {Object} data - The menu data to be inserted.
 * @returns {Promise<Array>} A promise that resolves to the inserted menu data.
 */
async function insertMenu(data) {
  const response = await apiClient.post(`/menu`, data);
  return response.data;
}
export default insertMenu;
