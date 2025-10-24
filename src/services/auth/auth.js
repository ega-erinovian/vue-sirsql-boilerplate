import { authApiClient } from "@/api/authClient";

/**
 * Auth API service functions
 */
export const authService = {
  async login(payload) {
    const response = await authApiClient.post("/login", payload);
    return response;
  },
  async refreshToken(token) {
    const response = await authApiClient.post("/refresh", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
};
