import axios from "axios";

// Create axios instance with base configuration
export const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
