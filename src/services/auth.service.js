import api from './api'
import { STORAGE_KEY } from '../utils/constants'
import { mockAuthService } from '../mocks/mockService'

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true'

const authService = {
  register: async (data) => {
    if (IS_MOCK) return mockAuthService.register(data)
    const response = await api.post('/register', data)

    const { user, token } = response.data.data
    if (token) {
      localStorage.setItem(STORAGE_KEY.TOKEN, token)
      localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(user))
    }
    return { user, token }
  },

  login: async (credentials) => {
    if (IS_MOCK) return mockAuthService.login(credentials)
    const response = await api.post('/login', credentials)

    const { user, token } = response.data.data
    localStorage.setItem(STORAGE_KEY.TOKEN, token)
    localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(user))
    return { user, token }
  },

  logout: async () => {
    if (IS_MOCK) return mockAuthService.logout()
    try {
      await api.post('/logout')
    } catch {

    } finally {
      localStorage.removeItem(STORAGE_KEY.TOKEN)
      localStorage.removeItem(STORAGE_KEY.USER)
    }
  },

  getProfile: async () => {
    if (IS_MOCK) return mockAuthService.getProfile()
    const response = await api.get('/profile')

    return { user: response.data.data }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEY.USER)
    return user ? JSON.parse(user) : null
  },

  isLoggedIn: () => !!localStorage.getItem(STORAGE_KEY.TOKEN),
}

export default authService
