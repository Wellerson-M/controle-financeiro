import React, { useState, useEffect } from 'react'
import { createTransaction, getTransactions } from '../api'
import { useAuth } from '../AuthContext'

export default function DashboardPage() {
  const { token, user, logout } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    kind: 'expense'
  })

  useEffect(() => {
    loadTransactions()
  }, [token])

  const loadTransactions = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getTransactions(token)
      setTransactions(data)
      
      let income = 0, expense = 0
      data.forEach(tr => {
        if (tr.kind === 'income') income += tr.amount
        else expense += tr.amount
      })
      setSummary({ income, expense, balance: income - expense })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    if (!token) return
    
    try {
      const newTr = await createTransaction(token, {
        ...formData,
        amount: parseFloat(formData.amount)
      })
      setTransactions([newTr, ...transactions])
      setFormData({ description: '', amount: '', kind: 'expense' })
      setShowForm(false)
      await loadTransactions()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div className="p-4 text-center">Carregando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Controle Financeiro</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Resumo */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-gray-600">Ganhos</p>
            <p className="text-2xl font-bold text-green-600">R$ {summary.income.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-gray-600">Gastos</p>
            <p className="text-2xl font-bold text-red-600">R$ {summary.expense.toFixed(2)}</p>
          </div>
          <div className={`border-l-4 p-4 rounded ${summary.balance >= 0 ? 'bg-blue-100 border-blue-500' : 'bg-orange-100 border-orange-500'}`}>
            <p className="text-sm text-gray-600">Saldo</p>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              R$ {summary.balance.toFixed(2)}
            </p>
          </div>
        </section>

        {/* Botão Adicionar */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
          >
            {showForm ? 'Cancelar' : '+ Adicionar Transação'}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <form onSubmit={handleAddTransaction} className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Descrição</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Tipo</label>
                <select
                  value={formData.kind}
                  onChange={(e) => setFormData({...formData, kind: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="expense">Gasto</option>
                  <option value="income">Ganho</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 font-semibold"
            >
              Salvar
            </button>
          </form>
        )}

        {/* Listagem */}
        <section className="bg-white rounded-lg shadow">
          <h2 className="p-4 font-bold text-lg border-b">Últimas Movimentações</h2>
          {transactions.length === 0 ? (
            <p className="p-4 text-gray-500">Nenhuma transação ainda</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Data</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Descrição</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Tipo</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tr) => (
                    <tr key={tr.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{new Date(tr.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-2 text-sm">{tr.description}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${tr.kind === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {tr.kind === 'income' ? 'Ganho' : 'Gasto'}
                        </span>
                      </td>
                      <td className={`px-4 py-2 text-right text-sm font-semibold ${tr.kind === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {tr.kind === 'income' ? '+' : '-'} R$ {tr.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

