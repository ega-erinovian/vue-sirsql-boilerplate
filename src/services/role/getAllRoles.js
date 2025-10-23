import apiClient from "@/api/client";

/**
 * Get all sidebar menus
 * @returns {Promise<Array>} Array of menus
 */
async function getAllRoles() {
  const response = await apiClient.get(`/role`);
  return response.data;
}

export default getAllRoles;
