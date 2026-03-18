import axios from 'axios'
import { STORAGE_KEY } from '../utils/constants'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://umkm-platform.my.id/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEY.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY.TOKEN)
      localStorage.removeItem(STORAGE_KEY.USER)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
