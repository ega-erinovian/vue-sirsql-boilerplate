import apiClient from "@/api/client";

/**
 * Inserts a new menu into the database.
 * @param {Object} data - The menu data to be inserted.
 * @returns {Promise<Array>} A promise that resolves to the inserted menu data.
 */
async function updateRole(data) {
  const { roleId, ...request } = data;
  const response = await apiClient.put(`/role/${roleId}`, request);
  return response.data;
}
export default updateRole;
