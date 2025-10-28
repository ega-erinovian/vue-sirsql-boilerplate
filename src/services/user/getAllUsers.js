import apiClient from "@/api/client";

/**
 * Fetch all users
 * @returns {Promise<Array>} Array of users
 */
async function getAllUsers(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await apiClient.get(
    `/user?${queryString ? `${queryString}` : ""}`,
  );
  return response.data;
}

export default getAllUsers;
