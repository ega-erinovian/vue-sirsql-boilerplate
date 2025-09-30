import { authApiClient } from '@/api/authClient'

/**
 * Posts API service functions
 */
export const authService = {
  async login(payload) {
    const response = await authApiClient.post('/auth/login', payload);
    return response;
  }
}