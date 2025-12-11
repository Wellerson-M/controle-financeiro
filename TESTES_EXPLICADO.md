# 🧪 Como Funcionam os Testes - Explicação Simples

## 📌 O Básico

Testes são **pequenos programas que verificam se seu código funciona corretamente**.

Ao invés de você testar manualmente:
```
1. Abrir navegador
2. Registrar usuário
3. Fazer login
4. Adicionar transação
5. Ver resultado
```

O computador faz isso **automaticamente** e **muito mais rápido**.

---

## 🔄 Fluxo de Testes

```
Seu código
    ↓
pytest roda os testes
    ↓
    ├─ ✅ Passou? Excelente!
    └─ ❌ Falhou? Mostra o erro
```

---

## 🧪 Tipos de Testes na Sua App

### 1️⃣ **Testes Unitários** (Testam partes isoladas)

Exemplo: Verificar se a função de hash de senha funciona

```python
# app/auth.py
def get_password_hash(password):
    return pwd_context.hash(password)

# test_auth.py
def test_password_hash():
    password = "senha123"
    hashed = get_password_hash(password)
    
    # Verificar: hashed é diferente da senha original?
    assert hashed != password
    assert len(hashed) > 10
```

### 2️⃣ **Testes de Integração** (Testam endpoints da API)

Exemplo: Verificar se registrar usuário funciona

```python
def test_register():
    # 1. Fazer requisição POST /auth/register
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "senha123"}
    )
    
    # 2. Verificar resposta
    assert response.status_code == 200
    assert "access_token" in response.json()
```

### 3️⃣ **Testes E2E** (End-to-End - Fluxo completo)

Exemplo: Registrar → Login → Criar Transação

```python
def test_complete_flow():
    # 1. Registrar
    register_response = client.post("/auth/register", ...)
    token = register_response.json()["access_token"]
    
    # 2. Fazer login
    login_response = client.post("/auth/token", ...)
    
    # 3. Criar transação
    tx_response = client.post(
        "/transactions",
        headers={"Authorization": f"Bearer {token}"},
        json={...}
    )
    
    # 4. Verificar tudo funcionou
    assert register_response.status_code == 200
    assert login_response.status_code == 200
    assert tx_response.status_code == 200
```

---

## 🎯 Seu Teste Atual

Você tem um teste E2E em: `backend/app/tests/test_auth.py`

```python
def test_register_login_and_create_transaction():
    # 1. Registra usuário
    response = client.post("/auth/register", json={...})
    assert response.status_code == 200
    token = response.json()["access_token"]
    
    # 2. Faz login
    response = client.post("/auth/token", data={...})
    assert response.status_code == 200
    
    # 3. Cria transação
    response = client.post("/transactions", headers={"Authorization": f"Bearer {token}"}, json={...})
    assert response.status_code == 200
    
    # 4. Lista transações
    response = client.get("/transactions", headers={"Authorization": f"Bearer {token}"})
    assert len(response.json()) >= 1
```

**O que faz:** Simula um usuário completo indo de registro até criar uma transação.

---

## 🚀 Como Rodar Testes

### Localmente (Seu computador)

```bash
cd controleFinanceiro/backend
.\.venv\Scripts\Activate.ps1
python -m pytest -v
```

### No GitHub (Automático)

Toda vez que você faz `git push`:
1. GitHub Actions detecta mudança
2. Roda `pytest` automaticamente
3. Se falhar ❌ → mostra o erro
4. Se passar ✅ → tudo bem!

---

## 📊 Entender a Saída dos Testes

```
collected 1 item

app/tests/test_auth.py::test_register_login_and_create_transaction PASSED [100%]

======================== 1 passed in 2.34s =========================
```

Significa:
- ✅ 1 teste rodou
- ✅ 100% passaram
- ⏱️ Levou 2.34 segundos

---

## ❌ Quando Falha

```
FAILED app/tests/test_auth.py::test_register_login_and_create_transaction
AssertionError: assert 400 == 200
```

Significa:
- ❌ Teste falhou
- ❌ Retornou 400 (Bad Request) ao invés de 200 (OK)
- Algo está quebrado no código

---

## 💡 Por Que Testes São Importantes

```
Sem testes:
┌─────────────────────────┐
│ Você muda código        │
│ Tudo parece ok          │
│ Mas quebrou algo        │
│ Só descobre em produção │ ❌
└─────────────────────────┘

Com testes:
┌─────────────────────────┐
│ Você muda código        │
│ Roda testes             │
│ Encontra quebra         │
│ Corrige antes de push   │ ✅
└─────────────────────────┘
```

---

## 🔍 Seu Workflow

1. **Você desenvolve** → Muda código
2. **Você testa localmente** → `pytest`
3. **Tudo passa?** → `git push`
4. **GitHub roda testes** → Vê em Actions
5. **Tudo ok?** → ✅ Código está seguro

---

## 📚 Próximos Passos

### Adicionar Mais Testes

```python
# backend/app/tests/test_transactions.py
def test_create_transaction():
    # Arrange (preparar)
    token = criar_usuario_e_pegar_token()
    
    # Act (agir)
    response = client.post(
        "/transactions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "description": "Salário",
            "amount": 5000,
            "kind": "ganho"
        }
    )
    
    # Assert (verificar)
    assert response.status_code == 200
    assert response.json()["amount"] == 5000

def test_delete_transaction():
    # Similar...
    pass
```

### Coverage (Cobertura de Testes)

Ver quanto do seu código está sendo testado:

```bash
pip install pytest-cov
pytest --cov=app --cov-report=html
```

Gera relatório em `htmlcov/index.html`

---

## 🎯 TL;DR (Resumão)

| Conceito | Significa |
|----------|-----------|
| **Teste** | Verifica se código funciona |
| **unittest** | Testa uma função isolada |
| **Integration test** | Testa endpoints da API |
| **E2E test** | Testa fluxo completo |
| **pytest** | Ferramenta para rodar testes |
| **assert** | "Verificar se é verdadeiro" |
| **CI/CD** | Rodar testes automaticamente no GitHub |

---

Entendeu? Quer que eu adicione mais testes? 😊
