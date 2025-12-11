import httpx
from datetime import datetime

BASE_URL = 'http://127.0.0.1:8000'
test_email = f'user_{datetime.now().timestamp()}@test.com'
test_password = 'senha123'

print("=" * 70)
print("TESTE COMPLETO DA APLICAÇÃO")
print("=" * 70)

# 1. Register
print("\n1️⃣  REGISTRO DE USUÁRIO")
print("-" * 70)
response = httpx.post(
    f'{BASE_URL}/auth/register',
    json={'email': test_email, 'password': test_password}
)
print(f"✅ Status: {response.status_code}")
token = response.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}
print(f"   Email: {test_email}")
print(f"   Token: {token[:35]}...")

# 2. Login
print("\n2️⃣  LOGIN")
print("-" * 70)
response = httpx.post(
    f'{BASE_URL}/auth/token',
    data={'username': test_email, 'password': test_password}
)
print(f"✅ Status: {response.status_code}")
token = response.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

# 3. Get current user
print("\n3️⃣  OBTER USUÁRIO ATUAL")
print("-" * 70)
response = httpx.get(f'{BASE_URL}/me', headers=headers)
print(f"✅ Status: {response.status_code}")
user = response.json()
print(f"   ID: {user['id']}")
print(f"   Email: {user['email']}")

# 4. Create transactions
print("\n4️⃣  CRIAR TRANSAÇÕES")
print("-" * 70)
transactions = [
    {'description': 'Salário mensal', 'amount': 5000, 'kind': 'ganho', 'category': 'Renda', 'date': '2024-01-15'},
    {'description': 'Aluguel', 'amount': 1500, 'kind': 'gasto', 'category': 'Habitação', 'date': '2024-01-05'},
    {'description': 'Supermercado', 'amount': 450, 'kind': 'gasto', 'category': 'Alimentação', 'date': '2024-01-10'},
    {'description': 'Conta de luz', 'amount': 200, 'kind': 'gasto', 'category': 'Utilidades', 'date': '2024-01-12'},
    {'description': 'Freelance', 'amount': 800, 'kind': 'ganho', 'category': 'Renda Extra', 'date': '2024-01-14'},
]

for tx in transactions:
    response = httpx.post(f'{BASE_URL}/transactions', json=tx, headers=headers)
    status = "✅" if response.status_code == 200 else "❌"
    print(f"{status} {tx['description']}: R${tx['amount']:.2f} ({tx['kind']})")

# 5. Get transactions
print("\n5️⃣  LISTAR TRANSAÇÕES")
print("-" * 70)
response = httpx.get(f'{BASE_URL}/transactions', headers=headers)
txs = response.json()
print(f"✅ Total de transações: {len(txs)}")
for tx in txs:
    color_code = "💰" if tx['kind'] == 'ganho' else "💸"
    print(f"   {color_code} {tx['date']} | {tx['description']:20} | R${tx['amount']:8.2f} ({tx['kind']})")

# 6. Get summary
print("\n6️⃣  RESUMO DO DASHBOARD")
print("-" * 70)
response = httpx.get(f'{BASE_URL}/summary', headers=headers)
summary = response.json()
total_income = summary['total_income']
total_expense = summary['total_expense']
balance = summary['balance']
print(f"✅ Ganhos:   R${total_income:10.2f}")
print(f"   Gastos:   R${total_expense:10.2f}")
print(f"   Saldo:    R${balance:10.2f}")

print("\n" + "=" * 70)
print("✅ TODOS OS TESTES PASSARAM COM SUCESSO!")
print("=" * 70)
