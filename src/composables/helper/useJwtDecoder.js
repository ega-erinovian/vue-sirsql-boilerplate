import { ref } from 'vue'

/**
 * Composable for decrypting and parsing JWT tokens
 * @returns {Object} - Composable functions and state
 */
export function useJwtDecoder() {
  const decodedToken = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  /**
   * Decodes a JWT token without verification (client-side only)
   * @param {string} token - The JWT token string
   * @returns {Object|null} - Decoded token payload or null if invalid
   */
  const decodeToken = (token) => {
    isLoading.value = true
    error.value = null
    decodedToken.value = null

    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: Token must be a non-empty string')
      }

      // Split the token into its three parts
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format: Token must have three parts')
      }

      // Decode the payload (second part)
      const payload = parts[1]
      
      // Base64 URL decode
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )

      const parsedPayload = JSON.parse(jsonPayload)
      
      decodedToken.value = parsedPayload
      return parsedPayload
    } catch (err) {
      error.value = err.message
      console.error('JWT decoding error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    decodedToken,
    error,
    isLoading,
    
    // Methods
    decodeToken,
  }
}