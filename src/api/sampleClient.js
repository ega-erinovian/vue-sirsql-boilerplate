// api/client.js
import axios from 'axios'

// Create axios instance with base configuration
const sampleClient = axios.create({
  baseURL: import.meta.env.VITE_SAMPLE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default sampleClient