import apiClient from "@/api/client";

/**
 * Fetch all roles
 * @returns {Promise<Array>} Array of menus
 */
async function getAllRoles() {
  const response = await apiClient.get(`/role`);
  return response.data;
}

export default getAllRoles;
