import React, { useState, useEffect } from 'react'
import { createTransaction, getTransactions, getAnalyticsMonthly, getAnalyticsCategories, getBudgets, createBudget, updateBudget, deleteBudget } from '../api'
import { useAuth } from '../AuthContext'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function DashboardPage() {
  const { token, user, logout } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 })
  const [monthly, setMonthly] = useState({})
  const [byCat, setByCat] = useState({})
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    kind: 'expense'
  })

  useEffect(() => {
    loadAll()
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

  const loadAnalytics = async () => {
    if (!token) return
    const m = await getAnalyticsMonthly(token)
    setMonthly(m)
    const c = await getAnalyticsCategories(token)
    setByCat(c)
  }

  const loadBudgets = async () => {
    if (!token) return
    const list = await getBudgets(token)
    setBudgets(list)
  }

  const loadAll = async () => {
    await loadTransactions()
    await loadAnalytics()
    await loadBudgets()
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto p-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Finanças</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Resumo */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-4">
            <p className="text-sm text-gray-600">Ganhos</p>
            <p className="text-2xl font-bold text-green-600">R$ {summary.income.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-4">
            <p className="text-sm text-gray-600">Gastos</p>
            <p className="text-2xl font-bold text-red-600">R$ {summary.expense.toFixed(2)}</p>
          </div>
          <div className={`bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-4`}>
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

        {/* Gráficos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-4">
            <h2 className="font-semibold mb-2">Evolução Mensal</h2>
            <Line
              data={{
                labels: Object.keys(monthly).sort(),
                datasets: [
                  {
                    label: 'Ganhos',
                    data: Object.keys(monthly).sort().map(k => monthly[k]?.income || 0),
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)'
                  },
                  {
                    label: 'Gastos',
                    data: Object.keys(monthly).sort().map(k => monthly[k]?.expense || 0),
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)'
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-4">
            <h2 className="font-semibold mb-2">Categorias</h2>
            <Bar
              data={{
                labels: Object.keys(byCat),
                datasets: [
                  {
                    label: 'Gastos',
                    data: Object.keys(byCat).map(k => byCat[k]?.expense || 0),
                    backgroundColor: '#fde68a',
                    borderColor: '#f59e0b'
                  },
                  {
                    label: 'Ganhos',
                    data: Object.keys(byCat).map(k => byCat[k]?.income || 0),
                    backgroundColor: '#bbf7d0',
                    borderColor: '#16a34a'
                  }
                ]
              }}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
        </section>

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

        {/* Orçamentos */}
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 mt-6 p-4">
          <h2 className="font-semibold mb-3">Orçamentos por Categoria</h2>
          <BudgetManager
            budgets={budgets}
            onCreate={async (b) => { await createBudget(token, b); await loadBudgets() }}
            onUpdate={async (id, b) => { await updateBudget(token, id, b); await loadBudgets() }}
            onDelete={async (id) => { await deleteBudget(token, id); await loadBudgets() }}
            monthly={monthly}
            byCat={byCat}
          />
        </section>
      </main>
    </div>
  )
}

function BudgetManager({ budgets, onCreate, onUpdate, onDelete, monthly, byCat }) {
  const [form, setForm] = useState({ category: '', amount: '', period: new Date().toISOString().slice(0,7) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onCreate({ ...form, amount: parseFloat(form.amount) })
    setForm({ category: '', amount: '', period: new Date().toISOString().slice(0,7) })
  }

  const expenseFor = (category, period) => {
    const m = monthly[period]
    const catTotals = byCat[category]
    // Approximation using category totals; for precise month+category we'd need a dedicated endpoint.
    // Here we fallback: if monthly available, use it; else use category total.
    return catTotals?.expense || m?.expense || 0
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input className="px-3 py-2 border rounded" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input className="px-3 py-2 border rounded" type="number" step="0.01" placeholder="Valor" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <input className="px-3 py-2 border rounded" type="month" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
        <button className="px-3 py-2 bg-black text-white rounded-lg">Adicionar</button>
      </form>
      <div className="space-y-3">
        {budgets.length === 0 && <p className="text-gray-500">Nenhum orçamento criado</p>}
        {budgets.map(b => {
          const spent = expenseFor(b.category, b.period)
          const pct = Math.min(100, Math.round((spent / b.amount) * 100))
          return (
            <div key={b.id} className="p-3 border rounded-lg">
              <div className="flex justify-between mb-2">
                <div>
                  <div className="font-semibold">{b.category} — {b.period}</div>
                  <div className="text-sm text-gray-600">Meta: R$ {b.amount.toFixed(2)} • Gasto: R$ {spent.toFixed(2)}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 border rounded" onClick={() => onDelete(b.id)}>Excluir</button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div className={`h-2 rounded ${pct < 80 ? 'bg-green-500' : pct < 100 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: pct + '%' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

