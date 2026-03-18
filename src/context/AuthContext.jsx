import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/auth.service'
import { STORAGE_KEY } from '../utils/constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEY.TOKEN)
      if (token) {
        try {

          const profile = await authService.getProfile()
          setUser(profile.user || profile)
        } catch {

          localStorage.removeItem(STORAGE_KEY.TOKEN)
          localStorage.removeItem(STORAGE_KEY.USER)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData)
    return data
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext harus dipakai di dalam <AuthProvider>')
  }
  return context
}

export default AuthContext
