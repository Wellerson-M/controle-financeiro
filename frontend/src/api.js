const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export async function register(email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('Registro falhou')
  return res.json()
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  if (!res.ok) throw new Error('Login falhou')
  return res.json()
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Falha ao obter usuário')
  return res.json()
}

export async function createTransaction(token, data) {
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Falha ao criar transação')
  return res.json()
}

export async function getTransactions(token) {
  const res = await fetch(`${API_URL}/transactions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Falha ao obter transações')
  return res.json()
}

// Analytics
export async function getAnalyticsOverview(token) {
  const res = await fetch(`${API_URL}/analytics/overview`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Falha ao obter overview')
  return res.json()
}

export async function getAnalyticsCategories(token) {
  const res = await fetch(`${API_URL}/analytics/categories`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Falha ao obter categorias')
  return res.json()
}

export async function getAnalyticsMonthly(token) {
  const res = await fetch(`${API_URL}/analytics/monthly`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Falha ao obter mensal')
  return res.json()
}

// Budgets
export async function createBudget(token, data) {
  const res = await fetch(`${API_URL}/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Falha ao criar orçamento')
  return res.json()
}

export async function getBudgets(token) {
  const res = await fetch(`${API_URL}/budgets`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Falha ao obter orçamentos')
  return res.json()
}

export async function updateBudget(token, id, data) {
  const res = await fetch(`${API_URL}/budgets/${id}` ,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Falha ao atualizar orçamento')
  return res.json()
}

export async function deleteBudget(token, id) {
  const res = await fetch(`${API_URL}/budgets/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Falha ao remover orçamento')
  return res.json()
}
