**
 * API Client — single Axios instance
 * All requests share: baseURL, auth headers, error handling
 */
import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('frill_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handler — 401 triggers logout redirect
client.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('frill_token')
      window.location.assign('/login')
    }
    return Promise.reject(error)
  }
)

export default client