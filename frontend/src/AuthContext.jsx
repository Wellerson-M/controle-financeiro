import React, { createContext, useContext, useState, useEffect } from 'react'
import { login, register, getMe } from './api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(!!token)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      getMe(token)
        .then(setUser)
        .catch(err => {
          setError(err.message)
          setToken(null)
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const handleLogin = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await login(email, password)
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await register(email, password)
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, handleLogin, handleRegister, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
