// api/client.js
import axios from 'axios'
import Cookies from 'js-cookie'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("🔍 [API Client] Request config:", {
      url: config.url,
      hasAuthHeader: !!config.headers.Authorization
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// For Debugging ===============>
// apiClient.interceptors.response.use(
//   (response) => {
//     console.log("✅ [API Client] Response success:", response.status);
//     return response;
//   },
//   (error) => {
//     console.error("❌ [API Client] Response error:", {
//       status: error.response?.status,
//       url: error.config?.url,
//       hasAuthHeader: !!error.config?.headers?.Authorization
//     });
//     return Promise.reject(error);
//   }
// );

export default apiClient