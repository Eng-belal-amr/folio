import { createContext, useContext, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('user')
    return s ? JSON.parse(s) : null
  })

  const saveAuth = (data) => {
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const u = await api.me()
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, saveAuth, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
