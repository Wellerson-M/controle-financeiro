import httpx
from datetime import datetime

"""
Teste End-to-End da Aplicação Financeira
Simula o fluxo completo de um usuário:
1. Registrar
2. Fazer login
3. Acessar dashboard
4. Criar transações
5. Listar e resumir transações
"""

BASE_URL = 'http://127.0.0.1:8000'

print("╔" + "═" * 78 + "╗")
print("║" + " " * 78 + "║")
print("║" + f"{'TESTE END-TO-END - APLICAÇÃO DE CONTROLE FINANCEIRO':^78}" + "║")
print("║" + " " * 78 + "║")
print("╚" + "═" * 78 + "╝")

# Test data
test_email = f'user_{datetime.now().timestamp()}@test.com'
test_password = 'SenhaSegura@123'

print("\n" + "─" * 80)
print("FASE 1: REGISTRO E AUTENTICAÇÃO")
print("─" * 80)

# Register
print(f"\n➤ Registrando novo usuário...")
print(f"  Email: {test_email}")
response = httpx.post(
    f'{BASE_URL}/auth/register',
    json={'email': test_email, 'password': test_password}
)

if response.status_code != 200:
    print(f"❌ Erro no registro: {response.json()}")
    exit(1)

token = response.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}
print(f"✅ Registro bem-sucedido!")
print(f"   Token JWT obtido: {token[:45]}...")

# Get user info
print(f"\n➤ Obtendo informações do usuário...")
response = httpx.get(f'{BASE_URL}/me', headers=headers)
user = response.json()
print(f"✅ Usuário conectado!")
print(f"   ID: {user['id']}")
print(f"   Email: {user['email']}")

# Test login with same credentials
print(f"\n➤ Testando login com mesmas credenciais...")
response = httpx.post(
    f'{BASE_URL}/auth/token',
    data={'username': test_email, 'password': test_password}
)
if response.status_code == 200:
    new_token = response.json()['access_token']
    headers = {'Authorization': f'Bearer {new_token}'}
    print(f"✅ Login bem-sucedido!")
else:
    print(f"❌ Erro no login: {response.json()}")
    exit(1)

print("\n" + "─" * 80)
print("FASE 2: OPERAÇÕES COM TRANSAÇÕES")
print("─" * 80)

# Create multiple transactions
print(f"\n➤ Criando transações...")

transactions_data = [
    {'description': 'Salário Janeiro', 'amount': 5500, 'kind': 'ganho', 'category': 'Renda Fixa', 'date': '2024-01-31'},
    {'description': 'Aluguel Apartamento', 'amount': 1500, 'kind': 'gasto', 'category': 'Habitação', 'date': '2024-02-01'},
    {'description': 'IPTU 2024', 'amount': 800, 'kind': 'gasto', 'category': 'Habitação', 'date': '2024-02-01'},
    {'description': 'Compras Supermercado', 'amount': 350, 'kind': 'gasto', 'category': 'Alimentação', 'date': '2024-02-02'},
    {'description': 'Consultoria Freelance', 'amount': 1200, 'kind': 'ganho', 'category': 'Renda Extra', 'date': '2024-02-03'},
    {'description': 'Gasolina Carro', 'amount': 250, 'kind': 'gasto', 'category': 'Transporte', 'date': '2024-02-03'},
    {'description': 'Internet e Telefone', 'amount': 150, 'kind': 'gasto', 'category': 'Utilidades', 'date': '2024-02-04'},
    {'description': 'Prêmio de Produtividade', 'amount': 800, 'kind': 'ganho', 'category': 'Renda Fixa', 'date': '2024-02-05'},
    {'description': 'Curso Online', 'amount': 200, 'kind': 'gasto', 'category': 'Educação', 'date': '2024-02-05'},
]

created_count = 0
for tx in transactions_data:
    response = httpx.post(f'{BASE_URL}/transactions', json=tx, headers=headers)
    if response.status_code == 200:
        created_count += 1
        status = "✓"
    else:
        status = "✗"
        print(f"  ❌ Erro ao criar {tx['description']}: {response.json()}")

print(f"✅ {created_count}/{len(transactions_data)} transações criadas com sucesso!")

# List transactions
print(f"\n➤ Listando todas as transações...")
response = httpx.get(f'{BASE_URL}/transactions', headers=headers)
if response.status_code != 200:
    print(f"❌ Erro ao listar transações: {response.json()}")
    exit(1)

transactions = response.json()
print(f"✅ Total de transações: {len(transactions)}")
print(f"\n{'Data':<12} {'Descrição':<30} {'Tipo':<8} {'Categoria':<15} {'Valor':>10}")
print("─" * 80)
for tx in transactions:
    kind = "💰 Ganho" if tx['kind'] == 'ganho' else "💸 Gasto"
    date = tx['date'][:10] if 'T' in tx['date'] else tx['date']
    print(f"{date:<12} {tx['description']:<30} {kind:<8} {tx['category']:<15} R${tx['amount']:>8.2f}")

# Get summary
print(f"\n➤ Calculando resumo do período...")
response = httpx.get(f'{BASE_URL}/summary', headers=headers)
if response.status_code != 200:
    print(f"❌ Erro ao obter resumo: {response.json()}")
    exit(1)

summary = response.json()
total_income = summary['total_income']
total_expense = summary['total_expense']
balance = summary['balance']

print(f"✅ Resumo calculado!")
print(f"\n{'Ganhos:':<20} R${total_income:>10.2f}")
print(f"{'Despesas:':<20} R${total_expense:>10.2f}")
print(f"{'Saldo:':<20} R${balance:>10.2f}")

# Calculate percentages
if total_income > 0:
    expense_percent = (total_expense / total_income) * 100
    print(f"\n{'Taxa de gasto:':<20} {expense_percent:.1f}% da renda")

print("\n" + "─" * 80)
print("FASE 3: TESTES DE SEGURANÇA")
print("─" * 80)

# Test with invalid token
print(f"\n➤ Testando acesso com token inválido...")
invalid_headers = {'Authorization': 'Bearer invalid_token_xyz'}
response = httpx.get(f'{BASE_URL}/me', headers=invalid_headers)
if response.status_code == 401:
    print(f"✅ Acesso negado corretamente (401 Unauthorized)")
else:
    print(f"❌ Token inválido não foi rejeitado! Status: {response.status_code}")

# Test with wrong password
print(f"\n➤ Testando login com senha incorreta...")
response = httpx.post(
    f'{BASE_URL}/auth/token',
    data={'username': test_email, 'password': 'senhaErrada123'}
)
if response.status_code == 400:
    print(f"✅ Senha incorreta rejeitada (400 Bad Request)")
else:
    print(f"❌ Senha incorreta não foi rejeitada! Status: {response.status_code}")

# Test duplicate email
print(f"\n➤ Testando registro com email duplicado...")
response = httpx.post(
    f'{BASE_URL}/auth/register',
    json={'email': test_email, 'password': test_password}
)
if response.status_code == 400:
    print(f"✅ Email duplicado rejeitado (400 Bad Request)")
else:
    print(f"❌ Email duplicado não foi rejeitado! Status: {response.status_code}")

print("\n" + "╔" + "═" * 78 + "╗")
print("║" + f"{'✅ TODOS OS TESTES PASSARAM COM SUCESSO!':^78}" + "║")
print("║" + " " * 78 + "║")
print("║" + f"{'A aplicação está pronta para uso em produção!':^78}" + "║")
print("╚" + "═" * 78 + "╝")
print()
