import React from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) return <div className="p-4 text-center">Carregando...</div>
  
  if (!token) return <Navigate to="/login" />
  
  return children
}
