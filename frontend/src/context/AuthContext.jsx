import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../authApi.js'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function getStoredToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    async function checkStoredToken() {
      const token = getStoredToken()
      if (!token) {
        setInitializing(false)
        return
      }
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('invalid token')
        const currentUser = await res.json()
        setUser(currentUser)
      } catch {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
      } finally {
        setInitializing(false)
      }
    }
    checkStoredToken()
  }, [])

  function storeToken(token, keepLoggedIn) {
    const storage = keepLoggedIn ? localStorage : sessionStorage
    storage.setItem('token', token)
  }

  async function login({ email, password, keepLoggedIn }) {
    const data = await loginUser({ email, password })
    storeToken(data.token, keepLoggedIn)
    setUser(data.user)
  }

  async function register({ name, email, password, keepLoggedIn }) {
    const data = await registerUser({ name, email, password })
    storeToken(data.token, keepLoggedIn)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}