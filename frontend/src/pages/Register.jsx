import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== passwordConfirm) {
      setError('Senhas não coincidem')
      return
    }

    setIsLoading(true)
    try {
      await handleRegister(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-100 p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-2 tracking-tight">Criar Conta</h1>
        <p className="text-gray-600 text-center mb-8">Comece a controlar suas finanças</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                required
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Confirmar Senha</label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                required
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm" onClick={() => setShowPasswordConfirm(v => !v)}>
                {showPasswordConfirm ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Criando conta...' : 'Registrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Já tem conta?{' '}
          <a href="/login" className="text-black font-semibold hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  )
}
